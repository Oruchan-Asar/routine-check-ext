import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Privacy Policy | Routine Check",
  description:
    "Terms of service and privacy policy for Routine Check Extension",
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
