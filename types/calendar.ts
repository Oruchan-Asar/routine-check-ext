export interface Routine {
  id: string;
  title: string;
  statuses: RoutineStatus[];
}

export interface RoutineStatus {
  id: string;
  date: string;
  completed: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  backgroundColor: string;
  borderColor: string;
  display: string;
}

export interface RoutineFromAPI extends Routine {
  createdAt: string;
}

export interface ExtensionRoutine {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}
