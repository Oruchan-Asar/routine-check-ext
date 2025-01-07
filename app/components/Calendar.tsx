"use client";

import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Todo {
  id: string;
  title: string;
  statuses: {
    date: string;
    completed: boolean;
  }[];
}

interface CalendarEvent {
  title: string;
  date: string;
  backgroundColor: string;
  borderColor: string;
}

export default function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status !== "authenticated") {
      return;
    }

    const fetchTodos = async () => {
      try {
        const response = await fetch("/api/todos/calendar", {
          headers: {
            "x-user-email": session.user?.email || "",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const todos: Todo[] = await response.json();

        // Convert todos to calendar events
        const calendarEvents = todos.flatMap((todo) =>
          todo.statuses
            .filter((status) => !status.completed)
            .map((status) => ({
              title: todo.title,
              date: status.date,
              backgroundColor: "#ef4444", // Red color for unchecked todos
              borderColor: "#ef4444",
            }))
        );

        setEvents(calendarEvents);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    fetchTodos();
  }, [status, router, session]);

  if (status === "loading") {
    return (
      <div className="h-[700px] bg-white p-6 rounded-lg shadow flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-[700px] bg-white p-6 rounded-lg shadow">
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
    </div>
  );
}
