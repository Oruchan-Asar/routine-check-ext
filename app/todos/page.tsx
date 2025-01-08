"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  text?: string; // For local storage todos
}

interface LocalStorageTodo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export default function TodosPage() {
  const { data: session } = useSession();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [formData, setFormData] = useState({
    title: "",
  });

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        if (session?.user) {
          // Fetch todos from API if authenticated
          const response = await fetch("/api/todos");
          if (!response.ok) {
            throw new Error(
              `Failed to fetch todos: ${response.status} ${response.statusText}`
            );
          }
          const dbTodos = await response.json();
          console.log("Todos from Database:", dbTodos);
          setTodos(dbTodos);

          // Check for local storage todos and sync them
          let localTodos = [];
          if (typeof chrome !== "undefined" && chrome.storage) {
            // Try Chrome storage first (for extension)
            chrome.storage.local.get(["currentTodos"], async (result) => {
              localTodos = result.currentTodos || [];
              console.log(
                "Found todos in Chrome Extension Storage:",
                localTodos
              );
              handleLocalTodosSync(localTodos);
            });
          } else {
            // Use window.localStorage (for website)
            try {
              const storedTodos = window.localStorage.getItem("currentTodos");
              localTodos = storedTodos ? JSON.parse(storedTodos) : [];
              console.log("Found todos in Website Local Storage:", localTodos);
              await handleLocalTodosSync(localTodos);
            } catch (error) {
              console.error("Error reading from localStorage:", error);
            }
          }
        } else {
          // Fetch todos from storage if not authenticated
          let localTodos = [];
          if (typeof chrome !== "undefined" && chrome.storage) {
            // Try Chrome storage first (for extension)
            chrome.storage.local.get(["currentTodos"], (result) => {
              localTodos = result.currentTodos || [];
              console.log(
                "Loading todos from Chrome Extension (not authenticated):",
                localTodos
              );
              const formattedTodos = formatLocalTodos(localTodos);
              setTodos(formattedTodos);
            });
          } else {
            // Use window.localStorage (for website)
            try {
              const storedTodos = window.localStorage.getItem("currentTodos");
              localTodos = storedTodos ? JSON.parse(storedTodos) : [];
              console.log(
                "Loading todos from Website Storage (not authenticated):",
                localTodos
              );
              const formattedTodos = formatLocalTodos(localTodos);
              setTodos(formattedTodos);
            } catch (error) {
              console.error("Error reading from localStorage:", error);
              setTodos([]);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching todos:", error);
      } finally {
        setLoading(false);
      }
    };

    // Helper function to format local todos to DB format
    const formatLocalTodos = (localTodos: LocalStorageTodo[]) => {
      return localTodos.map((todo) => ({
        id: todo.id,
        title: todo.text,
        completed: todo.completed,
      }));
    };

    // Helper function to handle syncing local todos to DB
    const handleLocalTodosSync = async (localTodos: LocalStorageTodo[]) => {
      if (localTodos.length > 0) {
        console.log("Found local todos to sync:", localTodos.length);

        // Process todos sequentially to avoid race conditions
        for (const localTodo of localTodos) {
          try {
            // Get latest todos before checking for duplicates
            const latestResponse = await fetch("/api/todos");
            if (!latestResponse.ok) {
              throw new Error("Failed to fetch latest todos");
            }
            const latestDbTodos = await latestResponse.json();

            // Check for duplicates in the latest DB state
            const todoExists = latestDbTodos.some(
              (dbTodo: Todo) =>
                dbTodo.title.toLowerCase() === localTodo.text.toLowerCase()
            );

            console.log(`Todo "${localTodo.text}" exists in DB:`, todoExists);

            if (!todoExists) {
              console.log("Syncing todo to DB:", localTodo);
              const addResponse = await fetch("/api/todos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  title: localTodo.text,
                  completed: localTodo.completed,
                }),
              });

              if (!addResponse.ok) {
                throw new Error("Failed to add todo to DB");
              }

              // Wait for the todo to be added
              await addResponse.json();
            }
          } catch (error) {
            console.error("Error syncing local todo to DB:", error);
          }
        }

        // Clear local storage after syncing
        console.log("Clearing local storage after sync");
        if (typeof chrome !== "undefined" && chrome.storage) {
          chrome.storage.local.set({ currentTodos: [] });
        } else {
          window.localStorage.setItem("currentTodos", JSON.stringify([]));
        }

