import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  // Initialize from localStorage/system preference immediately
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return saved === "dark" || (!saved && prefersDark);
  });

  // Apply theme on mount and when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="w-9 h-9 flex items-center justify-center rounded-full 
                 bg-[#FCFCF9] dark:bg-[#2B2B2B]
                 border border-[#D3D2C9] dark:border-[#3A3A3A]
                 hover:bg-[#F2F1EB] dark:hover:bg-[#3A3A3A]
                 transition-colors duration-200"
    >
      {darkMode ? (
        <Sun size={16} className="text-[#FDB822]" />
      ) : (
        <Moon size={16} className="text-[#2E7BE4]" />
      )}
    </button>
  );
}