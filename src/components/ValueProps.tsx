"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, Blocks } from 'lucide-react';

const features = [
  {
    title: "Built for Speed",
    description: "Lighthouse 100s aren't a goal; they're our standard. We strip the bloat so your users never wait.",
    icon: <Zap className="w-8 h-8 text-primary" />,
  },
  {
    title: "Design that Converts",
    description: "We don't just make it look good; we make it sell. Every pixel is placed with user psychology in mind.",
    icon: <Target className="w-8 h-8 text-primary" />,
  },
  {
    title: "Clean Architecture",
    description: "Scale without fear. We use a modern stack (Next.js 15) that ensures your site grows with your business.",
    icon: <Blocks className="w-8 h-8 text-primary" />,
  }
];

export default function ValueProps() {
  return (
    <section id="process" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bento-card p-8 rounded-2xl flex flex-col gap-4"
            >
              <div className="p-3 bg-primary/10 w-fit rounded-xl">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
                <p className="text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
