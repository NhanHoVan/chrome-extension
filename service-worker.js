chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "notification") notify(request.message);
});

const notify = (message) => {
  return chrome.notifications.create("", {
    type: "basic",
    title: "Notify!",
    message: message || "Notify!",
    iconUrl: "assets/icons/icon-128.png",
  });
};
