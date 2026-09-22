import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor:
 *  - Solid filled circle that tracks the pointer
 *  - Uses mix-blend-mode: difference to invert colours on hover
 *  - Grows when hovering interactive elements
 *  - Skipped on touch/coarse-pointer devices
 */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);

  const [enabled] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (any-pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  // Hide native cursor everywhere
  useEffect(() => {
    if (!enabled) return;
    const style = document.createElement("style");
    style.innerHTML = `*, *::before, *::after { cursor: none !important; }`;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    let mx = 0, my = 0;
    let rx = 0, ry = 0;
    let frame = 0;
    let hovering = false;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;

      const target = e.target as HTMLElement;
      hovering = !!target.closest("a, button, input, textarea, label, select, [role='button']");
      
      // Make visible when moving
      if (ring.current) ring.current.style.opacity = "1";
    };

    const loop = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;

      if (ring.current) {
        const size = hovering ? 24 : 16;
        ring.current.style.width = `${size}px`;
        ring.current.style.height = `${size}px`;
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }

      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    const onLeave = () => {
      if (ring.current) ring.current.style.opacity = "0";
    };

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
    <>
      {/* Ring — trails behind, grows and inverts on hover */}
      <div
        ref={ring}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full"
        style={{
          width: 16,
          height: 16,
          backgroundColor: "#fff",
          mixBlendMode: "difference",
          opacity: 0,
          transition: "width 0.25s ease, height 0.25s ease, opacity 0.25s ease",
          willChange: "transform, opacity, width, height",
        }}
      />
    </>
  );
}
