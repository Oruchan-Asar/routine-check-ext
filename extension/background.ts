/// <reference types="chrome"/>

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  // Initialize storage with empty todos and history
  const today = new Date().toISOString().split("T")[0];
  chrome.storage.local.set({
    currentTodos: [],
    todoHistory: {
      [today]: [],
    },
  });

  // Create daily refresh alarm
  chrome.alarms.create("daily-refresh", {
    periodInMinutes: 24 * 60,
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
    // Get current todos
    const { currentTodos } = await chrome.storage.local.get("currentTodos");
    const { todoHistory } = await chrome.storage.local.get("todoHistory");

    // Save current todos to history
    const today = new Date().toISOString().split("T")[0];
    const updatedHistory = {
      ...todoHistory,
      [today]: currentTodos,
    };

    // Uncheck all todos instead of clearing them
    const uncheckedTodos = currentTodos.map((todo: Todo) => ({
      ...todo,
      completed: false,
    }));

    // Update storage with unchecked todos and history
    await chrome.storage.local.set({
      currentTodos: uncheckedTodos,
      todoHistory: updatedHistory,
    });
  } else if (alarm.name.startsWith("todo-")) {
    chrome.notifications.create(alarm.name, {
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "Todo Reminder",
      message: "You have a pending todo item!",
      priority: 2,
    });
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background script received message:", message);

  if (message.type === "CLOSE_MATCHING_TABS" && message.url) {
    chrome.tabs.query({}, (tabs) => {
      const closedTabs: string[] = [];
      tabs.forEach((tab) => {
        if (tab.url?.includes(message.url)) {
          console.log("Closing tab:", tab.url);
          chrome.tabs.remove(tab.id!);
          closedTabs.push(tab.url);
        }
      });
      sendResponse({ success: true, closedTabs });
    });
    return true; // Keep the message channel open for the async response
  }
});
