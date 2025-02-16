import { cn } from "@/lib/utils";

interface AlertProps {
  type: "error" | "success";
  message: string;
}

export function Alert({ type, message }: AlertProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "mb-4 p-3 border rounded",
        type === "error"
          ? "bg-red-100 border-red-400 text-red-700"
          : "bg-green-100 border-green-400 text-green-700"
      )}
    >
      {message}
    </div>
  );
}
