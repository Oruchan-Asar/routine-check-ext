import React from "react";
import { Routine } from "@/types/routines";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";

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
    <Card className="mb-4">
      <CardContent className="flex items-center gap-4 p-6">
        <Checkbox
          checked={routine.completed}
          onCheckedChange={() => onToggle(routine.id)}
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  routine.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(routine.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};
