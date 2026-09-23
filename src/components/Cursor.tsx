import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const [enabled] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (any-pointer: fine)").matches
  );
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (enabled) {
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

    let tx = window.innerWidth / 2, ty = window.innerHeight / 2, rx = window.innerWidth / 2, ry = window.innerHeight / 2, currentScale = 0.4, frame = 0;
    let isActive = false;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      
      const el = e.target as HTMLElement;
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
      if (dot.current) {
        dot.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999]">
      {/* Inner Dot */}
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 rounded-full bg-ink dark:bg-parchment"
        style={{
          width: 6,
          height: 6,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.2s ease",
          transformOrigin: "center center",
        }}
      />
      {/* Outer Ring */}
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
