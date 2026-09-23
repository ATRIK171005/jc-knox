import { motion, useScroll, useTransform } from "framer-motion";
import { hero, site } from "../content";
import { EASE } from "../lib/motion";
import { SplitText } from "./ui";
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

  return (
    <section
      id="top"
      className="relative z-10 flex min-h-[70svh] items-center pb-[100px] md:pb-[120px] pt-[100px]"
    >
      {/* Concentric ornaments live in <SphereLayer> with the orb, matching
          the reference site where the rings belong to .orb-w, not the hero. */}

      <motion.div style={{ y: textY }} className="shell relative z-10">
        
        <h1 className="display text-ink flex flex-col items-start w-full gap-0 md:gap-2 lg:gap-4 pl-4 md:pl-16 lg:pl-32">
          <div>
            <SplitText lines={[hero.lines[0]]} delay={3.4} trigger="load" />
          </div>
          <div>
            <SplitText lines={[hero.lines[1]]} delay={3.55} trigger="load" />
          </div>
          <div>
            <SplitText lines={[hero.lines[2]]} delay={3.7} trigger="load" />
          </div>
          <div>
            <AnnotatedText variant="wavy" delay={4.5} color="text-cyan-500">
              <SplitText lines={[hero.lines[3]]} delay={3.85} trigger="load" />
            </AnnotatedText>
          </div>
        </h1>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 4.3 }}
          className="mt-[100px] md:mt-[120px] flex flex-wrap items-center gap-x-[32px] gap-y-[15px] pl-4 md:pl-16 lg:pl-32"
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




    </section>
  );
}
