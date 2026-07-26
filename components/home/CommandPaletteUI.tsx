'use client';

import { useState, useEffect } from 'react';
import { Search, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const placeholders = [
  "Search politicians...",
  "Search promises...",
  "Search schemes...",
  "Search ministries...",
  "Search reports...",
  "Search court orders...",
  "Search gazettes..."
];

export function CommandPaletteUI() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative group w-full">
      <div className="relative flex items-center w-full h-[56px] bg-white/5 border border-white/15 rounded-[var(--radius-soft)] px-4 transition-all duration-150 focus-within:border-white focus-within:ring-[3px] focus-within:ring-white/10">
        <Search className="w-5 h-5 text-[var(--text-tertiary)] mr-3 flex-shrink-0" />
        
        <input 
          type="text"
          className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/40 text-[17px]"
          placeholder={placeholders[index]}
        />

        <div className="flex items-center ml-4">
          <div className="px-2 py-1 rounded bg-white/10 text-[11px] font-mono text-white/60 flex items-center">
            ⌘K
          </div>
        </div>
      </div>
    </div>
  );
}
