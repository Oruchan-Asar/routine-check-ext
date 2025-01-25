export interface Routine {
  id: string;
  title: string;
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
}
