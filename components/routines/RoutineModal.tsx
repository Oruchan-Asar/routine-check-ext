import React from "react";
import { RoutineFormData } from "@/types/routines";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RoutineModalProps {
  isOpen: boolean;
  title: string;
  formData: RoutineFormData;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  submitLabel: string;
}

export const RoutineModal: React.FC<RoutineModalProps> = ({
  isOpen,
  title,
  formData,
  onSubmit,
  onChange,
  onClose,
  submitLabel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input
                type="text"
                name="title"
                value={formData.title || ""}
                onChange={onChange}
                autoFocus
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                URL (optional)
              </label>
              <Input
                type="url"
                name="url"
                value={formData.url || ""}
                onChange={onChange}
                placeholder="https://example.com"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button type="submit" variant="default">
              {submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
