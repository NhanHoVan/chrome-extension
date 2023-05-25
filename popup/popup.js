import {
  RUNTIME,
  STORAGE,
  getElement,
  getTimeDefault,
  sortByTime,
  resetStorage,
} from "../assets/js/common.js";
(function () {
  "use strict";

  var notificationsInit = [];
  const counter = getElement("notify-count");
  const timeInput = getElement("notify-date");
  const messageInput = getElement("notify-mess");
  const notifyList = getElement("notify-list");

  const resetInput = () => {
    messageInput.value = messageInput.defaultValue;
    timeInput.value = getTimeDefault();
  };

  const assignInnerHtml = (notifications) => {
    counter.innerHTML = notifications.length;
    notifyList.innerHTML = notificationsListTemplate(notifications);
    deleteFn(notifications);
  };

  const notificationsListTemplate = (notifications) => {
    let str = "<ul>";
    if (notifications.length > 0) {
      notifications.forEach((ele) => {
        let dateTime = moment(ele.time).format(" HH:mm DD-MM-YYYY");
        str = str.concat(
          `<li><p>${ele.message}</p><div><p class="date-time">${dateTime}</p><p class="close-button" id="close-${ele.id}">&#10006;</p></div></li>`
        );
      });
    }
    return str.concat("</ul>");
  };

  const deleteFn = (notifications) => {
    const element = getElement("close-button", "class");
    for (let i = 0; i < element.length; i++) {
      let eleId = element[i].getAttribute("id");
      element[i].addEventListener("click", () => {
        let itemId = notifications.findIndex(
          (obj) => obj.id.toString() === eleId.slice(6)
        );
        if (itemId > -1) {
          notifications.splice(itemId, 1);
          STORAGE.local.set({ notifications: JSON.stringify(notifications) });
        }
      });
    }
  };

  window.addEventListener("load", () => {
    STORAGE.local.get(["notifications"], (data) => {
      notificationsInit = data.notifications
        ? JSON.parse(data.notifications)
        : [];
      assignInnerHtml(notificationsInit);
    });

    getElement("notify-date").value = getTimeDefault();

    getElement("notify-save").addEventListener("click", () => {
      let selectedTime = new Date(timeInput.value);
      if (selectedTime.getTime() <= Date.now()) {
        alert("The time selected has passed.");
      } else {
        let notificationData = {
          id: notificationsInit.length + 1,
          time: selectedTime.getTime(),
          message: messageInput.value,
        };
        notificationsInit.push(notificationData);
        sortByTime(notificationsInit);
        STORAGE.local.set({ notifications: JSON.stringify(notificationsInit) });
        resetInput();
      }
    });

    getElement("notify-reset").addEventListener("click", () => {
      resetInput();
      resetStorage(["notifications"]);
    });
  });

  STORAGE.onChanged.addListener((changes, namespace) => {
    if (changes.notifications) {
      let data = changes?.notifications.newValue;
      notificationsInit = data ? JSON.parse(data) : [];
      assignInnerHtml(notificationsInit);
    }
  });
})();
