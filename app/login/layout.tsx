import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Routine Check",
  description: "Log in to your Routine Check account",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
