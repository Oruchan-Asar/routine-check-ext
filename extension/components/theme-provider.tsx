import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

interface Props {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: Props) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
