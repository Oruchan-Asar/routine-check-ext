"use client";

import Navigation from "@/components/Navigation";
import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";

export default function ClientLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <body className={className} suppressHydrationWarning>
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
