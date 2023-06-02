function createAlarm(alarmName, delay, period = null) {
  chrome.alarms.create(alarmName, {
    delayInMinutes: delay,
    periodInMinutes: period,
  });
}

function cancelAlarm(alarmName) {
  chrome.alarms.clear(alarmName);
}
