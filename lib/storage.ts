import { ExtensionRoutine } from "@/types/calendar";

class ExtensionStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExtensionStorageError";
  }
}

const validateRoutine = (routine: ExtensionRoutine): boolean => {
  return !!(
    routine &&
    typeof routine.id === "string" &&
    typeof routine.text === "string" &&
    typeof routine.completed === "boolean" &&
    typeof routine.createdAt === "string" &&
    new Date(routine.createdAt).toString() !== "Invalid Date"
  );
};

const validateRoutines = (routines: ExtensionRoutine[]): void => {
  if (!Array.isArray(routines)) {
    throw new ExtensionStorageError("Invalid routines array");
  }

  routines.forEach((routine, index) => {
    if (!validateRoutine(routine)) {
      throw new ExtensionStorageError(`Invalid routine at index ${index}`);
    }
  });
};

export async function getExtensionRoutines(): Promise<ExtensionRoutine[]> {
  try {
    // Check if we're in a Chrome extension context
    if (
      typeof chrome === "undefined" ||
      !chrome.storage ||
      !chrome.storage.local
    ) {
      // Return empty array if not in extension context
      return [];
    }

    const result = await chrome.storage.local.get(["currentRoutines"]);
    const routines = result.currentRoutines || [];
    validateRoutines(routines);
    return routines;
  } catch (error) {
    if (error instanceof ExtensionStorageError) {
      throw error;
    }
    throw new ExtensionStorageError(
      `Failed to access extension storage: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function setExtensionRoutines(
  routines: ExtensionRoutine[]
): Promise<void> {
  try {
    // Check if we're in a Chrome extension context
    if (
      typeof chrome === "undefined" ||
      !chrome.storage ||
      !chrome.storage.local
    ) {
      // No-op if not in extension context
      return;
    }

    validateRoutines(routines);
    await chrome.storage.local.set({ currentRoutines: routines });
  } catch (error) {
    if (error instanceof ExtensionStorageError) {
      throw error;
    }
    throw new ExtensionStorageError(
      `Failed to save to extension storage: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function clearExtensionRoutines(): Promise<void> {
  try {
    // Check if we're in a Chrome extension context
    if (
      typeof chrome === "undefined" ||
      !chrome.storage ||
      !chrome.storage.local
    ) {
      // No-op if not in extension context
      return;
    }

    await setExtensionRoutines([]);
  } catch (error) {
    throw new ExtensionStorageError(
      `Failed to clear extension storage: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
