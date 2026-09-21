import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { hero, site } from "../content";
import { EASE } from "../lib/motion";
import { SplitText, PulseLine } from "./ui";
import { AnnotatedText } from "./AnnotatedText";

/**
 * Hero: display type over the page-level sphere.
 *
 * The sphere itself is NOT rendered here — it lives in <SphereLayer>, a
 * fixed layer behind the whole document, so it can travel past the hero
 * into the sections below instead of being clipped to this section.
 * This section is transparent for the same reason.
 */
export default function Hero() {
  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 900], [0, 60]);
  const fade = useTransform(scrollY, [0, 500], [1, 0]);

  const [hideScroll, setHideScroll] = useState(false);
  useEffect(() => {
    const onScroll = () => setHideScroll(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="top"
      className="relative z-10 flex min-h-[100svh] items-center pb-[119px] pt-[160px]"
    >
      {/* Concentric ornaments live in <SphereLayer> with the orb, matching
          the reference site where the rings belong to .orb-w, not the hero. */}

      <motion.div style={{ y: textY }} className="shell relative z-10">
        <h1 className="display text-ink flex flex-col items-start">
          <SplitText lines={[hero.lines[0]]} delay={0.15} trigger="load" />
          <AnnotatedText variant="underline" delay={0.8} color="text-purple-500">
            <SplitText lines={[hero.lines[1]]} delay={0.15} trigger="load" />
          </AnnotatedText>
          <SplitText lines={[hero.lines[2]]} delay={0.15} trigger="load" />
          <AnnotatedText variant="wavy" delay={1} color="text-cyan-500">
            <SplitText lines={[hero.lines[3]]} delay={0.15} trigger="load" />
          </AnnotatedText>
        </h1>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.6 }}
          className="mt-[46px] flex flex-wrap items-center gap-x-[32px] gap-y-[15px]"
        >
          <a href={hero.cta.href} className="pill">
            <span>{hero.cta.label}</span>
            <span className="text-[1.15em] leading-none">&rarr;</span>
          </a>
          <a href={`mailto:${site.email}`} className="ghost-link">
            <span className="line">{site.email}</span>
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll cue — the source site's 'pulse' rule: a hairline that scales
          from nothing to full height and back, forever. */}
      <motion.div
        style={{ opacity: fade }}
        animate={{ opacity: hideScroll ? 0 : 1 }}
        className="label absolute bottom-[30px] right-[30px] z-10 hidden flex-col items-center gap-[8px] md:flex"
      >
        <span>Scroll</span>
        <PulseLine className="h-[46px]" />
      </motion.div>
    </section>
  );
}
