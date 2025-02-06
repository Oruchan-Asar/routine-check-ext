import React from "react";
import Calendar from "@/components/Calendar";

export default function CalendarPage() {
  return (
    <div className="mt-28 sm:mb-0 mb-16 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold mb-4">Routine Calendar</h1>
        <div className="space-y-4">
          <Calendar />
        </div>
      </div>
    </div>
  );
}
