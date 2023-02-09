// utils.js
// export function convertTimeDisplay(seconds) {
//   let minutes = Math.floor(seconds / 60);
//   minutes = minutes >= 10 ? minutes : "0" + minutes;
//   seconds = Math.floor(seconds % 60);
//   seconds = seconds >= 10 ? seconds : "0" + seconds;
//   return minutes + ":" + seconds;
// }

const log = console.log;
const warn = console.warn;
const error = console.error;
const info = console.error;

function errorHandler(ev) {
  log(ev);
  // log(ev);
  // console.log("The start event was triggered");
  displayError(ev.message, ev.type);
}
function audioErrorHandler(ev) {
  log(ev.target);
  // log(ev);
  // console.log("The start event was triggered");
  displayError("The requested song cannot be played.", ev.type);
}
function displayError(msg, type, timeout = 10000000) {
  // log("aaaa");
  switch (type) {
    case "warn":
      warn(msg);
      break;
    case "info":
      info(msg);
      break;
    case "error":
      error(msg);
      break;
    default:
      log(msg);
      break;
  }
  const errorbanner = document.createElement("div");
  errorbanner.classList.add("info-banner");
  errorbanner.classList.add(`message-${type}`);
  const timeInSeconds = Math.floor((timeout / 1000) % 60);

  errorbanner.innerHTML = `<div class="container"><p><span>${type}</span>${msg}</p><p class="bb-ft">This message will close in ${timeInSeconds} seconds</p></div>`;
  const main = document.querySelector(".system-messages");
  main.append(errorbanner);
  setTimeout(() => {
    errorbanner.classList.add("active");
    setTimeout(() => {
      errorbanner.classList.remove("active");
      setTimeout(() => {
        errorbanner.remove();
      }, 700);
    }, timeout + 10);
  }, 10);
}
