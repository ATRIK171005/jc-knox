import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { nav, site } from "../content";
import { EASE } from "../lib/motion";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
        <a href="#top" className="flex items-center relative w-12 h-12 md:w-16 md:h-16">
          {/* mix-blend-mode:multiply makes the white background invisible on light surfaces */}
          <img
            src="/logos/jck-logo.png"
            alt="JC Knox"
            className="w-full h-full object-contain mix-blend-multiply dark:invert dark:mix-blend-normal"
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
          <a href="#contact" className="pill">
            <span>Let&apos;s talk</span>
            <span className="text-[1.15em] leading-none">&rarr;</span>
          </a>
        </div>

        <div className="flex md:hidden items-center gap-4">
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
