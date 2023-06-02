const notify = (message) => {
  return chrome.notifications.create("", {
    type: "basic",
    title: "Notify!",
    message: message || "Notify!",
    iconUrl: "assets/icons/icon-128.png",
  });
};

// const sendNotification = (notifications) => {
//   if (notifications.length > 0) {
//     let notify = notifications[0];
//     let delay = notify.time - Date.now();
//     setTimeout(function () {
//       RUNTIME.sendMessage("", {
//         type: "notification",
//         message: notify.message,
//       });
//       notifications.splice(notifications.indexOf(notify), 1);
//       STORAGE.local.set({ notifications: JSON.stringify(notifications) });
//     }, delay);
//   }
// };

chrome.alarms.onAlarm.addListener(function (alarm) {
  console.log(alarm);
});
