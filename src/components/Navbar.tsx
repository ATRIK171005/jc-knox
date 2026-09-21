import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { nav, site } from "../content";
import { EASE } from "../lib/motion";
import JCLogo from "./JCLogo";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: EASE }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-ash /85 py-[10px] backdrop-blur-xl"
          : "border-b border-transparent py-[20px]"
      }`}
    >
      <div className="shell flex items-center justify-between">
        {/* Dithered particle "JC" mark, with the wordmark alongside it.
            cornerRadius 0.5 rounds the dither mask into a full circle;
            it needs enough pixels to resolve or the particles merge. */}
        <a href="#top" className="flex items-center relative w-[48px] h-[48px]">
          <JCLogo
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[100px] w-[100px] shrink-0 rounded-full text-ink"
            gridSize={64}
            cornerRadius={0.5}
          />
        </a>

        <nav className="hidden items-center gap-[32px] md:flex">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="ghost-link !text-[11px]">
              <span className="line uppercase tracking-[0.05em]">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="text-ink hover:opacity-70 transition-opacity active:scale-95 h-10 w-10 flex items-center justify-center"
            aria-label="Toggle dark mode"
          >
            <ThemeToggleIcon isDark={isDark} />
          </button>
          <a href="#contact" className="pill">
            <span>Let&apos;s talk</span>
            <span className="text-[1.15em] leading-none">&rarr;</span>
          </a>
        </div>

        <div className="flex md:hidden items-center gap-4">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="text-ink hover:opacity-70 transition-opacity active:scale-95 h-10 w-10 flex items-center justify-center"
            aria-label="Toggle dark mode"
          >
            <ThemeToggleIcon isDark={isDark} />
          </button>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="text-ink"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden border-t border-ash  md:hidden"
          >
            <div className="shell flex flex-col gap-[19px] py-[30px]">
              {[...nav, { label: "Contact", href: "#contact" }].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-subheading leading-subheading tracking-subheading uppercase text-ink"
                >
                  {item.label}
                </a>
              ))}
              <a href={`mailto:${site.email}`} className="label mt-[19px] opacity-70">
                {site.email}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function ThemeToggleIcon({ isDark }: { isDark: boolean }) {
  return (
    <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
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
