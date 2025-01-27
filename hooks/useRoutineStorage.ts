import { LocalStorageRoutine } from "../types/routines";

export const useRoutineStorage = () => {
  const saveToLocalStorage = (routines: LocalStorageRoutine[]) => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.set({ currentRoutines: routines });
    } else {
      window.localStorage.setItem("currentRoutines", JSON.stringify(routines));
    }
  };

  const getFromLocalStorage = async (): Promise<LocalStorageRoutine[]> => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      return new Promise((resolve) => {
        chrome.storage.local.get(["currentRoutines"], (result) => {
          resolve(result.currentRoutines || []);
        });
      });
    } else {
      const storedRoutines = window.localStorage.getItem("currentRoutines");
      const routines = storedRoutines ? JSON.parse(storedRoutines) : [];
      return routines;
    }
  };

  const clearLocalStorage = () => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.set({ currentRoutines: [] });
    } else {
      window.localStorage.setItem("currentRoutines", JSON.stringify([]));
    }
  };

  return {
    saveToLocalStorage,
    getFromLocalStorage,
    clearLocalStorage,
  };
};