        // Refresh todos from DB one final time
        const refreshResponse = await fetch("/api/todos");
        if (refreshResponse.ok) {
          const refreshedTodos = await refreshResponse.json();
          console.log("Refreshed DB todos after sync:", refreshedTodos);
          setTodos(refreshedTodos);
        }
      }
    };

    fetchTodos();
  }, [session]);

  const saveToLocalStorage = (todos: LocalStorageTodo[]) => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      console.log("Saving to Chrome Extension Storage:", todos);
      chrome.storage.local.set({ currentTodos: todos });
    } else {
      console.log("Saving to Website Local Storage:", todos);
      window.localStorage.setItem("currentTodos", JSON.stringify(todos));
    }
  };

  const getFromLocalStorage = async (): Promise<LocalStorageTodo[]> => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      return new Promise((resolve) => {
        chrome.storage.local.get(["currentTodos"], (result) => {
          console.log(
            "Todos from Chrome Extension Storage:",
            result.currentTodos || []
          );
          resolve(result.currentTodos || []);
        });
      });
    } else {
      const storedTodos = window.localStorage.getItem("currentTodos");
      const todos = storedTodos ? JSON.parse(storedTodos) : [];
      console.log("Todos from Website Local Storage:", todos);
      return todos;
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      if (session?.user) {
        // Update in DB if authenticated
        const response = await fetch(`/api/todos/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            completed: !todos.find((t) => t.id === id)?.completed,
          }),
        });

        if (!response.ok) throw new Error("Failed to update todo");
      } else {
        // Update in local storage if not authenticated
        const localTodos = await getFromLocalStorage();
        const updatedTodos = localTodos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveToLocalStorage(updatedTodos);
      }

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.title.trim()) {
        throw new Error("Title is required");
      }

      if (session?.user) {
        // Add to DB if authenticated
        const response = await fetch("/api/todos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to create todo");
        }

        const newTodo = await response.json();
        setTodos((prev) => [...prev, newTodo]);
      } else {
        // Add to local storage if not authenticated
        const newTodo = {
          id: Date.now().toString(),
          text: formData.title,
          completed: false,
          createdAt: new Date().toISOString(),
        };

        const currentTodos = await getFromLocalStorage();
        const updatedTodos = [...currentTodos, newTodo];
        saveToLocalStorage(updatedTodos);

        setTodos((prev) => [
          ...prev,
          {
            id: newTodo.id,
            title: newTodo.text,
            completed: newTodo.completed,
          },
        ]);
      }

      setIsAddModalOpen(false);
      setFormData({ title: "" });
    } catch (error) {
      console.error("Error creating todo:", error);
      alert(error instanceof Error ? error.message : "Failed to create todo");
    }
  };

  const deleteTodo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this todo?")) return;

    try {
      if (session?.user) {
        // Delete from DB if authenticated
        const response = await fetch(`/api/todos/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete todo");
      } else {
        // Delete from local storage if not authenticated
        const localTodos = await getFromLocalStorage();
        const updatedTodos = localTodos.filter((todo) => todo.id !== id);
        saveToLocalStorage(updatedTodos);
      }

      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const updateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTodo) return;

    try {
      if (session?.user) {
        // Update in DB if authenticated
        const response = await fetch(`/api/todos/${editingTodo.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Failed to update todo");
        const updatedTodo = await response.json();
        setTodos((prev) =>
          prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
        );
      } else {
        // Update in local storage if not authenticated
        const localTodos = await getFromLocalStorage();
        const updatedTodos = localTodos.map((todo) =>
          todo.id === editingTodo.id ? { ...todo, text: formData.title } : todo
        );
        saveToLocalStorage(updatedTodos);

        setTodos((prev) =>
          prev.map((todo) =>
            todo.id === editingTodo.id
              ? { ...todo, title: formData.title }
              : todo
          )
        );
      }

      setEditingTodo(null);
      setFormData({ title: "" });
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const startEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setFormData({
      title: todo.title,
    });
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto mt-32">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Todos</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Add Todo
        </button>
      </div>

      {todos.length === 0 ? (
        <p className="text-gray-500">
          No todos yet. Create your first todo to get started!
        </p>
      ) : (
        <div className="space-y-4">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="h-5 w-5 rounded border-gray-300"
              />
              <div className="flex-1">
                <h3
                  className={`font-medium ${
                    todo.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {todo.title}
                </h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(todo)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {(isAddModalOpen || editingTodo) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingTodo ? "Edit Todo" : "Add Todo"}
            </h2>
            <form onSubmit={editingTodo ? updateTodo : addTodo}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg text-gray-900 dark:text-gray-900"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingTodo(null);
                    setFormData({
                      title: "",
                    });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {editingTodo ? "Save Changes" : "Add Todo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
