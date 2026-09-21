import type { Variants } from "framer-motion";

/**
 * Motion spec lifted from itsoffbrand.com (measured in-browser, not guessed):
 *
 *   - Lenis smooth scroll on <html> (the site sets class "lenis" on the root)
 *   - Text split into .word / .char, each translated on Y from ~-109px to 0,
 *     staggered per unit so headings assemble letter-by-letter on scroll
 *   - .btn-txt              transform 1.2s cubic-bezier(0.165, 0.84, 0.44, 1)
 *   - .link-track-fill      transform 0.6s ease   (66 instances)
 *   - .hud-menu-line        transform 0.4s cubic-bezier(0.68,-0.55,0.265,1.55)
 *   - @keyframes pulse      scale3d(1,0,1) -> scale3d(1,1,1) -> scale3d(1,0,1)
 *   - @keyframes spin       rotate(0) -> rotate(360deg)
 *   - cursor-w opacity 0.2s ease / cursor-dot scale 0.3s ease
 */

/** The house curve — easeOutQuart, exactly as measured on the source site. */
export const EASE = [0.165, 0.84, 0.44, 1] as const;

/** Back-ease used only on the menu burger lines. */
export const EASE_BACK = [0.68, -0.55, 0.265, 1.55] as const;

/** Durations, in seconds, matching the measured transitions. */
export const DUR = {
  track: 0.6,
  text: 1.2,
  menu: 0.4,
} as const;

/**
 * Scroll reveal. The delay rides on `custom` so the variant keeps its own
 * duration/easing — passing a `transition` prop instead REPLACES the
 * variant's transition and silently kills the animation.
 */
export const riseVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DUR.text, ease: EASE, delay },
  }),
};

/**
 * Masked unit reveal — a word or line slides up out of a clipped band.
 * The source translates by ~109px on a 103px display line, i.e. slightly
 * more than one line-box, so the glyph clears the mask completely.
 */
export const unitVariants: Variants = {
  hidden: { y: "108%" },
  show: (delay: number = 0) => ({
    y: 0,
    transition: { duration: DUR.text, ease: EASE, delay },
  }),
};

/** Hairline rules that draw themselves left-to-right. */
export const ruleVariants: Variants = {
  hidden: { scaleX: 0 },
  show: (delay: number = 0) => ({
    scaleX: 1,
    transition: { duration: DUR.text, ease: EASE, delay },
  }),
};

/** Shared viewport config — fire once, slightly before the element lands. */
export const VIEWPORT = { once: true, margin: "-60px" } as const;
