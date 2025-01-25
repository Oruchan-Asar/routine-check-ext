import React from "react";
import { RoutineFormData } from "@/types/routines";

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
              <input
                type="text"
                value={formData.title || ""}
                onChange={onChange}
                className="w-full p-2 border rounded-lg text-gray-900 dark:text-gray-900"
                autoFocus
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
