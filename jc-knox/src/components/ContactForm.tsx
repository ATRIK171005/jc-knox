"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStatus('success');
  };

  return (
    <section id="contact" className="py-20 px-6 bg-surface/30 border-t border-border">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="text-left">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
            Ready to build <br /> something real?
          </h2>
          <p className="text-lg text-secondary mb-8 leading-relaxed">
            Tell us about your project. We'll review your requirements
            and get back to you within 24 hours with a clear plan and quote.
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-secondary">
              <span className="w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">✓</span>
              Fixed-price quotes
            </div>
            <div className="flex items-center gap-3 text-secondary">
              <span className="w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">✓</span>
              Strict deadlines
            </div>
            <div className="flex items-center gap-3 text-secondary">
              <span className="w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">✓</span>
              No agency fluff
            </div>
          </div>
        </div>

        <div className="relative">
          {status === 'success' ? (
            <div className="p-12 rounded-2xl bg-surface border border-border text-center">
              <div className="text-5xl mb-4">✉️</div>
              <h3 className="text-2xl font-bold text-primary mb-2">Message Sent</h3>
              <p className="text-secondary">We'll be in touch shortly.</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-6 text-accent hover:underline text-sm"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-surface border border-border space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-secondary uppercase tracking-wider">Name</label>
                  <input
                    required
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-primary focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-secondary uppercase tracking-wider">Email</label>
                  <input
                    required
                    type="email"
                    placeholder="john@example.com"
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-primary focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-secondary uppercase tracking-wider">Project Description</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us about your vision..."
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-primary focus:outline-none focus:border-accent transition-colors resize-none"
                />
              </div>
              <button
                disabled={status === 'sending'}
                className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center gap-2"
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
