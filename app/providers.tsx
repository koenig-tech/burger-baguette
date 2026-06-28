"use client";

import ErrorBoundary from "@/components/ErrorBoundary";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { registerServiceWorker } from "@/registerServiceWorker";
import { useEffect } from "react";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <LanguageProvider>{children}</LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
