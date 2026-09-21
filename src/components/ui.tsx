import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef, type ReactNode } from "react";
import {
  DUR,
  EASE,
  riseVariants,
  ruleVariants,
  unitVariants,
  VIEWPORT,
} from "../lib/motion";

/**
 * Fades + lifts its children once, when scrolled into view.
 * `delay` rides on `custom` so the variant keeps its own duration/easing —
 * passing a `transition` prop here would replace it and kill the animation.
 */
export function Rise({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "p" | "h2" | "h3";
}) {
  const Comp = motion[as];
  return (
    <Comp
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={riseVariants}
      custom={delay}
      className={className}
    >
      {children}
    </Comp>
  );
}

/**
 * Word-by-word masked reveal — the signature move on the source site.
 * Text is split into .word units inside overflow-hidden bands; each word
 * slides up from just past one line-box, staggered so a heading assembles
 * itself rather than fading in as a single block.
 *
 * `trigger="load"` runs immediately (hero); the default runs on scroll.
 */
export function SplitText({
  lines,
  className = "",
  delay = 0,
  stagger = 0.045,
  trigger = "scroll",
}: {
  lines: string[];
  className?: string;
  delay?: number;
  stagger?: number;
  trigger?: "scroll" | "load";
}) {
  const anim =
    trigger === "load"
      ? { initial: "hidden" as const, animate: "show" as const }
      : { initial: "hidden" as const, whileInView: "show" as const, viewport: VIEWPORT };

  let unit = 0;
  return (
    <span className={className}>
      {lines.map((line) => (
        <span key={line} className="block">
          {/* Each word gets its own mask so descenders never clip mid-word. */}
          {line.split(" ").map((word, w) => {
            const index = unit++;
            return (
              <span
                key={`${word}-${w}`}
                className="inline-block overflow-hidden align-bottom"
                style={{ paddingBottom: "0.08em", marginBottom: "-0.08em" }}
              >
                <motion.span
                  className="word inline-block"
                  variants={unitVariants}
                  custom={delay + index * stagger}
                  {...anim}
                >
                  {word}
                  {w < line.split(" ").length - 1 ? "\u00A0" : ""}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}

/**
 * Scroll-LINKED word reveal, the mechanism the source site actually uses:
 * word offsets are driven by scroll PROGRESS through the element, not by a
 * timer. Scroll halfway and the words sit halfway up; scroll back and they
 * return. A time-based reveal only looks similar on a single fast pass.
 */
export function ScrollText({
  lines,
  className = "",
  stagger = 0.09,
}: {
  lines: string[];
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    // From the element entering the bottom of the viewport to sitting mid-screen.
    offset: ["start end", "center center"],
  });

  // Flatten once, keeping a running index so the stagger is continuous
  // across line breaks rather than restarting on each line.
  let order = 0;
  const rows = lines.map((line) => {
    const words = line.split(" ");
    return words.map((word, wi) => ({
      word,
      key: `${word}-${wi}`,
      index: order++,
      trailingSpace: wi < words.length - 1,
    }));
  });
  const total = order || 1;

  return (
    <span ref={ref} className={className}>
      {rows.map((row, li) => (
        <span key={li} className="block">
          {row.map((u) => {
            const from = Math.min(0.85, (u.index * stagger) / total);
            return (
              <ScrollWord
                key={u.key}
                progress={scrollYProgress}
                from={from}
                to={Math.min(1, from + 0.45)}
                trailingSpace={u.trailingSpace}
              >
                {u.word}
              </ScrollWord>
            );
          })}
        </span>
      ))}
    </span>
  );
}

function ScrollWord({
  children,
  progress,
  from,
  to,
  trailingSpace,
}: {
  children: string;
  progress: MotionValue<number>;
  from: number;
  to: number;
  trailingSpace: boolean;
}) {
  const y = useTransform(progress, [from, to], ["108%", "0%"]);
  return (
    <span
      className="inline-block overflow-hidden align-bottom"
      style={{ paddingBottom: "0.08em", marginBottom: "-0.08em" }}
    >
      <motion.span className="word inline-block" style={{ y }}>
        {children}
        {trailingSpace ? "\u00A0" : ""}
      </motion.span>
    </span>
  );
}

/** 11px museum-signage label that sits above every section. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <Rise>
      <p className="label m-0">{children}</p>
    </Rise>
  );
}

/**
 * Ghost text link. The source site fills a track under the label on hover
 * (.link-track-fill, transform 0.6s ease) — the rule wipes in from the left
 * and out to the right, rather than simply toggling an underline.
 */
export function GhostLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a href={href} className={`ghost-link ${className}`}>
      <span className="line uppercase">{children}</span>
      <span className="arrow text-[1.15em] leading-none">&rarr;</span>
    </a>
  );
}

/** Pill ghost button — inverts to ink on hover. */
export function Pill({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a href={href} className={`pill ${className}`}>
      <span>{children}</span>
      <span className="text-[1.15em] leading-none">&rarr;</span>
    </a>
  );
}

/** Full-bleed 1px ash rule that draws itself in from the left. */
export function Hairline({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      aria-hidden="true"
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={ruleVariants}
      custom={delay}
      className="h-px w-full origin-left bg-ash"
    />
  );
}

/**
 * The 'pulse' keyframe from the source site: a vertical rule that scales
 * from nothing to full height and back, forever. Used as the scroll cue.
 */
export function PulseLine({ className = "" }: { className?: string }) {
  return (
    <motion.span
      aria-hidden="true"
      className={`block w-px bg-ink ${className}`}
      style={{ transformOrigin: "top" }}
      animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 1] }}
    />
  );
}

/** Re-exported so components can match the measured timings exactly. */
export { DUR, EASE };

/** Concentric circles used for architectural depth without color. */
export function Rings({ size, count, className = "" }: { size: number; count: number; className?: string }) {
  return (
    <div className={`pointer-events-none absolute ${className}`} style={{ width: size, height: size }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ash opacity-50"
          style={{ width: `${(100 / count) * (i + 1)}%`, height: `${(100 / count) * (i + 1)}%` }}
        />
      ))}
    </div>
  );
}
