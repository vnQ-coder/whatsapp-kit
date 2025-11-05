"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark" | "system";
type FontSize = "sm" | "md" | "lg";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  fontSize: FontSize;
  setTheme: (theme: Theme) => void;
  setFontSize: (fontSize: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [fontSize, setFontSizeState] = useState<FontSize>("md");
  const [mounted, setMounted] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    setMounted(true);
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    const storedFontSize = localStorage.getItem("fontSize") as FontSize | null;

    if (storedTheme) {
      setThemeState(storedTheme);
    } else {
      // Set default to system if nothing stored
      setThemeState("system");
    }
    
    if (storedFontSize) {
      setFontSizeState(storedFontSize);
      // Set font size immediately
      window.document.documentElement.setAttribute("data-font-size", storedFontSize);
    } else {
      // Set default font size
      window.document.documentElement.setAttribute("data-font-size", "md");
    }
  }, []);

  // Resolve theme based on system preference
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!mounted) return;

    const root = window.document.documentElement;

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setResolvedTheme(systemTheme);
      root.classList.remove("light", "dark");
      root.classList.add(systemTheme);
    } else {
      setResolvedTheme(theme);
      root.classList.remove("light", "dark");
      root.classList.add(theme);
    }

    // Apply font size
    root.setAttribute("data-font-size", fontSize);
  }, [theme, fontSize, mounted]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const systemTheme = e.matches ? "dark" : "light";
      setResolvedTheme(systemTheme);
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(systemTheme);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const updateTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
    }
  };

  const updateFontSize = (newFontSize: FontSize) => {
    setFontSizeState(newFontSize);
    if (typeof window !== "undefined") {
      localStorage.setItem("fontSize", newFontSize);
      window.document.documentElement.setAttribute("data-font-size", newFontSize);
    }
  };

  // Always provide context, even before mount to prevent errors
  return (
    <ThemeContext.Provider
      value={{ theme, resolvedTheme, fontSize, setTheme: updateTheme, setFontSize: updateFontSize }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

