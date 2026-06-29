"use client";

import ErrorBoundary from "@/components/ErrorBoundary";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useEffect } from "react";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .getRegistrations()
      .then(registrations =>
        Promise.all(registrations.map(registration => registration.unregister()))
      )
      .catch(() => {});

    if ("caches" in window) {
      window.caches
        .keys()
        .then(keys =>
          Promise.all(
            keys
              .filter(key => key.startsWith("bb-"))
              .map(key => window.caches.delete(key))
          )
        )
        .catch(() => {});
    }
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <LanguageProvider>{children}</LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
