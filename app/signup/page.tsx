"use client";

import { useState } from "react";
import Link from "next/link";

interface ExtensionTodo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      // Get todos from extension's local storage if available
      let extensionTodos: ExtensionTodo[] = [];
      if (typeof chrome !== "undefined" && chrome.storage) {
        const result = await chrome.storage.local.get(["currentTodos"]);
        extensionTodos = result.currentTodos || [];
      }

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          extensionTodos,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Clear extension todos after successful import
        if (typeof chrome !== "undefined" && chrome.storage) {
          await chrome.storage.local.set({ currentTodos: [] });
        }
        window.location.href = "/login";
      } else {
        setError(data.error || "Failed to sign up");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-[350px] p-6 border rounded-lg shadow-lg">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Sign Up</h2>
          <p className="text-gray-600">Create your account</p>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 border rounded text-gray-900 bg-white"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded text-gray-900 bg-white"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 border rounded text-gray-900 bg-white"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              autoComplete="new-password"
            />
          </div>
          <div className="mt-6 space-y-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Sign Up
            </button>
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
