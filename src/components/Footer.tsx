import React from 'react';

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border bg-background">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div className="col-span-2 md:col-span-1">
          <div className="text-xl font-bold tracking-tighter text-primary mb-4">
            JC KNOX
          </div>
          <p className="text-sm text-secondary leading-relaxed">
            Building high-performance digital experiences for the next generation of startups.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold text-primary uppercase tracking-widest">Company</h4>
          <ul className="text-sm text-secondary space-y-2">
            <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Press</a></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold text-primary uppercase tracking-widest">Services</h4>
          <ul className="text-sm text-secondary space-y-2">
            <li><a href="#" className="hover:text-primary transition-colors">Landing Pages</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">E-commerce</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Web Apps</a></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold text-primary uppercase tracking-widest">Social</h4>
          <ul className="text-sm text-secondary space-y-2">
            <li><a href="#" className="hover:text-primary transition-colors">X (Twitter)</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">LinkedIn</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">GitHub</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-secondary">
          &copy; {new Date().getFullYear()} JC KNOX. All rights reserved.
        </p>
        <p className="text-xs font-mono text-secondary/50">
          Built by JC KNOX
        </p>
      </div>
    </footer>
  );
}
