import React from "react";
import { Routine } from "../../types/routines";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface RoutineItemProps {
  routine: Routine;
  onToggle: (id: string) => void;
  onEdit: (routine: Routine) => void;
  onDelete: (id: string) => void;
}

export const RoutineItem: React.FC<RoutineItemProps> = ({
  routine,
  onToggle,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <input
        type="checkbox"
        checked={routine.completed}
        onChange={() => onToggle(routine.id)}
        className="h-5 w-5 rounded border-gray-300"
      />
      <div className="flex-1">
        <h3
          className={`font-medium ${
            routine.completed ? "line-through text-gray-500" : ""
          }`}
        >
          {routine.title}
        </h3>
        {routine.url && (
          <Link
            href={routine.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            {routine.url}
          </Link>
        )}
      </div>
      <div className="flex gap-2">
        <Button onClick={() => onEdit(routine)} variant="ghost" size="sm">
          Edit
        </Button>
        <Button
          onClick={() => {
            if (confirm("Are you sure you want to delete this routine?")) {
              onDelete(routine.id);
            }
          }}
          variant="destructive"
          size="sm"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};
