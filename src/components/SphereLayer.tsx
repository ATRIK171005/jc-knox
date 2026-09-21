import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Sphere from "./Sphere";

/**
 * Page-level orb layer.
 *
 * Mechanism is the reference site's `.orb-w`: a FIXED layer sitting behind
 * all content (every section is transparent), so the orb stays on screen and
 * carries through the whole document instead of being clipped to the hero.
 *
 * Deviation from the reference, on request: the orb is anchored to the RIGHT
 * of the viewport rather than dead centre, it opens at full size instead of
 * inflating from a 70px dot, and it never collapses — it holds its size for
 * the whole page, breathing slightly as you scroll.
 */
export default function SphereLayer() {
  const { scrollYProgress } = useScroll();

  // Spring-smooth so the scaling glides rather than tracking wheel ticks.
  const p = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 22,
    restDelta: 0.0005,
  });

  const STOPS = [0, 0.25, 0.6, 1];

  // Opens large and stays large — a gentle swell, never a collapse.
  const size = useTransform(p, STOPS, [0.92, 1.08, 1.0, 1.04]);
  const sizeCss = useTransform(size, (v) => `${(v * 100).toFixed(2)}vmin`);

  // Dashed outlines track just outside the orb, as on the source.
  const ring1 = useTransform(p, STOPS, [1.08, 1.26, 1.18, 1.22]);
  const ring1Css = useTransform(ring1, (v) => `${(v * 100).toFixed(2)}vmin`);
  const ring2 = useTransform(p, STOPS, [1.3, 1.52, 1.42, 1.47]);
  const ring2Css = useTransform(ring2, (v) => `${(v * 100).toFixed(2)}vmin`);
  const ringFade = useTransform(p, [0, 0.04], [0.9, 1]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Right-anchored focal point: the orb and its rings share this centre.
          On narrow screens it pulls in so the orb stays on screen. */}
      <div className="absolute right-[4%] top-1/2 md:right-[12%]">
        <motion.div
          style={{ width: ring2Css, height: ring2Css, opacity: ringFade }}
          className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-ash"
        />
        <motion.div
          style={{ width: ring1Css, height: ring1Css, opacity: ringFade }}
          className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-ash"
        />
        <motion.div
          style={{ width: sizeCss, height: sizeCss }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.165, 0.84, 0.44, 1] }}
          className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 mix-blend-multiply"
        >
          <Sphere className="h-full w-full" />
        </motion.div>
      </div>
    </div>
  );
}
