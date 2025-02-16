"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/PasswordInput";
import { Alert } from "@/components/Alert";
import { useLogin } from "@/hooks/useLogin";

export default function LoginPage() {
  const { formData, error, setFormData, handleSubmit } = useLogin();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-[350px] p-6 border rounded-lg shadow-lg">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Login</h2>
          <p className="text-gray-600">Welcome back!</p>
        </div>

        {error && <Alert type="error" message={error} />}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              autoComplete="email"
            />
            <PasswordInput
              value={formData.password}
              onChange={(value) =>
                setFormData({ ...formData, password: value })
              }
              placeholder="Password"
              autoComplete="current-password"
            />
          </div>
          <div className="mt-6 space-y-4">
            <Button type="submit" className="w-full">
              Login
            </Button>
            <p className="text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-blue-500">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
