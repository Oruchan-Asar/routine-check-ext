import React, { useEffect, useState } from "react";
export function Popup() {
  const [routines, setRoutines] = useState([]);
  const [newRoutine, setNewRoutine] = useState("");
  useEffect(() => {
    // Load routines from storage
    chrome.storage.local.get(["routines"], (result) => {
      setRoutines(result.routines || []);
    });
  }, []);
  const addRoutine = () => {
    if (!newRoutine.trim()) return;
    const routine = {
      id: Date.now().toString(),
      text: newRoutine,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const updatedRoutines = [...routines, routine];
    chrome.storage.local.set({ routines: updatedRoutines });
    setRoutines(updatedRoutines);
    setNewRoutine("");
  };
  const toggleRoutine = (id) => {
    const updatedRoutines = routines.map((routine) =>
      routine.id === id
        ? { ...routine, completed: !routine.completed }
        : routine
    );
    chrome.storage.local.set({ routines: updatedRoutines });
    setRoutines(updatedRoutines);
  };
  return React.createElement(
    "div",
    { className: "p-4 w-80" },
    React.createElement(
      "h1",
      { className: "text-xl font-bold mb-4" },
      "Routine Check"
    ),
    React.createElement(
      "div",
      { className: "flex gap-2 mb-4" },
      React.createElement("input", {
        type: "text",
        value: newRoutine,
        onChange: (e) => setNewRoutine(e.target.value),
        className: "flex-1 px-3 py-2 border rounded-md",
        placeholder: "Add new routine...",
      }),
      React.createElement(
        "button",
        {
          onClick: addRoutine,
          className:
            "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700",
        },
        "Add"
      )
    ),
    React.createElement(
      "div",
      { className: "space-y-2" },
      routines.map((routine) =>
        React.createElement(
          "div",
          {
            key: routine.id,
            className: "flex items-center gap-2 p-2 border rounded-md",
          },
          React.createElement("input", {
            type: "checkbox",
            checked: routine.completed,
            onChange: () => toggleRoutine(routine.id),
            className: "h-4 w-4",
          }),
          React.createElement(
            "span",
            {
              className: routine.completed ? "line-through text-gray-500" : "",
            },
            routine.text
          )
        )
      )
    )
  );
}
