"use client";

import React, { useCallback, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { DatesSetArg } from "@fullcalendar/core";

interface Routine {
  id: string;
  title: string;
  createdAt: string;
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

interface RoutineFromAPI {
  id: string;
  createdAt: string;
}

const fillMissingDates = async (
  periodRoutines: Routine[],
  startDate: Date
): Promise<Routine[]> => {
  try {
    // Fetch all routines to get creation dates
    const response = await fetch("/api/routines");
    if (!response.ok) {
      throw new Error("Failed to fetch routines");
    }
    const allRoutines = (await response.json()) as RoutineFromAPI[];

    // Create a map of routine creation dates
    const routineCreationDates = new Map(
      allRoutines.map((r) => [r.id, r.createdAt])
    );

    return periodRoutines.map((routine) => {
      if (routine.statuses.length === 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const filledStatuses = [];
        const currentDate = new Date(startDate);

        while (currentDate <= today) {
          const dateStr =
            currentDate.toISOString().split("T")[0] + "T00:00:00.000Z";
          filledStatuses.push({
            id: `temp-${routine.id}-${dateStr}`,
            date: dateStr,
            completed: false,
          });
          currentDate.setDate(currentDate.getDate() + 1);
        }

        return {
          ...routine,
          statuses: filledStatuses,
        };
      }

      // Sort statuses by date
      const sortedStatuses = [...routine.statuses].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const creationDate = new Date(
        routineCreationDates.get(routine.id) || new Date().toISOString()
      );
      creationDate.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const filledStatuses = [...sortedStatuses];
      const existingDates = new Set(sortedStatuses.map((s) => s.date));

      // Loop through each day from creation date to today
      const currentDate = new Date(creationDate);
      while (currentDate <= today) {
        const dateStr =
          currentDate.toISOString().split("T")[0] + "T00:00:00.000Z";

        // If the date doesn't exist in statuses, add it
        if (!existingDates.has(dateStr)) {
          filledStatuses.push({
            id: `temp-${routine.id}-${dateStr}`,
            date: dateStr,
            completed: false,
          });
        }

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return {
        ...routine,
        statuses: filledStatuses.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        ),
      };
    });
  } catch (error) {
    console.error("Error in fillMissingDates:", error);
    return periodRoutines;
  }
};

export default function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const { status } = useSession();
  const { theme } = useTheme();

  const fetchRoutines = useCallback(async (startDate: Date, endDate: Date) => {
    try {
      const start = startDate.toISOString();
      const end = endDate.toISOString();
      const response = await fetch(
        `/api/routines/calendar?start=${start}&end=${end}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch routines");
      }

      const routines: Routine[] = await response.json();

      // Fill in missing dates
      const routinesWithFilledDates = await fillMissingDates(
        routines,
        startDate
      );

      console.log("routinesWithFilledDates", routinesWithFilledDates);

      // Convert routines to calendar events

      const calendarEvents = routinesWithFilledDates.flatMap((routine) =>
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
  }, []);

  const handleDatesSet = useCallback(
    (arg: DatesSetArg) => {
      fetchRoutines(arg.start, arg.end);
    },
    [fetchRoutines]
  );

  if (status === "loading") {
    return (
      <div className="h-[700px] bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-[700px] bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
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
        datesSet={handleDatesSet}
        themeSystem="standard"
        dayCellClassNames={theme === "dark" ? "dark-theme-cell" : ""}
        viewClassNames={theme === "dark" ? "dark-theme-calendar" : ""}
      />
    </div>
  );
}
