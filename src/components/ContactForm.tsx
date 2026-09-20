"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCircle2 } from 'lucide-react';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStatus('success');
  };

  const features = [
    "Fixed-price quotes",
    "Strict deadlines",
    "No agency fluff"
  ];

  return (
    <section id="contact" className="py-20 px-6 bg-surface/30 border-t border-border">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
            Ready to build <br /> something real?
          </h2>
          <p className="text-lg text-secondary mb-8 leading-relaxed">
            Tell us about your project. We&apos;ll review your requirements
            and get back to you within 24 hours with a clear plan and quote.
          </p>
          <div className="flex flex-col gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-secondary">
                <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 font-bold" />
                </span>
                {feature}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 rounded-2xl bg-surface border border-border text-center flex flex-col items-center justify-center"
            >
              <div className="mb-6 text-green-500">
                <CheckCircle2 className="w-16 h-16" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">Message Sent</h3>
              <p className="text-secondary">We&apos;ll be in touch shortly.</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-8 text-accent hover:underline text-sm font-medium"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-surface border border-border space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-medium text-secondary uppercase tracking-wider">Name</label>
                  <input
                    id="name"
                    required
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-primary focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-medium text-secondary uppercase tracking-wider">Email</label>
                  <input
                    id="email"
                    required
                    type="email"
                    placeholder="john@example.com"
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-primary focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-xs font-medium text-secondary uppercase tracking-wider">Project Description</label>
                <textarea
                  id="description"
                  required
                  rows={4}
                  placeholder="Tell us about your vision..."
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-primary focus:outline-none focus:border-accent transition-colors resize-none"
                />
              </div>
              <button
                disabled={status === 'sending'}
                className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? 'Sending...' : 'Send Request'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
