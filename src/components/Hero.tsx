"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { CursorDrivenParticleTypography } from '@/components/ui/cursor-driven-particles-typography';
import Typewriter from '@/components/core/Typewriter';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-screen flex items-center justify-center">
      {/* Background Video */}
      <div className="absolute inset-0 -z-20 w-full h-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover opacity-60"
          src="https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/cloudinarry%20to%20cloudflare/202606021731-e_hqa6sn.mp4"
        />
        {/* Minimal Overlay */}
        <div className="absolute inset-0 bg-background/30" />
      </div>

      {/* Subtle Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-accent/10 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* Particle Typography Section */}
        <div className="h-[200px] md:h-[300px] w-full mb-8 relative">
          <CursorDrivenParticleTypography
            text="JC KNOX"
            fontSize={120}
            particleDensity={8}
            dispersionStrength={20}
            returnSpeed={0.05}
            color="#FFFFFF"
          />
        </div>

        {/* Typewriter Effect for Main Headline on two lines */}
        <div className="flex flex-col justify-center mb-12 items-center gap-2">
          <Typewriter
            text="Websites that work"
            className="text-5xl md:text-7xl font-bold tracking-tight text-primary leading-[1.1]"
            speed={60}
            delay={300}
          />
          <Typewriter
            text="as hard as you do."
            className="text-5xl md:text-7xl font-bold tracking-tight text-secondary leading-[1.1]"
            speed={60}
            delay={1000}
          />
        </div>

        {/* Reverted to high-readability text with subtle animation */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="max-w-2xl mx-auto text-lg text-secondary mb-10 leading-relaxed"
        >
          We build fast, professional sites for startups who value precision over fluff.
          No bloated plugins. Just clean code that converts.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#contact" className="btn-primary w-full sm:w-auto text-lg">
            Start a Project
          </a>
          <a href="#work" className="flex items-center gap-2 text-secondary hover:text-primary transition-colors font-medium group">
            View Work
            <span className="group-hover:translate-x-1 transition-transition transition-transform">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
