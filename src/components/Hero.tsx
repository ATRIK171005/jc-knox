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
      className="relative z-10 flex min-h-[100svh] items-center pb-[200px] md:pb-[250px] pt-[120px]"
    >
      {/* Concentric ornaments live in <SphereLayer> with the orb, matching
          the reference site where the rings belong to .orb-w, not the hero. */}

      <motion.div style={{ y: textY }} className="shell relative z-10">
        <h1 className="display text-ink flex flex-col w-full gap-6 md:gap-10 lg:gap-16">
          <div className="self-start pl-4 md:pl-16 lg:pl-32">
            <SplitText lines={[hero.lines[0]]} delay={3.4} trigger="load" />
          </div>
          <div className="self-start pl-[15%] md:pl-[30%] lg:pl-[40%] mt-[-10px] md:mt-[-20px]">
            <SplitText lines={[hero.lines[1]]} delay={3.55} trigger="load" />
          </div>
          <div className="self-start pl-8 md:pl-[20%] lg:pl-[35%]">
            <SplitText lines={[hero.lines[2]]} delay={3.7} trigger="load" />
          </div>
          <div className="self-end pr-8 md:pr-12 lg:pr-24">
            <AnnotatedText variant="wavy" delay={4.2} color="text-cyan-500">
              <SplitText lines={[hero.lines[3]]} delay={3.85} trigger="load" />
            </AnnotatedText>
          </div>
        </h1>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 4.3 }}
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
