import React, { createContext, useContext, useLayoutEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme?: () => void;
  switchable: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  switchable = true,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  const applyTheme = (nextTheme: Theme, persist = true) => {
    const root = document.documentElement;
    root.classList.toggle("dark", nextTheme === "dark");
    root.classList.toggle("light", nextTheme === "light");
    root.dataset.theme = nextTheme;
    root.style.colorScheme = nextTheme;

    if (persist) {
      window.localStorage.setItem("theme", nextTheme);
    }
  };

  useLayoutEffect(() => {
    const rootTheme = document.documentElement.dataset.theme;
    const initialTheme =
      rootTheme === "light" || rootTheme === "dark" ? rootTheme : defaultTheme;

    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, [defaultTheme]);

  const toggleTheme = switchable
    ? () => {
        setTheme(prev => {
          const nextTheme = prev === "light" ? "dark" : "light";
          applyTheme(nextTheme);
          return nextTheme;
        });
      }
    : undefined;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, switchable }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
