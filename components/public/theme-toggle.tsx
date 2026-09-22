"use client";

import * as React from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<"dark" | "light">("dark");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme") as "dark" | "light" | null;
    if (stored) {
      setTheme(stored);
      if (stored === "light") {
        document.documentElement.classList.add("light");
        document.documentElement.setAttribute("data-theme", "light");
      } else {
        document.documentElement.classList.remove("light");
        document.documentElement.setAttribute("data-theme", "dark");
      }
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light");
      document.documentElement.classList.add("light");
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);

    if (next === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.setAttribute("data-theme", "dark");
    }
  };

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle visual theme"
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-foreground-secondary opacity-0 transition-opacity"
      >
        <span className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface/80 text-foreground-secondary hover:border-border-hover hover:text-foreground hover:bg-surface transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-blue-500 transition-transform duration-200 hover:-rotate-12" />
      )}
    </button>
  );
}
