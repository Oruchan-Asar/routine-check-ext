import React, { useEffect, useState } from "react";
import { FaSync, FaEdit, FaTrash } from "react-icons/fa";

interface Routine {
  id: string;
  text: string;
  url?: string;
  completed: boolean;
  createdAt: string;
}

interface WebAppRoutine {
  id: string;
  title: string;
  url?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RoutineHistory {
  [date: string]: Routine[];
}

interface ChromeCookie {
  name: string;
  value: string;
  domain: string;
  hostOnly: boolean;
  path: string;
  secure: boolean;
  httpOnly: boolean;
  sameSite: string;
  session: boolean;
  expirationDate?: number;
  storeId: string;
}

export function Popup() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [routineHistory, setRoutineHistory] = useState<RoutineHistory>({});
  const [newRoutine, setNewRoutine] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    console.log("Authentication Status:", isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    // Load routines and history from storage
    chrome.storage.local.get(
      ["currentRoutines", "routineHistory"],
      (result) => {
        console.log("Local Storage Routines:", result.currentRoutines || []);
        setRoutines(result.currentRoutines || []);
        setRoutineHistory(result.routineHistory || {});
      }
    );

    // Check authentication status
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Get the next-auth.session-token cookie
      const cookie = await new Promise<ChromeCookie | null>((resolve) => {
        chrome.cookies.get(
          {
            url: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
            name: "next-auth.session-token",
          },
          (cookie) => resolve(cookie)
        );
      });

      console.log("Session Cookie:", cookie);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/check`,
        {
          credentials: "include",
          headers: {
            Accept: "application/json",
            Cookie: cookie ? `next-auth.session-token=${cookie.value}` : "",
          },
        }
      );

      console.log("Auth Response Status:", response.status);
      console.log("Response Headers:", Object.fromEntries(response.headers));
      console.log("Current Cookies:", document.cookie);

      const data = await response.json();
      console.log("Auth Response Data:", data);

      setIsAuthenticated(data.authenticated);

      if (data.authenticated) {
        // Fetch routines if authenticated
        const routinesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/routines`,
          {
            credentials: "include",
          }
        );
        if (routinesResponse.ok) {
          const dbRoutines = await routinesResponse.json();
          console.log("Database Routines:", dbRoutines);
        } else {
          console.log(
            "Error fetching routines from database:",
            routinesResponse.status
          );
        }
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
    }
  };

  const syncWithWebApp = async () => {
    if (!isAuthenticated) {
      // Open the login page in a new tab if not authenticated
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      chrome.tabs.create({ url: `${apiUrl}/login` }, (tab) => {
        // Add listener for tab updates
        chrome.tabs.onUpdated.addListener(async function listener(tabId, info) {
          // Check if it's our tab and it's done loading
          if (tabId === tab.id && info.status === "complete") {
            // Remove the listener
            chrome.tabs.onUpdated.removeListener(listener);

            // Wait a bit to ensure the session is properly set
            setTimeout(async () => {
              // Recheck auth status
              await checkAuthStatus();
              // If now authenticated, sync
              if (isAuthenticated) {
                await syncWithWebApp();
              }
            }, 1000);
          }
        });
      });
      return;
    }

    setIsSyncing(true);
    try {
      // Get web app routines
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/routines`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch routines from web app");
      }

      const webAppRoutines = (await response.json()) as WebAppRoutine[];
      console.log("Fetched web app routines:", webAppRoutines);

      // Convert web app routines to extension format
      const convertedWebAppRoutines = webAppRoutines.map(
        (routine: WebAppRoutine) => ({
          id: routine.id,
          text: routine.title,
          url: routine.url,
          completed: routine.completed,
          createdAt: routine.createdAt,
        })
      );

      // Update local storage and state with web app routines
      chrome.storage.local.set(
        { currentRoutines: convertedWebAppRoutines },
        () => {
          console.log(
            "Updated local storage with web app routines:",
            convertedWebAppRoutines
          );
          setRoutines(convertedWebAppRoutines);
        }
      );
    } catch (error) {
      console.error("Error syncing with web app:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const addRoutine = async () => {
    if (!newRoutine.trim()) return;

    const routine: Routine = {
      id: crypto.randomUUID(),
      text: newRoutine,
      url: newUrl.trim() || undefined,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const updatedRoutines = [...routines, routine];
    setRoutines(updatedRoutines);
    chrome.storage.local.set({ currentRoutines: updatedRoutines });
    setNewRoutine("");
    setNewUrl("");
    setShowInput(false);
  };

  const toggleRoutine = async (id: string) => {
    const updatedRoutines = routines.map((routine) =>
      routine.id === id
        ? { ...routine, completed: !routine.completed }
        : routine
    );

    // Update local storage first for immediate feedback
    chrome.storage.local.set({ currentRoutines: updatedRoutines });
    setRoutines(updatedRoutines);

    // If authenticated, update in database
    if (isAuthenticated) {
      try {
        const routineToUpdate = updatedRoutines.find(
          (routine) => routine.id === id
        );
        if (!routineToUpdate) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/routines/${id}`,
          {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              completed: routineToUpdate.completed,
            }),
          }
        );

        if (!response.ok) {
          console.error(
            "Failed to update routine in database:",
            response.status
          );
          // Revert local changes if database update fails
          const revertedRoutines = routines.map((routine) =>
            routine.id === id
              ? { ...routine, completed: !routine.completed }
              : routine
          );
          chrome.storage.local.set({ currentRoutines: revertedRoutines });
          setRoutines(revertedRoutines);
        }
      } catch (error) {
        console.error("Error updating routine in database:", error);
        // Revert local changes if database update fails
        const revertedRoutines = routines.map((routine) =>
          routine.id === id
            ? { ...routine, completed: !routine.completed }
            : routine
        );
        chrome.storage.local.set({ currentRoutines: revertedRoutines });
        setRoutines(revertedRoutines);
      }
    }
  };

  const deleteRoutine = async (id: string) => {
    const routineToDelete = routines.find((routine) => routine.id === id);
    console.log("Deleting Routine:", routineToDelete);
    const updatedRoutines = routines.filter((routine) => routine.id !== id);
    console.log("Updated Routines List After Deletion:", updatedRoutines);

    // Delete from local storage
    chrome.storage.local.set({ currentRoutines: updatedRoutines });
    setRoutines(updatedRoutines);

    // If authenticated, also delete from database
    if (isAuthenticated) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/routines/${id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (!response.ok) {
          console.error(
            "Failed to delete routine from database:",
            response.status
          );
          // Optionally revert the local deletion if db deletion fails
          chrome.storage.local.set({ currentRoutines: routines });
          setRoutines(routines);
        }
      } catch (error) {
        console.error("Error deleting routine from database:", error);
        // Optionally revert the local deletion if db deletion fails
        chrome.storage.local.set({ currentRoutines: routines });
        setRoutines(routines);
      }
    }
  };

  const editRoutine = async (id: string, newText: string) => {
    const updatedRoutines = routines.map((routine) =>
      routine.id === id
        ? {
            ...routine,
            text: newText,
            url: editUrl.trim() || undefined,
          }
        : routine
    );

    setRoutines(updatedRoutines);
    chrome.storage.local.set({ currentRoutines: updatedRoutines });
    setEditingRoutine(null);
    setEditText("");
    setEditUrl("");
  };

  const startEditing = (routine: Routine) => {
    setEditingRoutine(routine.id);
    setEditText(routine.text);
    setEditUrl(routine.url || "");
  };

  return (
    <div className="p-4 w-[440px]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Routine Check</h1>
        <div className="flex gap-2">
          <button
            onClick={syncWithWebApp}
            className={`px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm flex items-center gap-1 ${
              isSyncing ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSyncing}
          >
            <FaSync className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
            Sync
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            {showHistory ? "Current" : "History"}
          </button>
          {!showHistory && (
            <button
              onClick={() => setShowInput(!showInput)}
              className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
            >
              {showInput ? "Cancel" : "Add Routine"}
            </button>
          )}
        </div>
      </div>

      {showInput && !showHistory && (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newRoutine}
            onChange={(e) => setNewRoutine(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-md bg-white text-gray-900 placeholder-gray-500"
            placeholder="What needs to be done?"
            autoFocus
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                addRoutine();
              }
            }}
          />
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-md bg-white text-gray-900 placeholder-gray-500"
            placeholder="URL"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                addRoutine();
              }
            }}
          />
          <button
            onClick={addRoutine}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      )}

      {!showHistory ? (
        <div className="space-y-2">
          {routines.length === 0 && (
            <p className="text-gray-500 text-center">No routines for today</p>
          )}
          {routines.map((routine) => (
            <div
              key={routine.id}
              className="flex items-start gap-2 p-2 rounded-lg shadow border border-gray-300"
            >
              <input
                type="checkbox"
                checked={routine.completed}
                onChange={() => toggleRoutine(routine.id)}
                className="mt-1"
              />
              <div className="flex-1">
                {editingRoutine === routine.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                      autoFocus
                    />
                    <input
                      type="text"
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                      placeholder="URL (optional)"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => editRoutine(routine.id, editText)}
                        className="text-sm px-2 py-1 bg-blue-500 text-white rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingRoutine(null);
                          setEditText("");
                          setEditUrl("");
                        }}
                        className="text-sm px-2 py-1 bg-gray-500 text-white rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div
                      className={`text-sm ${
                        routine.completed ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {routine.text}
                    </div>
                    {routine.url && (
                      <a
                        href={routine.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:text-blue-600"
                      >
                        {routine.url}
                      </a>
                    )}
                  </div>
                )}
              </div>
              {!editingRoutine && (
                <div className="flex gap-1">
                  <button
                    onClick={() => startEditing(routine)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteRoutine(routine.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(routineHistory)
            .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
            .map(([date, routines]) => (
              <div key={date} className="border rounded-md p-3">
                <h3 className="font-semibold mb-2">
                  {new Date(date).toLocaleDateString()}
                </h3>
                <div className="space-y-2">
                  {routines.map((routine) => (
                    <div
                      key={routine.id}
                      className="flex items-center gap-2 p-2 border rounded-md"
                    >
                      <input
                        type="checkbox"
                        checked={routine.completed}
                        disabled
                        className="h-4 w-4"
                      />
                      <span
                        className={`flex-1 ${
                          routine.completed ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {routine.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
