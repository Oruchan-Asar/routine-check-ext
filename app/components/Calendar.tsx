"use client";

import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

interface Todo {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

interface CalendarEvent {
  title: string;
  date: string;
  backgroundColor: string;
  borderColor: string;
}

// Sample data for browser view
const getSampleEvents = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return [
    {
      title: "Sample Todo 1",
      date: today.toISOString().split("T")[0],
      backgroundColor: "#ef4444",
      borderColor: "#ef4444",
    },
    {
      title: "Sample Todo 2",
      date: tomorrow.toISOString().split("T")[0],
      backgroundColor: "#ef4444",
      borderColor: "#ef4444",
    },
    {
      title: "Sample Todo 3",
      date: nextWeek.toISOString().split("T")[0],
      backgroundColor: "#ef4444",
      borderColor: "#ef4444",
    },
  ];
};

export default function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isExtension, setIsExtension] = useState(false);

  // Set mounted state and check for extension context
  useEffect(() => {
    setMounted(true);
    setIsExtension(typeof chrome !== "undefined" && !!chrome.storage);
  }, []);

  // Fetch todos only after component is mounted
  useEffect(() => {
    if (!mounted) return;

    const fetchTodos = async () => {
      try {
        if (!isExtension) {
          // Use sample data in browser context
          setEvents(getSampleEvents());
          return;
        }

        // Use real data in extension context
        chrome.storage.local.get(["todos"], (result) => {
          const todos: Todo[] = result.todos || [];
          const calendarEvents = todos
            .filter((todo) => !todo.completed)
            .map((todo) => ({
              title: todo.title,
              date: todo.dueDate,
              backgroundColor: "#ef4444",
              borderColor: "#ef4444",
            }));
          setEvents(calendarEvents);
        });
      } catch (error) {
        console.error("Error fetching todos:", error);
        // Fallback to sample data on error
        setEvents(getSampleEvents());
      }
    };

    fetchTodos();
  }, [mounted, isExtension]);

  if (!mounted) {
    return (
      <div className="h-[600px] bg-white p-4 rounded-lg shadow">
        Loading calendar...
      </div>
    );
  }

  return (
    <div className="h-[600px] bg-white p-4 rounded-lg shadow">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="100%"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth",
        }}
      />
      {!isExtension && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Note: Showing sample data. Install the browser extension to see your
          actual todos.
        </div>
      )}
    </div>
  );
}
