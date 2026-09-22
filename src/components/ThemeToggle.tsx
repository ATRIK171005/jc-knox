import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      // Default to dark mode unless the user explicitly saved 'light'
      return localStorage.getItem("theme") !== "light";
    }
    return true;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center text-ink opacity-70 hover:opacity-100 hover:scale-110 transition-all active:scale-95 md:bottom-8 md:right-8 p-2 touch-manipulation"
      aria-label="Toggle dark mode"
    >
      <ThemeToggleIcon isDark={isDark} />
    </button>
  );
}

function ThemeToggleIcon({ isDark }: { isDark: boolean }) {
  return (
    <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 md:w-12 md:h-12">
      <motion.g
        animate={{ rotate: isDark ? -180 : 0 }}
        transition={{ ease: "easeInOut", duration: 0.35 }}
      >
        <path
          d="M120 67.5C149.25 67.5 172.5 90.75 172.5 120C172.5 149.25 149.25 172.5 120 172.5"
          fill="currentColor"
        />
        <path
          d="M120 67.5C90.75 67.5 67.5 90.75 67.5 120C67.5 149.25 90.75 172.5 120 172.5"
          fill="var(--color-parchment)"
        />
      </motion.g>
      <motion.path
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ ease: "easeInOut", duration: 0.35 }}
        d="M120 3.75C55.5 3.75 3.75 55.5 3.75 120C3.75 184.5 55.5 236.25 120 236.25C184.5 236.25 236.25 184.5 236.25 120C236.25 55.5 184.5 3.75 120 3.75ZM120 214.5V172.5C90.75 172.5 67.5 149.25 67.5 120C67.5 90.75 90.75 67.5 120 67.5V25.5C172.5 25.5 214.5 67.5 214.5 120C214.5 172.5 172.5 214.5 120 214.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
