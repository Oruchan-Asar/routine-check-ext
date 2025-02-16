import { useState, useCallback } from "react";
import { CalendarEvent, Routine } from "@/types/calendar";
import { fillMissingDates, convertRoutinesToEvents } from "@/lib/calendar";

export const useCalendarEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutines = useCallback(async (startDate: Date, endDate: Date) => {
    try {
      setIsLoading(true);
      setError(null);

      const start = startDate.toISOString();
      const end = endDate.toISOString();
      const response = await fetch(
        `/api/routines/calendar?start=${start}&end=${end}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch routines");
      }

      const routines: Routine[] = await response.json();
      const routinesWithFilledDates = await fillMissingDates(
        routines,
        startDate
      );
      const calendarEvents = convertRoutinesToEvents(routinesWithFilledDates);

      setEvents(calendarEvents);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      console.error("Error fetching routines:", error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    events,
    isLoading,
    error,
    fetchRoutines,
  };
};
