import MEDIA from "./media.js";
const APP = {
  audio: new Audio(),
  currentTrack: 0,
  appName: "madTunes",
  init: () => {
    APP.navbar = document.querySelector(".main-nav");
    APP.playerView = document.getElementById("playerView");
    APP.playlist = document.getElementById("playlist");
    APP.playerControls = document.getElementById("player-controls");
    APP.totalTime = document.querySelector(".times .total-time");
    APP.currentTime = document.querySelector(".times .current-time");
    APP.progress = document.querySelector(".progress .played");
    APP.btnPlayPause = document.getElementById("btnPlayPause");
    APP.btnShuffle = document.getElementById("btnShuffle");

    try {
      APP.constructPlayer();
      APP.addListeners();
      MEDIA.forEach((track, index) => {
        APP.getTrackDuration(track, index);
      });
    } catch {
      throw new Error("The MEDIA.js file couldn't be found.");
    }
  },
  constructPlayer: () => {
    const setlist = APP.buildPlaylist();
    if (setlist.length > 0) {
      APP.setlist = parseHTML(setlist);

      APP.playlist.innerHTML = APP.setlist.innerHTML;
      APP.btnShuffle.disabled = false;

      APP.currentTrack = 0;
      APP.loadCurrentTrack();
    } else {
      throw Error(`The playlist couldn't be generated`);
    }
  },
  addListeners: () => {
    window.addEventListener("error", errorHandler);
    APP.audio.addEventListener("error", audioErrorHandler);
    APP.audio.addEventListener("loadeddata", APP.loadDuration);
    APP.audio.addEventListener("ended", APP.next);
    APP.audio.addEventListener("timeupdate", APP.updateTimestamp);
    APP.playlist.addEventListener("click", APP.playSelected);
    APP.playerControls.addEventListener("click", APP.controls);
    APP.btnShuffle.addEventListener("click", APP.shuffle);

    const progressBar = document.querySelector(".progress");

    progressBar.addEventListener("mousemove", function (ev) {
      const position = (ev.offsetX * 100) / progressBar.clientWidth;
      progressBar.style.background = `linear-gradient(90deg, var(--played) 0%, var(--played) ${position}%, var(--progress-indicator) ${position}%, var(--progress-indicator) 100%)`;
    });

    progressBar.addEventListener("mouseleave", (ev) => {
      progressBar.style.background = "";
    });
  },
  loadDuration: () => {
    let duration = APP.audio.duration;
    APP.totalTime.innerHTML = APP.convertTimeDisplay(duration);
    APP.totalTime.setAttribute("datetime", duration);
  },
  updateTimestamp: () => {
    const currentTime = APP.audio.currentTime;
    const duration = APP.audio.duration;
    if (duration && currentTime) APP.playProgress(duration, currentTime);
  },
  playSelected: (ev) => {
    APP.removePlaying();

    const track = ev.target.closest(".track");
    APP.currentTrack = track.dataset.track;
    APP.loadCurrentTrack();
    APP.play();

    track.classList.contains("playing");
  },
  removePlaying: () => {
    const playing = APP.playlist.querySelector(".playing");
    if (playing) playing.classList.remove("playing");
  },
  shuffle: () => {
    MEDIA.shuffle();
    APP.constructPlayer();

    MEDIA.forEach((_, index) => {
      APP.displayTrackDuration(index);
    });

    APP.play();
  },
  buildPlaylist: () => {
    const playlist = MEDIA.map((obj, index) => {
      const listItem = `<li class="track" data-track="${index}" tabindex="0">
                    <div class="track--thumb">
                        <img src="./img/${obj.thumbnail}" alt="${obj.title} art">
                    </div>
                    <div class="track--info">
                        <div class="track--metadata">
                            <p class="track--title">${obj.title}</p>
                            <div class="track--record">
                                <p class="track--artist">${obj.artist}</p>
                            </div>
                        </div>
                        <div class="track--runtime">
                            <p class="track--time"><span class="loader small"></span></p>
                        </div>
                    </div>
                </li>`;
      return listItem;
    }).join("");
    if (playlist) {
      return playlist;
    } else {
      throw new Error("Something went wrong while building the playlist");
    }
  },
  getTrackDuration: ({ track }, index) => {
    const trackObj = new Audio(`./media/${track}`);
    trackObj.addEventListener("durationchange", (ev) => {
      MEDIA[index]["runtime"] = ev.target.duration;
      APP.displayTrackDuration(index);
    });
  },
  displayTrackDuration: (index) => {
    const duration = MEDIA[index]["runtime"];
    const timeMinutes = APP.convertTimeDisplay(duration);
    const totalTime = `<time datetime="${duration}" class="total-time">${timeMinutes}</time>`;

    APP.playlist.querySelector(
      `[data-track="${index}"] .track--time`
    ).innerHTML = totalTime;
  },
  loadCurrentTrack: () => {
    let track = MEDIA[APP.currentTrack];

    APP.audio.src = `./media/${track.track}`;
    document.title = `${APP.appName} | Playing ${track.title} by ${track.artist}`;
    const albumArt = `<img src="./img/${track.large}" alt="${track.title} album">`;
    APP.playerView.querySelector(".img--container").innerHTML = albumArt;

    APP.playerView.style.backgroundImage = `url('./img/${track.banner}')`;
    APP.playlist
      .querySelector(`[data-track="${APP.currentTrack}"]`)
      .classList.add("playing");

    APP.playerControls.classList.add("active");
    APP.btnPlayPause.disabled = false;

    // if (window.innerWidth > 959) {
    APP.playlist
      .querySelector(`[data-track="${APP.currentTrack}"]`)
      .scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "start",
      });
    // }
  },
  controls: (ev) => {
    const btn = ev.target.closest(".btn");
    const progress = ev.target.closest(".progress");
    if (progress) {
      const time = MEDIA[APP.currentTrack]["runtime"];
      const position = ev.offsetX / progress.clientWidth;
      APP.audio.currentTime = position * time;
    }

    if (btn) {
      const action = btn.dataset.action;

      switch (action) {
        case "play":
          APP.play();
          break;
        case "pause":
          APP.pause();
          break;
        case "prev":
          APP.previous();
          break;
        case "next":
          APP.next();
          break;
      }
    }
  },
  play: () => {
    APP.audio.play();
    APP.playerView.classList.add("playing");
    APP.navbar.classList.add("playing");
    APP.btnPlayPause.title = "Pause";
    APP.btnPlayPause.dataset.action = "pause";
    APP.btnPlayPause.querySelector("i").innerHTML = "pause";
  },
  pause: () => {
    APP.audio.pause();
    APP.playerView.classList.remove("playing");
    APP.navbar.classList.remove("playing");
    APP.btnPlayPause.title = "Play";
    APP.btnPlayPause.dataset.action = "play";
    APP.btnPlayPause.querySelector("i").innerHTML = "play_arrow";
  },
  previous: () => {
    APP.removePlaying();
    if (APP.currentTrack == 0) {
      APP.currentTrack = MEDIA.length - 1;
    } else {
      APP.currentTrack--;
    }

    APP.loadCurrentTrack();
    APP.play();
  },
  next: () => {
    APP.removePlaying();
    if (APP.currentTrack == MEDIA.length - 1) {
      APP.currentTrack = 0;
    } else {
      APP.currentTrack++;
    }
    APP.loadCurrentTrack();
    APP.play();
  },
  convertTimeDisplay: (seconds) => {
    let minutes = Math.floor(seconds / 60);
    minutes = minutes >= 10 ? minutes : "0" + minutes;
    seconds = Math.floor(seconds % 60);
    seconds = seconds >= 10 ? seconds : "0" + seconds;
    return minutes + ":" + seconds;
  },
  playProgress: (duration, currentTime) => {
    APP.currentTime.innerHTML = APP.convertTimeDisplay(currentTime);
    APP.currentTime.setAttribute("datetime", currentTime);
    const progress = (currentTime / duration) * 100;
    APP.progress.style.width = `${progress.toFixed(2)}vw`;
  },
};

document.addEventListener("DOMContentLoaded", APP.init);
