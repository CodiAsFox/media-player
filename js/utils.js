const log = console.log;
const warn = console.warn;
const error = console.error;
const info = console.error;

function errorHandler(ev) {
  displayError(ev.message, ev.type);
}
function audioErrorHandler(ev) {
  log(ev.target);
  displayError("The requested song cannot be played.", ev.type);
}
function displayError(msg, type, timeout = 10000) {
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

const parseHTML = (string) => {
  const obj = new DOMParser();
  const domObj = obj.parseFromString(string, "text/html");
  return domObj.body;
};

Array.prototype.shuffle = function () {
  this.forEach(function (item, index, arr) {
    let other = Math.floor(Math.random() * arr.length);
    [arr[other], arr[index]] = [arr[index], arr[other]];
  });
  return this;
};
