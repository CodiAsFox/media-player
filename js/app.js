import MEDIA from "./media.js";

const log = console.log;
const warn = console.warn;
const error = console.error;
const info = console.info;

const APP = {
  audio: new Audio(),
  currentTrack: 0,
  init: () => {
    //   log(playlist);
    APP.playerView = document.getElementById("playerView");
    APP.playlist = document.getElementById("playlist");

    try {
      APP.buildPlaylist()
        .then((setlist) => {
          if (setlist.length > 0) {
            APP.playlist.innerHTML = setlist;
            APP.setlist = setlist;
          }
        })
        .then(() => {
          APP.addListeners();
          // APP.currentTrack = 0;
          // APP.loadCurrentTrack();
        });
    } catch {
      throw new Error("The MEDIA.js file couldn't be found.");
    }
  },
  addListeners: () => {
    window.addEventListener("error1", errorHandler);
    APP.audio.addEventListener("error1", audioErrorHandler);

    const tracks = APP.playlist.querySelectorAll("li");

    tracks.forEach((track) => {
      track.addEventListener("click", (ev) => {
        APP.currentTrack = track.dataset;

        APP.loadCurrentTrack();
        APP.play();
      });
    });

    // APP.playlist.querySelectorAll().addEventListener("click", (ev) => {
    //   const target = ev.target;

    //   APP.currentTrack = ev.target.dataset;

    //   log(APP.currentTrack);

    //   APP.loadCurrentTrack();
    //   APP.play();
    // });

    APP.playerView.addEventListener("click", (ev) => {
      if (ev.target.matches(".player-controls__play")) {
        APP.play();
      } else if (ev.target.matches(".player-controls__pause")) {
        APP.pause();
      }
    });
  },
  buildPlaylist: () => {
    const builder = new Promise((resolve, reject) => {
      let playlist = MEDIA.map((obj) => {
        const runtime = APP.convertTimeDisplay("");
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
                            <p class="track--time">${runtime}</p>
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
  loadCurrentTrack: () => {
    // log(APP.currentTrack);
    // const trackObj = MEDIA[APP.currentTrack];
    APP.audio.src = `./media/${APP.currentTrack.track}`;

    // log(APP.currentTrack.large);
    const albumArt = `<img src="./img/${APP.currentTrack.large}" alt="${APP.currentTrack.title} album">`;
    APP.playerView.querySelector(".img--container").innerHTML = albumArt;
    // document.querySelector
    APP.playerView.classList.add("playing");
    APP.playerView.style.backgroundImage = `url('./img/${APP.currentTrack.banner}')`;

    // log(trackObj);
  },
  play: () => {
    APP.audio.play();
  },
  pause: () => {
    APP.audio.pause();
  },
  convertTimeDisplay: (seconds) => {
    return "00:00";
  },
};

document.addEventListener("DOMContentLoaded", APP.init);
