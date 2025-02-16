import { CalendarEvent, Routine, RoutineFromAPI } from "@/types/calendar";

class CalendarError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CalendarError";
  }
}

const formatDate = (date: Date): string =>
  `${date.toISOString().split("T")[0]}T00:00:00.000Z`;

const createStatus = (routineId: string, dateStr: string) => ({
  id: `temp-${routineId}-${dateStr}`,
  date: dateStr,
  completed: false,
});

const getDateRange = (startDate: Date, endDate: Date = new Date()): Date[] => {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0);

  const normalizedEndDate = new Date(endDate);
  normalizedEndDate.setHours(0, 0, 0, 0);

  while (currentDate <= normalizedEndDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

const fillEmptyRoutine = (routine: Routine, startDate: Date): Routine => {
  if (!routine?.id) {
    throw new CalendarError("Invalid routine provided");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dates = getDateRange(startDate, today);
  const filledStatuses = dates.map((date) =>
    createStatus(routine.id, formatDate(date))
  );

  return {
    ...routine,
    statuses: filledStatuses,
  };
};

const fillExistingRoutine = (
  routine: Routine,
  creationDateStr?: string
): Routine => {
  if (!routine?.id) {
    throw new CalendarError("Invalid routine provided");
  }

  const sortedStatuses = [...routine.statuses].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const creationDate = new Date(creationDateStr || new Date().toISOString());
  creationDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingDates = new Set(sortedStatuses.map((s) => s.date));
  const dates = getDateRange(creationDate, today);

  const newStatuses = dates.map((date) => {
    const dateStr = formatDate(date);
    return existingDates.has(dateStr)
      ? sortedStatuses.find((s) => s.date === dateStr)!
      : createStatus(routine.id, dateStr);
  });

  return {
    ...routine,
    statuses: newStatuses,
  };
};

export const fillMissingDates = async (
  periodRoutines: Routine[],
  startDate: Date
): Promise<Routine[]> => {
  if (!Array.isArray(periodRoutines)) {
    throw new CalendarError("Invalid routines array provided");
  }

  try {
    const response = await fetch("/api/routines");
    if (!response.ok) {
      throw new CalendarError(
        `Failed to fetch routines: ${response.statusText}`
      );
    }

    const allRoutines = (await response.json()) as RoutineFromAPI[];
    const routineCreationDates = new Map(
      allRoutines.map((r) => [r.id, r.createdAt])
    );

    return periodRoutines.map((routine) => {
      if (!routine.statuses?.length) {
        return fillEmptyRoutine(routine, startDate);
      }
      return fillExistingRoutine(routine, routineCreationDates.get(routine.id));
    });
  } catch (error) {
    if (error instanceof CalendarError) {
      throw error;
    }
    throw new CalendarError(
      `Error processing routines: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const convertRoutinesToEvents = (
  routines: Routine[]
): CalendarEvent[] => {
  if (!Array.isArray(routines)) {
    throw new CalendarError("Invalid routines array provided");
  }

  return routines.flatMap((routine) =>
    routine.statuses.map((status) => {
      const color = status.completed ? "#22c55e" : "#ef4444";
      const completionStatus = status.completed ? "✓" : "⨯";
      return {
        id: status.id,
        title: `${routine.title} ${completionStatus}`,
        date: status.date,
        backgroundColor: color,
        borderColor: color,
        display: "block",
      };
    })
  );
};
