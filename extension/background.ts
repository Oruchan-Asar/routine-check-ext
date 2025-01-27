/// <reference types="chrome"/>

interface Routine {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  // Initialize storage with empty routines and history
  const today = new Date().toISOString().split("T")[0];
  chrome.storage.local.set({
    currentRoutines: [],
    routineHistory: {
      [today]: [],
    },
  });

  // Set up daily refresh alarm
  chrome.alarms.create("daily-refresh", {
    periodInMinutes: 1440, // 24 hours
    when: getNextMidnight(),
  });
});

function getNextMidnight(): number {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.getTime();
}

// Listen for alarms
chrome.alarms.onAlarm.addListener(async (alarm: chrome.alarms.Alarm) => {
  if (alarm.name === "daily-refresh") {
    // Get current routines
    const { currentRoutines } = await chrome.storage.local.get(
      "currentRoutines"
    );
    const { routineHistory } = await chrome.storage.local.get("routineHistory");

    // Save current routines to history
    const today = new Date().toISOString().split("T")[0];
    const updatedHistory = {
      ...routineHistory,
      [today]: currentRoutines,
    };

    // Uncheck all routines instead of clearing them
    const uncheckedRoutines = currentRoutines.map((routine: Routine) => ({
      ...routine,
      completed: false,
    }));

    // Update storage with unchecked routines and history
    await chrome.storage.local.set({
      currentRoutines: uncheckedRoutines,
      routineHistory: updatedHistory,
    });
  } else if (alarm.name.startsWith("routine-")) {
    chrome.notifications.create(alarm.name, {
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "Routine Reminder",
      message: "You have a pending routine item!",
      priority: 2,
    });
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CLOSE_MATCHING_TABS" && message.url) {
    chrome.tabs.query({}, (tabs) => {
      const closedTabs: string[] = [];
      tabs.forEach((tab) => {
        if (tab.url?.includes(message.url)) {
          chrome.tabs.remove(tab.id!);
          closedTabs.push(tab.url);
        }
      });
      sendResponse({ success: true, closedTabs });
    });
    return true; // Keep the message channel open for the async response
  }
});
