import { STORAGE, ALARMS, logError } from "./assets/js/common.js";

var notificationsInit = [];
const options = {
  type: "basic",
  title: "Notify!",
  message: "Notify!",
  iconUrl: "assets/icons/icon-128.png",
};

const notify = (message, notification) => {
  options.message = message;
  chrome.notifications.create('', options, () => {
    notificationsInit = notificationsInit.filter((item) => {
      return item.id !== notification.id;
    });
    try {
      STORAGE.local.set({ notifications: JSON.stringify(notificationsInit) });
    } catch (error) {
      logError(error);
    }
  });
}

const getDelayInMinutes = (timeDate) => {
  let timeInMilliseconds = new Date(timeDate).getTime();
  let currentTime = Date.now();

  return (timeInMilliseconds - currentTime) / (1000 * 60);
}

const deleteAllAlarm = () => {
  ALARMS.clearAll(function(wasCleared) {
    if (wasCleared) {
      logError("Successfully cleared all alarms");
    } else {
      logError("No alarms exist to clear");
    }
  });
}

try {
  STORAGE.local.get(["notifications"], (data) => {
    notificationsInit = data.notifications
      ? JSON.parse(data.notifications)
      : [];
  });
} catch (error) {
  logError(error);
}

STORAGE.onChanged.addListener((changes, namespace) => {
  if (changes.notifications) {
    let data = changes?.notifications.newValue;
    notificationsInit = data ? JSON.parse(data) : [];
    deleteAllAlarm();
    if (notificationsInit.length > 0) {
      notificationsInit.forEach((notification) => {
        let timeDate = notification.time;
        let message = notification.message;

        let timeInMinutes = getDelayInMinutes(timeDate)
      
        if (!isNaN(timeInMinutes)) {
          ALARMS.create('notificationAlarm' + notification.id, { delayInMinutes: timeInMinutes });
        }
      
        ALARMS.onAlarm.addListener((alarm) => {
          if (alarm.name === 'notificationAlarm' + notification.id) {
            notify(message, notification);
          }
        });
      });
    }
  }
});
