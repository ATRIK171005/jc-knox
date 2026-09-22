import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "../content";

/**
 * Entry overlay, modelled on mariavasilyeva.com.
 *
 * Measured on the source rather than guessed:
 *   div.intro   position: fixed, z-index: 9999, <html> overflow hidden
 *   counter     0 -> 100, roughly 2.5s, monospace-ish tabular digits
 *   status line rotates through short messages while loading
 *   exit        clip-path: inset(...) wipe upward, not a fade
 *   gate        the overlay waits for a click ("Be ready to play") before
 *               it leaves — audio can't autoplay without a gesture
 *
 * Deviations for this site: our copy, our palette, and the gate is optional
 * (`requireClick`) because we have no audio to unlock. The counter tracks
 * real progress — document readiness and webfonts — then eases to 100 so it
 * never lies about being finished.
 */

const MESSAGES = [
  "Warming up the studio",
  "This will only take a moment",
  "Setting the type",
  "Mixing the palette",
  "Ready when you are",
];

const EASE = [0.165, 0.84, 0.44, 1] as const;

export default function Intro({
  requireClick = true,
  onDone,
}: {
  requireClick?: boolean;
  onDone?: () => void;
}) {
  const [pct, setPct] = useState(0);
  const [msg, setMsg] = useState(0);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  // Lazily initialised in the effect: calling Date.now() during render is
  // impure and can drift across re-renders.
  const startedAt = useRef(0);
  // Set when a click arrives before the counter has finished.
  const wantsIn = useRef(false);

  // Only a repeat visit in the same tab skips the intro outright.
  // Reduced-motion users still SEE it — they just get it without the
  // sliding/wiping flourishes (see `calm` below). Hiding it entirely meant
  // anyone with "reduce motion" on in their OS never saw the entry page.
  const skip = useRef(false); // Temporarily set to false so you can see it on every refresh

  // Respect the motion preference for HOW it animates, not WHETHER it shows.
  const calm = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    if (skip.current) {
      setGone(true);
      onDone?.();
      return;
    }

    // Lock the page while the overlay is up, exactly as the source does.
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    startedAt.current = Date.now();

    // Real progress: fonts + window load, with a floor so it always moves
    // and a ceiling so it can't sit at 100 before the work is actually done.
    let loaded = 0;
    const bump = () => (loaded = Math.min(1, loaded + 0.5));
    if (document.fonts?.ready) document.fonts.ready.then(bump);
    else bump();
    if (document.readyState === "complete") bump();
    else window.addEventListener("load", bump, { once: true });

    let raf = 0;
    const MIN_MS = 2500; // the source takes ~2.5s to reach 100
    const tick = () => {
      const elapsed = (Date.now() - startedAt.current) / MIN_MS;
      // Whichever is slower: the clock or the real work.
      const target = Math.min(elapsed, 0.65 + loaded * 0.35) * 100;
      setPct((p) => {
        const next = p + (target - p) * 0.08;
        return next > 99.4 ? 100 : next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const rotate = setInterval(
      () => setMsg((m) => (m + 1) % MESSAGES.length),
      1100,
    );

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(rotate);
      html.style.overflow = prev;
    };
  }, [onDone]);

  // Once the bar is full, either wait for the click gate or leave on its own.
  useEffect(() => {
    if (skip.current || pct < 100) return;
    setReady(true);
    if (!requireClick) {
      const t = setTimeout(() => setLeaving(true), 450);
      return () => clearTimeout(t);
    }
  }, [pct, requireClick]);

  const enter = () => {
    if (leaving) return;
    // If the visitor clicks before the counter finishes, remember it and
    // leave as soon as it does — dropping the click made dismissal depend
    // on split-second timing.
    if (!ready) {
      wantsIn.current = true;
      return;
    }
    setLeaving(true);
  };

  // Honour a click that arrived before the gate armed.
  useEffect(() => {
    if (ready && wantsIn.current && !leaving) setLeaving(true);
  }, [ready, leaving]);

  // Keyboard parity + a hard ceiling. An entry overlay that can't be
  // dismissed is a broken site, so it always leaves within 12s regardless
  // of what the loader reports.
  useEffect(() => {
    if (skip.current) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") enter();
    };
    window.addEventListener("keydown", onKey);
    const bail = setTimeout(() => setLeaving(true), 12000);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(bail);
    };
    // `enter` is stable enough here: it only reads refs and state setters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!leaving) return;
    sessionStorage.setItem("jck-intro-seen", "1");
    document.documentElement.style.overflow = "";
    const t = setTimeout(() => {
      setGone(true);
      onDone?.();
    }, 1100);
    return () => clearTimeout(t);
  }, [leaving, onDone]);

  if (gone) return null;

  const shown = Math.round(pct);

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          role="dialog"
          aria-label="Loading"
          onClick={enter}
          // The source exits with a clip-path wipe upward, not a fade.
          // Reduced motion gets a plain opacity fade instead of the wipe.
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={
            calm.current
              ? { opacity: 0 }
              : { clipPath: "inset(0% 0% 100% 0%)" }
          }
          transition={{ duration: calm.current ? 0.35 : 1, ease: EASE }}
          style={
            calm.current
              ? { opacity: leaving ? 0 : 1, transition: "opacity 350ms linear" }
              : {
                  clipPath: leaving
                    ? "inset(0% 0% 100% 0%)"
                    : "inset(0% 0% 0% 0%)",
                }
          }
          className={`fixed inset-0 z-[9999] flex flex-col justify-between bg-parchment px-[30px] py-[30px] md:px-[46px] ${
            calm.current ? "" : "transition-[clip-path] duration-[1000ms]"
          } ${ready && requireClick ? "cursor-pointer" : ""}`}
        >
          {/* Top rail: wordmark + state */}
          <div className="relative z-10 flex items-start justify-between">
            <span className="label !text-[13px] font-bold !tracking-[0.06em] text-ink flex items-center gap-3">
              <img 
                src="/logos/logo-dark-ink-v2.png" 
                alt="Brand Logo" 
                className="w-6 h-6 object-contain dark:hidden"
              />
              <img 
                src="/logos/logo-beige-v2.png" 
                alt="Brand Logo" 
                className="hidden w-6 h-6 object-contain dark:block"
              />
              {site.name}
            </span>
            <span className="label text-ink opacity-60 flex items-center gap-2">
              {ready ? "READY" : "LOADING"}
              {!ready && (
                <span className="flex gap-1">
                  <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} className="h-1 w-1 rounded-full bg-ink opacity-60" />
                  <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} className="h-1 w-1 rounded-full bg-ink opacity-60" />
                  <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} className="h-1 w-1 rounded-full bg-ink opacity-60" />
                </span>
              )}
            </span>
          </div>

          {/* Centre: the rotating status line. */}
          <div className="relative z-10 flex flex-1 items-center justify-center">
            <div className="relative h-[1.4em] w-full max-w-[36ch] text-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={ready ? "ready" : msg}
                  initial={{ opacity: 0, y: calm.current ? 0 : 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: calm.current ? 0 : -14 }}
                  transition={{ duration: calm.current ? 0.25 : 0.5, ease: EASE }}
                  className="text-body leading-body tracking-body m-0 text-ink"
                >
                  {ready
                    ? requireClick
                      ? "Click anywhere to enter"
                      : "Enjoy the experience"
                    : MESSAGES[msg]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom rail: progress line + counter. */}
          <div className="relative z-10 flex flex-col gap-[15px]">
            <div className="relative h-px w-full bg-ash">
              <motion.div
                className="absolute inset-y-0 left-0 bg-ink"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex items-end justify-between">
              <span className="label text-ink opacity-60">
                {site.name} — {new Date().getFullYear()}
              </span>
              <span
                className="text-heading leading-heading tracking-heading text-ink"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {shown}
                <span className="text-subheading leading-subheading align-super">
                  %
                </span>
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
