import { LocalStorageRoutine } from "../types/routines";

export const useRoutineStorage = () => {
  const saveToLocalStorage = (routines: LocalStorageRoutine[]) => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      console.log("Saving to Chrome Extension Storage:", routines);
      chrome.storage.local.set({ currentRoutines: routines });
    } else {
      console.log("Saving to Website Local Storage:", routines);
      window.localStorage.setItem("currentRoutines", JSON.stringify(routines));
    }
  };

  const getFromLocalStorage = async (): Promise<LocalStorageRoutine[]> => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      return new Promise((resolve) => {
        chrome.storage.local.get(["currentRoutines"], (result) => {
          console.log(
            "Routines from Chrome Extension Storage:",
            result.currentRoutines || []
          );
          resolve(result.currentRoutines || []);
        });
      });
    } else {
      const storedRoutines = window.localStorage.getItem("currentRoutines");
      const routines = storedRoutines ? JSON.parse(storedRoutines) : [];
      console.log("Routines from Website Local Storage:", routines);
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
