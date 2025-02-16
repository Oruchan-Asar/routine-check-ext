import { useState } from "react";

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordResult {
  formData: ChangePasswordForm;
  error: string;
  success: string;
  setFormData: (data: ChangePasswordForm) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function useChangePassword(): ChangePasswordResult {
  const [formData, setFormData] = useState<ChangePasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Password changed successfully!");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setError(data.error || "Failed to change password");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Password change failed:", error);
    }
  };

  return {
    formData,
    error,
    success,
    setFormData,
    handleSubmit,
  };
}
