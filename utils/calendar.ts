import { CalendarEvent, Routine, RoutineFromAPI } from "@/types/calendar";

export const fillMissingDates = async (
  periodRoutines: Routine[],
  startDate: Date
): Promise<Routine[]> => {
  try {
    const response = await fetch("/api/routines");
    if (!response.ok) {
      throw new Error("Failed to fetch routines");
    }
    const allRoutines = (await response.json()) as RoutineFromAPI[];
    const routineCreationDates = new Map(
      allRoutines.map((r) => [r.id, r.createdAt])
    );

    return periodRoutines.map((routine) => {
      if (routine.statuses.length === 0) {
        return fillEmptyRoutine(routine, startDate);
      }
      return fillExistingRoutine(routine, routineCreationDates.get(routine.id));
    });
  } catch (error) {
    console.error("Error in fillMissingDates:", error);
    return periodRoutines;
  }
};

const fillEmptyRoutine = (routine: Routine, startDate: Date): Routine => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filledStatuses = [];
  const currentDate = new Date(startDate);

  while (currentDate <= today) {
    const dateStr = formatDate(currentDate);
    filledStatuses.push(createStatus(routine.id, dateStr));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return {
    ...routine,
    statuses: filledStatuses,
  };
};

const fillExistingRoutine = (
  routine: Routine,
  creationDateStr?: string
): Routine => {
  const sortedStatuses = [...routine.statuses].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const creationDate = new Date(creationDateStr || new Date().toISOString());
  creationDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filledStatuses = [...sortedStatuses];
  const existingDates = new Set(sortedStatuses.map((s) => s.date));

  const currentDate = new Date(creationDate);
  while (currentDate <= today) {
    const dateStr = formatDate(currentDate);
    if (!existingDates.has(dateStr)) {
      filledStatuses.push(createStatus(routine.id, dateStr));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return {
    ...routine,
    statuses: filledStatuses.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    ),
  };
};

const formatDate = (date: Date): string =>
  `${date.toISOString().split("T")[0]}T00:00:00.000Z`;

const createStatus = (routineId: string, dateStr: string) => ({
  id: `temp-${routineId}-${dateStr}`,
  date: dateStr,
  completed: false,
});

export const convertRoutinesToEvents = (
  routines: Routine[]
): CalendarEvent[] => {
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
