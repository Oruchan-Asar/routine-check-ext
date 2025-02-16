"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/PasswordInput";
import { Alert } from "@/components/Alert";
import { useSignup } from "@/hooks/useSignup";

export default function SignupPage() {
  const { formData, error, setFormData, handleSubmit } = useSignup();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-[350px] p-6 border rounded-lg shadow-lg">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Sign Up</h2>
          <p className="text-gray-600">Create your account</p>
        </div>

        {error && <Alert type="error" message={error} />}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
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
              autoComplete="new-password"
            />
          </div>
          <div className="mt-6 space-y-4">
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-500">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
