import MEDIA from "./media.js";

const APP = {
  audio: new Audio(),
  currentTrack: 0,
  init: () => {
    APP.playerView = document.getElementById("playerView");
    APP.playlist = document.getElementById("playlist");
    APP.playerControls = document.getElementById("player-controls");
    APP.totalTime = document.querySelector(".times .total-time");
    APP.currentTime = document.querySelector(".times .current-time");
    APP.progress = document.querySelector(".progress");
    APP.btnPlay = document.getElementById("btnPlay");
    APP.btnPause = document.getElementById("btnPause");
    APP.btnShuffle = document.getElementById("btnShuffle");

    try {
      APP.buildPlaylist()
        .then((setlist) => {
          if (setlist.length > 0) {
            APP.setlist = parseHTML(setlist);
            return true;
          } else {
            throw Error(`The playlist couldn't be generated`);
          }
        })
        .then(async () => {
          for (const track of MEDIA) {
            await APP.getTrackDuration(track.track)
              .then((timeSeconds) => {
                const timeMinutes = APP.convertTimeDisplay(timeSeconds);
                const totalTime = `<time datetime="${timeSeconds}" class="total-time">${timeMinutes}</time>`;

                APP.setlist.querySelector(
                  `[data-track="${track.track}"]`
                ).dataset.runtime = timeMinutes;

                return totalTime;
              })
              .then((totalTime) => {
                APP.setlist.querySelector(
                  `[data-track="${track.track}"] .track--time`
                ).innerHTML = totalTime;
              });
          }
        })
        .then(() => {
          APP.playlist.innerHTML = APP.setlist.innerHTML;
          APP.btnShuffle.disabled = false;
        })
        .then(() => {
          APP.addListeners();
          APP.currentTrack = {
            track: MEDIA[0].track,
            title: MEDIA[0].title,
            large: MEDIA[0].large,
            banner: MEDIA[0].banner,
          };
          APP.loadCurrentTrack();
        });
    } catch {
      throw new Error("The MEDIA.js file couldn't be found.");
    }
  },
  addListeners: () => {
    window.addEventListener("error", errorHandler);
    APP.audio.addEventListener("error", audioErrorHandler);
    APP.audio.addEventListener("loadeddata", (ev) => {
      let duration = APP.audio.duration;

      APP.totalTime.innerHTML = APP.convertTimeDisplay(duration);
      APP.totalTime.setAttribute("datetime", duration);
    });

    APP.audio.addEventListener("timeupdate", (ev) => {
      const currentTime = APP.audio.currentTime;
      const duration = APP.audio.duration;
      if (duration && currentTime) APP.playProgress(duration, currentTime);
    });

    const tracks = APP.playlist.querySelectorAll("li");

    tracks.forEach((track) => {
      track.addEventListener("click", (ev) => {
        const playing = APP.playlist.querySelector(".playing");

        if (playing) playing.classList.remove("playing");

        APP.currentTrack = track.dataset;
        APP.loadCurrentTrack();
        APP.play();
      });
    });

    APP.btnPlay.addEventListener("click", APP.play);
    APP.btnPause.addEventListener("click", APP.pause);
  },
  buildPlaylist: () => {
    const builder = new Promise((resolve, reject) => {
      let playlist = MEDIA.map((obj) => {
        const trackID = obj.track;

        const listItem = `<li class="track" data-track="${trackID}" data-title="${obj.title}" data-large="${obj.large}" data-banner="${obj.banner}" tabindex="0">
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
        resolve(playlist);
      } else {
        setTimeout(
          () =>
            reject(
              new Error("Something went wrong while building the playlist")
            ),
          1000
        );
      }
    });

    return builder;
  },
  getTrackDuration: (track) => {
    const duration = new Promise((resolve, reject) => {
      let trackObj = new Audio(`./media/${track}`);
      trackObj.addEventListener("loadeddata", () => {
        const duration = trackObj.duration;

        if (duration) {
          resolve(duration);
        } else {
          reject(
            new Error("Something went wrong while getting the track duration.")
          );
        }
      });
    });

    return duration;
  },
  loadCurrentTrack: () => {
    APP.audio.src = `./media/${APP.currentTrack.track}`;

    const albumArt = `<img src="./img/${APP.currentTrack.large}" alt="${APP.currentTrack.title} album">`;
    APP.playerView.querySelector(".img--container").innerHTML = albumArt;

    APP.playerView.style.backgroundImage = `url('./img/${APP.currentTrack.banner}')`;
    APP.playlist
      .querySelector(`[data-track="${APP.currentTrack.track}"]`)
      .classList.add("playing");

    APP.playerControls.classList.add("active");
    APP.btnPlay.disabled = false;
    APP.btnPause.disabled = true;
  },
  play: () => {
    APP.audio.play();
    APP.playerView.classList.add("playing");
    APP.btnPlay.disabled = true;
    APP.btnPause.disabled = false;
  },
  pause: () => {
    APP.audio.pause();
    APP.playerView.classList.remove("playing");
    APP.btnPlay.disabled = false;
    APP.btnPause.disabled = true;
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
    APP.progress.style.width = `${progress.toFixed(2)}%`;
  },
};

document.addEventListener("DOMContentLoaded", APP.init);
