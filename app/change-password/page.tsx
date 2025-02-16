"use client";

import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/PasswordInput";
import { useChangePassword } from "@/hooks/useChangePassword";

export default function ChangePasswordPage() {
  const { formData, error, success, setFormData, handleSubmit } =
    useChangePassword();

  return (
    <div className="flex items-center justify-center min-h-dvh">
      <div className="w-[350px] p-6 border rounded-lg shadow-lg">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Change Password</h2>
          <p className="text-gray-600">Update your password</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <PasswordInput
              value={formData.currentPassword}
              onChange={(value) =>
                setFormData({ ...formData, currentPassword: value })
              }
              placeholder="Current Password"
              autoComplete="current-password"
            />
            <PasswordInput
              value={formData.newPassword}
              onChange={(value) =>
                setFormData({ ...formData, newPassword: value })
              }
              placeholder="New Password"
              autoComplete="new-password"
            />
            <PasswordInput
              value={formData.confirmPassword}
              onChange={(value) =>
                setFormData({ ...formData, confirmPassword: value })
              }
              placeholder="Confirm New Password"
              autoComplete="new-password"
            />
          </div>
          <div className="mt-6">
            <Button type="submit" className="w-full">
              Change Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
