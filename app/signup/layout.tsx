import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Routine Check",
  description: "Create your Routine Check account",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
