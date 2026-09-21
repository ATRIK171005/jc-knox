import { motion } from "framer-motion";

const LOGOS = [
  'https://reverseui.com/images/logo-carousel/canva.svg', 
  'https://reverseui.com/images/logo-carousel/canopy.svg', 
  'https://reverseui.com/images/logo-carousel/clearbit.svg',
  'https://reverseui.com/images/logo-carousel/descript.svg', 
  'https://reverseui.com/images/logo-carousel/duolingo.svg', 
  'https://reverseui.com/images/logo-carousel/khanacademy.svg',
  'https://reverseui.com/images/logo-carousel/quizlet.svg', 
  'https://reverseui.com/images/logo-carousel/ramp.svg', 
  'https://reverseui.com/images/logo-carousel/strava.svg'
];

export default function LogoCarousel() {
  return (
    <section className="py-24 border-t border-ink/10 relative z-10 overflow-hidden bg-parchment">
      <div className="shell mb-12">
        <h2 className="text-body-sm uppercase tracking-[0.05em] text-ink/50 text-center">
          Trusted by incredible teams
        </h2>
      </div>

      <div 
        className="w-full flex overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)"
        }}
      >
        <motion.div
          className="flex w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 30,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          <div className="flex items-center gap-24 px-12">
            {LOGOS.map((logo, i) => (
              <img 
                key={`first-${i}`} 
                src={logo} 
                alt="Partner logo" 
                className="h-8 md:h-10 w-auto opacity-50 dark:invert grayscale contrast-200" 
              />
            ))}
          </div>
          <div className="flex items-center gap-24 px-12">
            {LOGOS.map((logo, i) => (
              <img 
                key={`second-${i}`} 
                src={logo} 
                alt="Partner logo" 
                className="h-8 md:h-10 w-auto opacity-50 dark:invert grayscale contrast-200" 
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
