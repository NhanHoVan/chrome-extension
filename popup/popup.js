(function () {
  "use strict";

  const ELEMENT = document.documentElement;
  const RUNTIME = chrome.runtime;
  const STORAGE = chrome.storage;

  // Common function
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

  //Go to Options page
  // select("#options-link").addEventListener("click", function () {
  //   if (RUNTIME.openOptionsPage) {
  //     RUNTIME.openOptionsPage();
  //   } else {
  //     window.open(RUNTIME.getURL("options.html"));
  //   }
  // });

  // var timeInput = document.getElementById('timeInput').value;
  // var messageInput = document.getElementById('messageInput').value;

  // var selectedTime = new Date(timeInput);

  // if (selectedTime.getTime() < Date.now()) {
  //   alert('Thời gian đã chọn đã qua.');
  // } else {
  //   var notificationData = {
  //     time: selectedTime.getTime(),
  //     message: messageInput
  //   };

  //   var existingData = localStorage.getItem('notifications');
  //   var notifications = existingData ? JSON.parse(existingData) : [];

  //   notifications.push(notificationData);

  //   localStorage.setItem('notifications', JSON.stringify(notifications));

  //   var delay = selectedTime.getTime() - Date.now();

  //   setTimeout(function() {
  //     if ('Notification' in window) {
  //       Notification.requestPermission().then(function(permission) {
  //         if (permission === 'granted') {
  //           var storedData = localStorage.getItem('notifications');
  //           var storedNotifications = storedData ? JSON.parse(storedData) : [];
  //           storedNotifications.forEach(function(notification) {
  //             if (notification.time === selectedTime.getTime()) {
  //               var notification = new Notification('Tin nhắn mới', { body: notification.message });
  //               storedNotifications.splice(storedNotifications.indexOf(notification), 1);
  //             }
  //           });
  //           localStorage.setItem('notifications', JSON.stringify(storedNotifications));
  //         }
  //       });
  //     }
  //   }, delay);
  // }

  const counter = getElement("notify-count");
  const timeInput = getElement("notify-date");
  const messageInput = getElement("notify-mess");
  const notifyList = getElement("notify-list");

  const getTimeDefault = (number = 1) => {
    var now = new Date();
    now.setHours(now.getHours() + number);
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    now.setMilliseconds(null);
    now.setSeconds(null);
    return now.toISOString().slice(0, -1);
  }

  const resetInput = () => {
    messageInput.value = messageInput.defaultValue;
    timeInput.value = getTimeDefault();
  };

  const resetStorage = () => {
    STORAGE.local.clear();
    counter.innerHTML = 0;
    notifyList.innerHTML = "";
    messageInput.value = messageInput.defaultValue;
    timeInput.value = getTimeDefault();
  };

  const deleteFn = () => {
    const element = getElement("close-button", "class");
    for (let i = 0; i < element.length; i++) {
      let eleId = element[i].getAttribute("id");
      element[i].addEventListener("click", () => {
        STORAGE.local.get(["notifications"], (data) => {
          let notifications = data.notifications
            ? JSON.parse(data.notifications)
            : [];
          let itemId = notifications.findIndex(obj => obj.id.toString() === eleId.slice(6))
          if (itemId > -1) {
            notifications.splice(itemId, 1);
          }
          STORAGE.local.set({ notifications: JSON.stringify(notifications) });
          assignInnerHtml(notifications);
        });
      });
    }
  };

  const assignInnerHtml = (data) => {
    notifyList.innerHTML = notificationsListTemplate(data);
    counter.innerHTML = data.length;
    deleteFn();
  }

  const notificationsListTemplate = (data) => {
    let str = "<ul>";
    if (data.length > 0) {
      data.forEach((ele) => {
        let dateTime = moment(ele.time).format(" HH:mm DD-MM-YYYY");
        str = str.concat(
          `<li><p>${ele.message}</p><div><p class="date-time">${dateTime}</p><p class="close-button" id="close-${ele.id}">&#10006;</p></div></li>`
        );
      });
    }
    return str.concat("</ul>");
  };

  getElement("notify-save").addEventListener("click", () => {
    let selectedTime = new Date(timeInput.value);
    if (selectedTime.getTime() <= Date.now()) {
      alert("The time selected has passed.");
    } else {
      STORAGE.local.get("notifications", (data) => {
        let notifications = data.notifications
          ? JSON.parse(data.notifications)
          : [];
        let notificationData = {
          id: notifications.length + 1,
          time: selectedTime.getTime(),
          message: messageInput.value,
        };
        notifications.push(notificationData);
        assignInnerHtml(notifications);
        STORAGE.local.set({ notifications: JSON.stringify(notifications) });
        resetInput();
      });
    }
  });

  getElement("notify-reset").addEventListener("click", () => {
    resetStorage();
  });

  STORAGE.local.get(["notifications"], (data) => {
    let notifications = data.notifications
      ? JSON.parse(data.notifications)
      : [];
    assignInnerHtml(notifications);
  });

  window.addEventListener('load', () => {
    getElement("notify-date").value = getTimeDefault();
  });
})();
