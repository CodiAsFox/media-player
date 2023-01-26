const log = console.log;
// const warn = console.warn;
// const error = console.error;

import MEDIA1 from "./media.js";

// To assign event
const errorHandler = new Event("error");

// To trigger the event Listener
window.addEventListener("error", (msg) => {
  log(msg);
  console.log("The start event was triggered");
});

const APP = {
  audio: new Audio(), //the Audio Element that will play every track
  currentTrack: 0, //the integer representing the index in the MEDIA array
  init: () => {
    //called when DOMContentLoaded is triggered
    log("init");
    APP.addListeners();

    try {
      if (MEDIA.length > 0) APP.buildPlaylist();
      else APP.error("bbbbb");
    } catch {
      log("error");
      //   dispatchEvent("error");
      //   log(APP.error("dddd"));
      APP.error("dddd");
    }
  },
  addListeners: () => {
    //add event listeners for interface elements
    //add event listeners for APP.audio
    // APP.error = document.createEvent("error");

    // To trigger the Event
    APP.error = (msg) => {
      document.dispatchEvent(errorHandler, msg);
    };
  },
  buildPlaylist: () => {
    log(MEDIA);
  },
  loadCurrentTrack: () => {
    //use the currentTrack value to set the src of the APP.audio element
  },
  play: () => {
    //start the track loaded into APP.audio playing
  },
  pause: () => {
    //pause the track loaded into APP.audio playing
  },
  convertTimeDisplay: (seconds) => {
    //convert the seconds parameter to `00:00` style display
  },
};

// function errorHandler(ev) {
//   //do what you want when the audio/video track cannot load
//   // ev.type = 'error'
//   console.error("aaaaa", ev);
// }

// window.addEventListener("error", errorHandler);

document.addEventListener("DOMContentLoaded", APP.init);
