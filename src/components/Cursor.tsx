import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor, matching the source site's .cursor-w / .cursor-dot:
 *   - outer ring: opacity 0.2s ease, trails the pointer with easing
 *   - inner dot:  scale 0.3s ease, tracks the pointer exactly
 *   - both grow when hovering anything interactive
 *
 * Pointer-only: skipped entirely on touch devices and for reduced-motion
 * users, where a fake cursor is worse than none.
 */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  // Derived once at init rather than set from inside the effect — a fine
  // pointer and motion preference can't change mid-session in practice.
  const [enabled] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (any-pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (enabled) {
      // Robustly hide system cursor on all interactive elements
      const style = document.createElement('style');
      style.innerHTML = `
        *, *::before, *::after, a, button, input, [role="button"] { 
          cursor: none !important; 
        }
      `;
      document.head.appendChild(style);
      document.documentElement.classList.add('cursor-none');
      
      return () => {
        document.head.removeChild(style);
        document.documentElement.classList.remove('cursor-none');
      };
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    let tx = 0, ty = 0, rx = 0, ry = 0, currentScale = 0.4, frame = 0;
    // We keep track of active state in a ref so the rAF loop can read it without React state staleness
    let isActive = false;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      setVisible(true);
      
      const el = e.target as HTMLElement;
      // Read straight from the local, not React state: the rAF loop below
      // needs the current value without re-render staleness.
      isActive = !!el.closest('a, button, input, textarea, label, [role="button"]');
    };

    const loop = () => {
      rx += (tx - rx) * 0.15;
      ry += (ty - ry) * 0.15;
      
      const targetScale = isActive ? 0.6 : 0.4;
      currentScale += (targetScale - currentScale) * 0.15;
      
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${currentScale})`;
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    const onLeave = () => setVisible(false);
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999]">
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 rounded-full border border-ink dark:border-parchment"
        style={{
          width: 34,
          height: 34,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.2s ease",
          transformOrigin: "center center",
          backgroundColor: "transparent",
        }}
      />
    </div>
  );
}
