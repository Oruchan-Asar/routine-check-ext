import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Change Password | Routine Check",
  description: "Change your Routine Check account password",
};

export default function ChangePasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
