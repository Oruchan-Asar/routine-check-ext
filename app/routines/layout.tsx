import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Routines | Routine Check",
  description: "View and manage your daily routines and tasks",
};

export default function RoutinesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="max-w-4xl mx-auto w-full">{children}</div>;
}
