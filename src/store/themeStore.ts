import { createContext, useContext, useState, createElement, useEffect } from "react";
import type { ReactNode } from "react";
import { themes, defaultTheme } from "../lib/themes";
import type { Theme } from "../lib/themes";

interface ThemeContextType {
  theme: Theme;
  setTheme: (id: string) => void;
  allThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("td-theme");
    return themes.find(t => t.id === saved) ?? defaultTheme;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--td-bg", theme.colors.bg);
    root.style.setProperty("--td-card", theme.colors.card);
    root.style.setProperty("--td-accent", theme.colors.accent);
    root.style.setProperty("--td-accent-text", theme.colors.accentText);
    root.style.setProperty("--td-label", theme.colors.label);
    root.style.setProperty("--td-secondary", theme.colors.secondary);
    root.style.setProperty("--td-separator", theme.colors.separator);
    root.style.setProperty("--td-fill", theme.colors.fill);
    root.style.setProperty("--td-nav-bg", theme.colors.navBg);
    document.body.style.backgroundColor = theme.colors.bg;
  }, [theme]);

  const setTheme = (id: string) => {
    const found = themes.find(t => t.id === id);
    if (found) {
      setThemeState(found);
      localStorage.setItem("td-theme", id);
    }
  };

  return createElement(ThemeContext.Provider, {
    value: { theme, setTheme, allThemes: themes },
    children,
  });
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
