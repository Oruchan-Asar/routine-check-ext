"use client";

import React, { useEffect, useState } from "react";
import { FaSync } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { Routine, RoutineFormData } from "../../types/routines";
import { useRoutines } from "../../hooks/useRoutines";
import { RoutineModal } from "@/components/routines/RoutineModal";
import { RoutineItem } from "@/components/routines/RoutineItem";

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
  });

  useEffect(() => {
    if (status !== "loading") {
      fetchRoutines();
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isAddModalOpen && !isEditModalOpen) {
      setFormData({ title: "" });
      setEditingRoutine(null);
    }
  }, [isAddModalOpen, isEditModalOpen]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      await addRoutine(formData.title);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !editingRoutine) return;

    try {
      await updateRoutine(editingRoutine.id, formData.title);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating routine:", error);
    }
  };

  const handleEdit = (routine: Routine) => {
    setEditingRoutine(routine);
    setFormData({ title: routine.title });
    setIsEditModalOpen(true);
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto mt-32">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Routines</h1>
        <div className="flex gap-2">
          <button
            onClick={syncRoutines}
            className={`px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1 ${
              isSyncing ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSyncing}
          >
            <FaSync className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
            Sync
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Add Routine
          </button>
        </div>
      </div>

      {routines.length === 0 ? (
        <p className="text-gray-500">
          No routines yet. Create your first routine to get started!
        </p>
      ) : (
        <div className="space-y-4">
          {routines.map((routine) => (
            <RoutineItem
              key={routine.id}
              routine={routine}
              onToggle={toggleRoutine}
              onEdit={handleEdit}
              onDelete={deleteRoutine}
            />
          ))}
        </div>
      )}

      <RoutineModal
        isOpen={isAddModalOpen}
        title="Add Routine"
        formData={formData}
        onSubmit={handleAddSubmit}
        onChange={(e) => setFormData({ title: e.target.value })}
        onClose={() => setIsAddModalOpen(false)}
        submitLabel="Add Routine"
      />

      <RoutineModal
        isOpen={isEditModalOpen}
        title="Edit Routine"
        formData={formData}
        onSubmit={handleEditSubmit}
        onChange={(e) => setFormData({ title: e.target.value })}
        onClose={() => setIsEditModalOpen(false)}
        submitLabel="Save Changes"
      />
    </div>
  );
}
