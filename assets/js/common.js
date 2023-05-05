(function () {
  "use strict";

  const ELEMENT = document.documentElement;
  const RUNTIME = chrome.runtime;
  const STORAGE = chrome.storage;

  /**
   * Selector function
   */
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
      case "className":
        return document.getElementsByClassName(el);
      case "name":
        return document.getElementsByName(el);
      case "tagName":
        return document.getElementsByTagName(el);
      default:
        break;
    }
  };
})();
