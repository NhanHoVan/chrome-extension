import {
  RUNTIME,
  STORAGE,
  getElement,
  getTimeDefault,
  sortByTime,
  resetStorage,
  logError,
  logMessage
} from "../assets/js/common.js";
(function () {
  "use strict";

  var notificationsInit = [];
  const counter = getElement("notify-count");
  const timeInput = getElement("notify-date");
  const messageInput = getElement("input-message");
  const notifyList = getElement("notify-list");
  const notifyMessage = getElement("notify-message");

  const resetInput = () => {
    messageInput.value = messageInput.defaultValue;
    timeInput.value = getTimeDefault();
  };

  const assignInnerHtml = (notifications) => {
    counter.innerHTML = notifications.length;
    while (notifyList.hasChildNodes()) {
      notifyList.removeChild(notifyList.firstChild);
    }
    notifyList.appendChild(notificationsListTemplate(notifications));
    deleteFn(notifications);
  };

  const notificationsListTemplate = (notifications) => {
    const renderUl = document.createElement("ul");
    if (notifications.length > 0) {
      notifications.forEach((ele) => {
        const renderLi = document.createElement("li");
        const renderP = document.createElement("p");
        renderP.textContent = ele.message;
        const renderDiv = document.createElement("div");
        const renderP1 = document.createElement("p");
        renderP1.classList.add("date-time");
        renderP1.textContent = moment(ele.time).format(" HH:mm DD-MM-YYYY");
        renderDiv.appendChild(renderP1);
        const renderP2 = document.createElement("p");
        renderP2.classList.add("close-button");
        renderP2.id = `close-${ele.id}`;
        renderP2.innerHTML = "&#10006;";
        renderDiv.appendChild(renderP2);
        renderLi.appendChild(renderP);
        renderLi.appendChild(renderDiv);
        renderUl.appendChild(renderLi);
      });
    }
    return renderUl;
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
          try {
            STORAGE.local.set({ notifications: JSON.stringify(notifications) });
          } catch (error) {
            logError(error);
          }
        }
      });
    }
  };

  window.addEventListener("load", () => {
    try {
      STORAGE.local.get(["notifications"], (data) => {
        notificationsInit = data.notifications
          ? JSON.parse(data.notifications)
          : [];
        assignInnerHtml(notificationsInit);
      });
    } catch (error) {
      logError(error);
    }

    getElement("notify-date").value = getTimeDefault();

    getElement("notify-save").addEventListener("click", () => {
      let selectedTime = new Date(timeInput.value);
      if (selectedTime.getTime() <= Date.now()) {
        notifyMessage.appendChild(logMessage("The time selected has passed.", "error"));
        setTimeout(() => {
          notifyMessage.removeChild(notifyMessage.firstChild)
        }, 3000);
      } else {
        let notificationData = {
          id: notificationsInit.length + 1,
          time: selectedTime.getTime(),
          message: messageInput.value,
        };
        notificationsInit.push(notificationData);
        sortByTime(notificationsInit);
        try {
          STORAGE.local.set({ notifications: JSON.stringify(notificationsInit) });
        } catch (error) {
          logError(error);
        }
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
