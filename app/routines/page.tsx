"use client";

import React, { useEffect, useState } from "react";
import { FaSync } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { Routine, RoutineFormData } from "../../types/routines";
import { useRoutines } from "../../hooks/useRoutines";
import { RoutineModal } from "@/components/routines/RoutineModal";
import { RoutineItem } from "@/components/routines/RoutineItem";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RoutinesPage() {
  const { status } = useSession();
  const {
    routines,
    loading,
    isSyncing,
    syncRoutines,
    toggleRoutine,
    addRoutine,
    updateRoutine,
    deleteRoutine,
    fetchRoutines,
  } = useRoutines();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [formData, setFormData] = useState<RoutineFormData>({
    title: "",
    url: "",
  });

  useEffect(() => {
    if (status !== "loading") {
      fetchRoutines();
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isAddModalOpen && !isEditModalOpen) {
      setFormData({ title: "", url: "" });
      setEditingRoutine(null);
    }
  }, [isAddModalOpen, isEditModalOpen]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      await addRoutine(formData.title, formData.url);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !editingRoutine) return;

    try {
      await updateRoutine(editingRoutine.id, formData.title, formData.url);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating routine:", error);
    }
  };

  const handleEdit = (routine: Routine) => {
    setEditingRoutine(routine);
    setFormData({ title: routine.title, url: routine.url || "" });
    setIsEditModalOpen(true);
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto mt-32">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Routines</h1>
        <div className="flex gap-2">
          <Button
            onClick={syncRoutines}
            variant="secondary"
            disabled={isSyncing}
            className="flex items-center gap-1"
          >
            <FaSync className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
            Sync
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)} variant="default">
            Add Routine
          </Button>
        </div>
      </div>

      {routines.length === 0 ? (
        <p className="text-gray-500">
          No routines yet. Create your first routine to get started!
        </p>
      ) : (
        <div className="space-y-4">
          <ScrollArea className="h-[500px] pr-4">
            {routines.map((routine) => (
              <RoutineItem
                key={routine.id}
                routine={routine}
                onToggle={toggleRoutine}
                onEdit={handleEdit}
                onDelete={deleteRoutine}
              />
            ))}
          </ScrollArea>
        </div>
      )}

      <RoutineModal
        isOpen={isAddModalOpen}
        title="Add Routine"
        formData={formData}
        onSubmit={handleAddSubmit}
        onChange={(e) =>
          setFormData({ ...formData, [e.target.name]: e.target.value })
        }
        onClose={() => setIsAddModalOpen(false)}
        submitLabel="Add Routine"
      />

      <RoutineModal
        isOpen={isEditModalOpen}
        title="Edit Routine"
        formData={formData}
        onSubmit={handleEditSubmit}
        onChange={(e) =>
          setFormData({ ...formData, [e.target.name]: e.target.value })
        }
        onClose={() => setIsEditModalOpen(false)}
        submitLabel="Save Changes"
      />
    </div>
  );
}
