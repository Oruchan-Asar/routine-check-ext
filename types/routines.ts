export interface Routine {
  id: string;
  title: string;
  url?: string;
  completed: boolean;
  text?: string;
}

export interface LocalStorageRoutine {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface RoutineFormData {
  title: string;
  url?: string;
}
