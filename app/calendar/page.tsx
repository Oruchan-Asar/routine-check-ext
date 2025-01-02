import React from "react";
import Calendar from "../components/Calendar";

export default function CalendarPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Todo Calendar</h1>
      <div className="space-y-4">
        <Calendar />
      </div>
    </div>
  );
}
