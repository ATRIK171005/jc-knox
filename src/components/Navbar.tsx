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
          ? "border-b border-ash/85 py-[4px] backdrop-blur-xl"
          : "border-b border-transparent py-[8px]"
      }`}
    >
      <div className="shell flex items-center justify-between">
        <a href="#top" className="flex items-center relative w-10 h-10 md:w-12 md:h-12">
          <img
            src="/logos/logo-dark-ink-v2.png"
            alt="Brand Logo"
            className="w-full h-full object-contain dark:hidden"
          />
          <img
            src="/logos/logo-beige-v2.png"
            alt="Brand Logo"
            className="hidden w-full h-full object-contain dark:block"
          />
        </a>

        <nav className="hidden items-center gap-[32px] md:flex">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="ghost-link !text-[11px]">
              <span className="line uppercase tracking-[0.05em]">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="flex md:hidden items-center gap-4">
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="text-ink p-3 -mr-3 touch-manipulation"
          >
            {open ? <X size={36} strokeWidth={1.5} /> : <Menu size={36} strokeWidth={1.5} />}
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
            className="overflow-hidden border-t border-ash md:hidden"
            style={{ backgroundColor: "var(--color-parchment)" }}
          >
            <div className="shell flex flex-col gap-[14px] py-[20px]">
              {[...nav, { label: "Contact", href: "#contact" }].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="uppercase touch-manipulation"
                  style={{
                    fontSize: "18px",
                    color: "var(--color-ink)",
                    letterSpacing: "0.05em",
                    lineHeight: 1.4,
                    textDecoration: "none",
                  }}
                >
                  {item.label}
                </a>
              ))}
              <a
                href={`mailto:${site.email}`}
                className="touch-manipulation"
                style={{
                  fontSize: "11px",
                  color: "var(--color-ink)",
                  opacity: 0.7,
                  marginTop: "4px",
                  textDecoration: "none",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                {site.email}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
