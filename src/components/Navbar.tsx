import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun } from "lucide-react";
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
            className="text-ink hover:opacity-70 transition-opacity"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <a href="#contact" className="pill">
            <span>Let&apos;s talk</span>
            <span className="text-[1.15em] leading-none">&rarr;</span>
          </a>
        </div>

        <div className="flex md:hidden items-center gap-4">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="text-ink hover:opacity-70 transition-opacity"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="text-ink"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
