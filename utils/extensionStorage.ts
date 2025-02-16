export interface ExtensionRoutine {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export async function getExtensionRoutines(): Promise<ExtensionRoutine[]> {
  try {
    const result = await chrome.storage.local.get(["currentRoutines"]);
    return result.currentRoutines || [];
  } catch (error) {
    console.error("Error accessing extension storage:", error);
    return [];
  }
}

export async function clearExtensionRoutines(): Promise<void> {
  try {
    await chrome.storage.local.set({ currentRoutines: [] });
  } catch (error) {
    console.error("Error clearing extension storage:", error);
  }
}
