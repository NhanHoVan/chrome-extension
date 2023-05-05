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

  //Go to Options page
  select("#go-to-options").addEventListener("click", function () {
    if (RUNTIME.openOptionsPage) {
      RUNTIME.openOptionsPage();
    } else {
      window.open(RUNTIME.getURL("options.html"));
    }
  });

  //Send Notification
  const text = getElement("notify-text");
  const counter = getElement("notify-count");

  getElement("notify-button").addEventListener("click", () => {
    chrome.runtime.sendMessage("", {
      type: "notification",
      message: text.value,
    });
  });

  STORAGE.local.get(["notifyCount"], (data) => {
    let value = data.notifyCount || 0;
    counter.innerHTML = value;
  });

  STORAGE.onChanged.addListener((changes, namespace) => {
    if (changes.notifyCount) {
      let value = changes.notifyCount.newValue || 0;
      counter.innerHTML = value;
    }
  });

  getElement("notify-reset").addEventListener("click", () => {
    STORAGE.local.clear();
    text.value = "";
  });
})();
