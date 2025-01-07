import React, { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

interface TodoHistory {
  [date: string]: Todo[];
}

export function Popup() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoHistory, setTodoHistory] = useState<TodoHistory>({});
  const [newTodo, setNewTodo] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [editingTodo, setEditingTodo] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Load todos and history from storage
    chrome.storage.local.get(["currentTodos", "todoHistory"], (result) => {
      console.log(
        "Extension Popup - Current Todos:",
        result.currentTodos || []
      );
      console.log("Extension Popup - Todo History:", result.todoHistory || {});
      setTodos(result.currentTodos || []);
      setTodoHistory(result.todoHistory || {});
    });

    // Check authentication status
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/check`,
        {
          credentials: "include",
        }
      );
      setIsAuthenticated(response.ok);
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;

    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const updatedTodos = [...todos, todo];
    console.log("Extension Popup - Adding Todo:", todo);
    console.log("Extension Popup - Updated Todos List:", updatedTodos);
    setTodos(updatedTodos);

    if (isAuthenticated) {
      try {
        console.log("Extension Popup - Saving Todo to DB:", todo);
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: todo.text,
            description: "",
            completed: todo.completed,
            dueDate: new Date(),
          }),
        });
      } catch (error) {
        console.error("Error saving todo to database:", error);
      }
    } else {
      console.log(
        "Extension Popup - Saving Todo to Chrome Storage:",
        updatedTodos
      );
      chrome.storage.local.set({ currentTodos: updatedTodos });
    }

    setNewTodo("");
    setShowInput(false);
  };

  const toggleTodo = (id: string) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    console.log("Extension Popup - Toggling Todo:", id);
    console.log("Extension Popup - Updated Todos List:", updatedTodos);
    chrome.storage.local.set({ currentTodos: updatedTodos });
    setTodos(updatedTodos);
  };

  const deleteTodo = (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    console.log("Extension Popup - Deleting Todo:", id);
    console.log("Extension Popup - Updated Todos List:", updatedTodos);
    chrome.storage.local.set({ currentTodos: updatedTodos });
    setTodos(updatedTodos);
  };

  const editTodo = (id: string, newText: string) => {
    if (!newText.trim()) return;

    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, text: newText } : todo
    );
    console.log("Extension Popup - Editing Todo:", id);
    console.log("Extension Popup - Updated Todos List:", updatedTodos);
    chrome.storage.local.set({ currentTodos: updatedTodos });
    setTodos(updatedTodos);
    setEditingTodo(null);
    setEditText("");
  };

  const startEditing = (todo: Todo) => {
    setEditingTodo(todo.id);
    setEditText(todo.text);
  };

  return (
    <div className="p-4 w-80">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Todo Check</h1>
        <div className="flex gap-2">
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
              {showInput ? "Cancel" : "Add Todo"}
            </button>
          )}
        </div>
      </div>

      {showInput && !showHistory && (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-md bg-white text-gray-900 placeholder-gray-500"
            placeholder="What needs to be done?"
            autoFocus
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                addTodo();
              }
            }}
          />
          <button
            onClick={addTodo}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      )}

      {!showHistory ? (
        <div className="space-y-2">
          {todos.length === 0 && (
            <p className="text-gray-500 text-center">No todos for today</p>
          )}
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-2 p-2 border rounded-md"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="h-4 w-4"
              />
              {editingTodo === todo.id ? (
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 px-2 py-1 border rounded text-gray-900 bg-white min-w-0"
                    autoFocus
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        editTodo(todo.id, editText);
                      }
                    }}
                  />
                  <button
                    onClick={() => editTodo(todo.id, editText)}
                    className="p-1.5 bg-green-600 text-white rounded hover:bg-green-700"
                    title="Save"
                  >
                    <FaCheck size={14} />
                  </button>
                  <button
                    onClick={() => setEditingTodo(null)}
                    className="p-1.5 bg-gray-500 text-white rounded hover:bg-gray-600"
                    title="Cancel"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <span
                    className={`flex-1 ${
                      todo.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {todo.text}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEditing(todo)}
                      className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-100"
                      title="Edit todo"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-100"
                      title="Delete todo"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(todoHistory)
            .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
            .map(([date, todos]) => (
              <div key={date} className="border rounded-md p-3">
                <h3 className="font-semibold mb-2">
                  {new Date(date).toLocaleDateString()}
                </h3>
                <div className="space-y-2">
                  {todos.map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-center gap-2 p-2 border rounded-md"
                    >
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        disabled
                        className="h-4 w-4"
                      />
                      <span
                        className={`flex-1 ${
                          todo.completed ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {todo.text}
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
