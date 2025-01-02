"use strict";
/// <reference types="chrome"/>
// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
    // Initialize storage with empty todos
    chrome.storage.local.set({
        todos: [],
    });
});
// Listen for alarms (for notifications)
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name.startsWith("todo-")) {
        chrome.notifications.create(alarm.name, {
            type: "basic",
            iconUrl: "icons/icon128.png",
            title: "Todo Reminder",
            message: "You have a pending todo item!",
            priority: 2,
        });
    }
});
