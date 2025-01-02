import React, { useEffect, useState } from "react";
export function Popup() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");
    useEffect(() => {
        // Load todos from storage
        chrome.storage.local.get(["todos"], (result) => {
            setTodos(result.todos || []);
        });
    }, []);
    const addTodo = () => {
        if (!newTodo.trim())
            return;
        const todo = {
            id: Date.now().toString(),
            text: newTodo,
            completed: false,
            createdAt: new Date().toISOString(),
        };
        const updatedTodos = [...todos, todo];
        chrome.storage.local.set({ todos: updatedTodos });
        setTodos(updatedTodos);
        setNewTodo("");
    };
    const toggleTodo = (id) => {
        const updatedTodos = todos.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
        chrome.storage.local.set({ todos: updatedTodos });
        setTodos(updatedTodos);
    };
    return (React.createElement("div", { className: "p-4 w-80" },
        React.createElement("h1", { className: "text-xl font-bold mb-4" }, "Todo Check"),
        React.createElement("div", { className: "flex gap-2 mb-4" },
            React.createElement("input", { type: "text", value: newTodo, onChange: (e) => setNewTodo(e.target.value), className: "flex-1 px-3 py-2 border rounded-md", placeholder: "Add new todo..." }),
            React.createElement("button", { onClick: addTodo, className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" }, "Add")),
        React.createElement("div", { className: "space-y-2" }, todos.map((todo) => (React.createElement("div", { key: todo.id, className: "flex items-center gap-2 p-2 border rounded-md" },
            React.createElement("input", { type: "checkbox", checked: todo.completed, onChange: () => toggleTodo(todo.id), className: "h-4 w-4" }),
            React.createElement("span", { className: todo.completed ? "line-through text-gray-500" : "" }, todo.text)))))));
}
