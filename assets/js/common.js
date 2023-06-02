const ELEMENT = document.documentElement;
const RUNTIME = chrome.runtime;
const STORAGE = chrome.storage;
const ALARMS = chrome.alarms;

const select = (el, all = false) => {
  el = el.trim();
  if (all) {
    return [...document.querySelectorAll(el)];
  } else {
    return document.querySelector(el);
  }
};

const getElement = (el, type = "id") => {
  el = el.trim();
  switch (type) {
    case "id":
      return document.getElementById(el);
    case "class":
      return document.getElementsByClassName(el);
    case "name":
      return document.getElementsByName(el);
    case "tag":
      return document.getElementsByTagName(el);
    default:
      break;
  }
};

const getTimeDefault = (number = 1) => {
  var now = new Date();
  now.setHours(now.getHours() + number);
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  now.setMilliseconds(null);
  now.setSeconds(null);
  return now.toISOString().slice(0, -1);
};

const sortByTime = (data) => {
  return data.sort((a, b) => a.time - b.time);
};

const resetStorage = (itemArr = null, all = false) => {
  if (all) {
    STORAGE.local.clear();
  } else {
    STORAGE.local.remove(itemArr, function () {
      var error = RUNTIME.lastError;
      if (error) {
        logError(error);
      }
    });
  };
};

const logError = (error) => {
  const date = new Date();
  const pad = (val, len = 2) => val.toString().padStart(len, '0');
  const h = pad(date.getHours());
  const m = pad(date.getMinutes());
  const s = pad(date.getSeconds());
  const ms = pad(date.getMilliseconds(), 3);
  const time = `${h}:${m}:${s}.${ms}`;
  console.log(`[${time}] ${error}`);
};

const logMessage = (message, type) => {
  const renderMess = document.createElement('p');
  renderMess.classList.add(`mess-${type}`)
  renderMess.textContent = message;
  return renderMess;
};

export {  ELEMENT, RUNTIME, STORAGE, ALARMS, select, getElement, getTimeDefault, sortByTime, resetStorage, logError, logMessage };
