import { useState } from "react";
import { getExtensionRoutines, clearExtensionRoutines } from "@/lib/storage";

interface SignupForm {
  email: string;
  password: string;
  name: string;
}

interface ValidationError {
  code: string;
  validation?: string;
  message: string;
  path: string[];
  minimum?: number;
}

interface SignupResult {
  formData: SignupForm;
  error: string;
  setFormData: (data: SignupForm) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function useSignup(): SignupResult {
  const [formData, setFormData] = useState<SignupForm>({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const extensionRoutines = await getExtensionRoutines();

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          extensionRoutines,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await clearExtensionRoutines();
        window.location.href = "/login";
      } else {
        if (data.details && Array.isArray(data.details)) {
          // Format validation errors into a readable message
          const errorMessages = data.details.map((error: ValidationError) => {
            if (
              error.code === "invalid_string" &&
              error.validation === "email"
            ) {
              return "Please enter a valid email address";
            }
            if (error.code === "too_small" && error.path[0] === "password") {
              return `Password must be at least ${error.minimum} characters long`;
            }
            return error.message;
          });
          setError(errorMessages.join("\n"));
        } else {
          setError(data.error || "Failed to sign up");
        }
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Signup failed:", error);
    }
  };

  return {
    formData,
    error,
    setFormData,
    handleSubmit,
  };
}
