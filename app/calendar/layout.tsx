import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendar | Routine Check",
  description: "View your routines and tasks in a calendar format",
};

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="max-w-4xl mx-auto w-full">{children}</div>;
}
