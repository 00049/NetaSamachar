'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

interface SearchBarProps {
  placeholder?: string;
  variant?: 'hero' | 'mobile';
  className?: string;
  onSearch?: () => void;
}

export function SearchBar({ placeholder = 'Search...', variant = 'hero', className, onSearch }: SearchBarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      onSearch?.();
    }
  };

  if (variant === 'hero') {
    return (
      <form 
        onSubmit={handleSearch}
        className={clsx(
          "relative flex items-center w-full h-[88px] bg-[var(--color-panel)]/80 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-full px-8 focus-within:border-[#e6b16a]/50 focus-within:bg-[var(--color-panel)] transition-all duration-300 shadow-2xl",
          className
        )}
      >
        <Search className="w-[28px] h-[28px] text-white/40 flex-shrink-0 ml-2" aria-hidden="true" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-full bg-transparent text-[22px] text-white placeholder-white/40 focus:outline-none ml-6"
        />
        <button type="submit" aria-label="Search" className="w-[64px] h-[64px] rounded-full bg-[#e6b16a] flex items-center justify-center hover:bg-[#e6b16a]/90 transition-colors flex-shrink-0 text-black ml-4 group shadow-lg">
          <ArrowRight className="w-[28px] h-[28px] group-hover:translate-x-1.5 transition-transform" />
        </button>
      </form>
    );
  }

  if (variant === 'mobile') {
    return (
      <form onSubmit={handleSearch} className={clsx("relative", className)}>
        <div className="absolute left-[16px] top-1/2 -translate-y-1/2">
          <Search className="w-[18px] h-[18px] text-white/50" />
        </div>
        <input 
          type="search" 
          name="q"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full h-[48px] bg-white/5 border border-white/10 rounded-full pl-[48px] pr-[20px] text-white placeholder-white/40 focus:outline-none"
        />
      </form>
    );
  }

  return null;
}
