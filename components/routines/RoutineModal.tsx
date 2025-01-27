import React from "react";
import { RoutineFormData } from "@/types/routines";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
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
          <DialogFooter className="mt-6">
            <Button type="button" onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button type="submit" variant="default">
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
