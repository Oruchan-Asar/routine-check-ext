import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Routine, LocalStorageRoutine } from "../types/routines";
import { useRoutineStorage } from "./useRoutineStorage";

export const useRoutines = () => {
  const { data: session } = useSession();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const { saveToLocalStorage, getFromLocalStorage, clearLocalStorage } =
    useRoutineStorage();

  const formatLocalRoutines = (
    localRoutines: LocalStorageRoutine[]
  ): Routine[] => {
    return localRoutines.map((routine) => ({
      id: routine.id,
      title: routine.text,
      completed: routine.completed,
    }));
  };

  const handleLocalRoutinesSync = useCallback(
    async (
      localRoutines: LocalStorageRoutine[],
      existingDbRoutines: Routine[]
    ) => {
      if (localRoutines.length === 0) return;

      for (const localRoutine of localRoutines) {
        try {
          const routineExists = existingDbRoutines.some(
            (dbRoutine: Routine) =>
              dbRoutine.title.toLowerCase() === localRoutine.text.toLowerCase()
          );

          if (!routineExists) {
            const addResponse = await fetch("/api/routines", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: localRoutine.text,
                completed: localRoutine.completed,
              }),
            });

            if (!addResponse.ok) throw new Error("Failed to add routine to DB");
            await addResponse.json();
          }
        } catch (error) {
          console.error("Error syncing local routine to DB:", error);
        }
      }

      clearLocalStorage();
    },
    [clearLocalStorage]
  );

  const fetchRoutines = useCallback(async () => {
    try {
      if (session?.user) {
        const response = await fetch("/api/routines");
        if (!response.ok) {
          throw new Error(
            `Failed to fetch routines: ${response.status} ${response.statusText}`
          );
        }
        const dbRoutines = await response.json();
        setRoutines(dbRoutines);

        // Handle local storage sync with already fetched routines
        const localRoutines = await getFromLocalStorage();
        if (localRoutines.length > 0) {
          await handleLocalRoutinesSync(localRoutines, dbRoutines);
        }
      } else {
        const localRoutines = await getFromLocalStorage();
        setRoutines(formatLocalRoutines(localRoutines));
      }
    } catch (error) {
      console.error("Error fetching routines:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.user, getFromLocalStorage, handleLocalRoutinesSync]);

  const syncRoutines = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch("/api/routines");
      if (!response.ok) throw new Error("Failed to sync routines");
      const dbRoutines = await response.json();
      setRoutines(dbRoutines);
    } catch (error) {
      console.error("Error syncing routines:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleRoutine = async (id: string) => {
    try {
      const routine = routines.find((r) => r.id === id);
      if (!routine) return;

      if (session?.user) {
        const response = await fetch(`/api/routines/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: !routine.completed }),
        });

        if (!response.ok) throw new Error("Failed to update routine");
      } else {
        const localRoutines = await getFromLocalStorage();
        const updatedRoutines = localRoutines.map((routine) =>
          routine.id === id
            ? { ...routine, completed: !routine.completed }
            : routine
        );
        saveToLocalStorage(updatedRoutines);
      }

      setRoutines((prev) =>
        prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
      );
    } catch (error) {
      console.error("Error updating routine:", error);
    }
  };

  const addRoutine = async (title: string, url?: string) => {
    if (!session) return;

    try {
      const response = await fetch("/api/routines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, url }),
      });

      if (!response.ok) throw new Error("Failed to add routine");

      const newRoutine = await response.json();
      setRoutines((prev) => [...prev, newRoutine]);
    } catch (error) {
      console.error("Error adding routine:", error);
      throw error;
    }
  };

  const updateRoutine = async (id: string, title: string, url?: string) => {
    if (!session) return;

    try {
      const response = await fetch(`/api/routines/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, url }),
      });

      if (!response.ok) throw new Error("Failed to update routine");

      const updatedRoutine = await response.json();
      setRoutines((prev) =>
        prev.map((routine) =>
          routine.id === id ? { ...routine, ...updatedRoutine } : routine
        )
      );
    } catch (error) {
      console.error("Error updating routine:", error);
      throw error;
    }
  };

  const deleteRoutine = async (id: string) => {
    try {
      if (session?.user) {
        const response = await fetch(`/api/routines/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete routine");
      } else {
        const localRoutines = await getFromLocalStorage();
        const updatedRoutines = localRoutines.filter(
          (routine) => routine.id !== id
        );
        saveToLocalStorage(updatedRoutines);
      }

      setRoutines((prev) => prev.filter((routine) => routine.id !== id));
    } catch (error) {
      console.error("Error deleting routine:", error);
    }
  };

  return {
    routines,
    loading,
    isSyncing,
    fetchRoutines,
    syncRoutines,
    toggleRoutine,
    addRoutine,
    updateRoutine,
    deleteRoutine,
  };
};
