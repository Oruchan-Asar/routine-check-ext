"use client";

import { Geist, Geist_Mono } from "next/font/google";
import Navigation from "@/components/Navigation";
import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          {children}
          <Analytics />
          <Footer />
        </ThemeProvider>
      </AuthProvider>
    </body>
  );
}
