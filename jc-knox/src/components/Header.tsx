import React from 'react';

export default function Header() {
  return (
    <header className="glass-header">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="text-xl font-bold tracking-tighter text-primary">
          JC KNOX
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-secondary">
          <a href="#work" className="hover:text-primary transition-colors">Work</a>
          <a href="#process" className="hover:text-primary transition-colors">Process</a>
        </nav>

        <div className="flex items-center">
          <a href="#contact" className="btn-ghost text-sm">
            Start a Project
          </a>
        </div>
      </div>
    </header>
  );
}
