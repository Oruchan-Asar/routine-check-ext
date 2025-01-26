"use client";

import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Routine {
  id: string;
  title: string;
  statuses: {
    id: string;
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

    const fetchRoutines = async () => {
      try {
        const response = await fetch("/api/routines/calendar");
        if (!response.ok) {
          throw new Error("Failed to fetch routines");
        }
        const routines: Routine[] = await response.json();

        // Convert routines to calendar events
        const calendarEvents = routines.flatMap((routine) =>
          routine.statuses.map((status) => {
            const color = status.completed ? "#22c55e" : "#ef4444"; // Green for completed, red for unchecked routines
            return {
              id: status.id,
              title: routine.title,
              date: status.date,
              backgroundColor: color,
              borderColor: color,
              display: "block",
            };
          })
        );

        setEvents(calendarEvents);
      } catch (error) {
        console.error("Error fetching routines:", error);
      }
    };

    fetchRoutines();
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
