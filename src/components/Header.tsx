import React from 'react';

export default function Header() {
  return (
    <header className="fixed top-8 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className="flex items-center gap-3 p-2 rounded-2xl bg-white/5 backdrop-blur-xl pointer-events-auto">
        <a
          href="#work"
          className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-white/10 hover:bg-white/20 transition-all duration-300 active:scale-95"
        >
          Work
        </a>
        <a
          href="#process"
          className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-white/10 hover:bg-white/20 transition-all duration-300 active:scale-95"
        >
          Process
        </a>
      </div>
    </header>
  );
}
