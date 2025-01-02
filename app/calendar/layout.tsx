import React from "react";

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="max-w-4xl mx-auto">{children}</div>;
}
