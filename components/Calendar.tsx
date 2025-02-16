"use client";

import React, { useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { DatesSetArg } from "@fullcalendar/core";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";

export default function Calendar() {
  const { status } = useSession();
  const { theme } = useTheme();
  const { events, fetchRoutines } = useCalendarEvents();

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
        dayMaxEvents={3}
        moreLinkClick="popover"
        dayCellClassNames={theme === "dark" ? "dark-theme-cell" : ""}
        viewClassNames={theme === "dark" ? "dark-theme-calendar" : ""}
      />
    </div>
  );
}
