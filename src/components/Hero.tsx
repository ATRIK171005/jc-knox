"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { CursorDrivenParticleTypography } from '@/components/ui/cursor-driven-particles-typography';
import Typewriter from '@/components/core/Typewriter';
import { MagneticButton } from '@/components/lightswind/magnetic-button';

export default function Hero() {
  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-black">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-60"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260624_210218_173f8eba-17ff-4e27-972b-d128af25bf49.mp4"
      />

      <div className="relative z-10 max-w-7xl mx-auto text-center px-6">
        {/* Particle Typography Section */}
        <div className="h-[200px] md:h-[300px] w-full mb-8 relative">
          <CursorDrivenParticleTypography
            text="JC KNOX"
            fontSize={140}
            particleSize={3}
            particleDensity={5}
            dispersionStrength={25}
            returnSpeed={0.12}
            color="#FFFFFF"
          />
        </div>

        {/* Typewriter Effect for Main Headline on two lines */}
        <div className="flex flex-col justify-center mb-12 items-center gap-2">
          <Typewriter
            text="Websites that work"
            className="text-5xl md:text-7xl font-bold tracking-tight text-primary leading-[1.1] drop-shadow-lg"
            speed={60}
            delay={300}
          />
          <Typewriter
            text="as hard as you do."
            className="text-5xl md:text-7xl font-bold tracking-tight text-secondary leading-[1.1] drop-shadow-lg"
            speed={60}
            delay={1000}
          />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="max-w-2xl mx-auto text-lg text-secondary mb-10 leading-relaxed drop-shadow-md"
        >
          We build fast, professional sites for startups who value precision over fluff.
          No bloated plugins. Just clean code that converts.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-8"
        >
          <MagneticButton
            variant="primary"
            size="lg"
            className="shadow-xl"
            onClick={() => window.location.href = '#contact'}
          >
            Start a Project
          </MagneticButton>

          <MagneticButton
            variant="outline"
            size="lg"
            className="shadow-xl"
            onClick={() => window.location.href = '#work'}
          >
            View Work
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
