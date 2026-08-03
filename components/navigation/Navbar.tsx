'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/politicians',  label: 'Politicians' },
  { href: '/parties',      label: 'Parties' },
  { href: '/compare',      label: 'Compare' },
  { href: '/archive',      label: 'Archive' },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { 
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false); 
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMenuOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || menuOpen
            ? 'bg-[#0B0E14]/95 backdrop-blur-2xl border-b border-white/[0.06]'
            : 'bg-[#0B0E14] border-b border-transparent'
        }`}
      >
        {/* ── Main bar: 80px tall ── */}
        <div className="w-full px-6 md:px-10 h-[80px] flex items-center justify-between">
          
          {/* ── LEFT SIDE: Logo ── */}
          <Link href="/" className="flex items-center gap-[12px] group" aria-label="Neta Samachar home">
            <div className="w-[42px] h-[42px] rounded-[10px] border-[1.5px] border-[#22C55E] flex items-center justify-center bg-black/20 group-hover:bg-[#22C55E]/10 transition-colors">
              <span className="text-white font-bold text-[22px] leading-none">N</span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-white font-bold text-[15px] leading-[1.1] tracking-wide">NETA</span>
              <span className="text-white font-bold text-[15px] leading-[1.1] tracking-wide">SAMACHAR</span>
            </div>
          </Link>

          {/* ── CENTER: Links ── */}
          <nav
            className="hidden xl:flex items-center h-full gap-[40px]"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map((item) => {
              // Exact match or active subroute
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative h-full flex items-center group"
                >
                  <span className={`font-semibold text-[15px] tracking-wide transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-white/70 group-hover:text-white'
                  }`}>
                    {item.label}
                  </span>
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#22C55E] rounded-t-full"
                      transition={{ type: 'spring', bounce: 0.1, duration: 0.5 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── RIGHT SIDE: Search, Lang, Menu ── */}
          <div className="flex items-center gap-[20px] md:gap-[32px]">
            
            {/* Search Bar */}
            <form 
              onSubmit={handleSearch}
              className="hidden lg:flex items-center w-[320px] xl:w-[420px] h-[52px] bg-white/[0.03] border border-white/20 hover:border-white/30 rounded-full px-6 focus-within:border-white/50 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_24px_rgba(255,255,255,0.05)] transition-all duration-300 group"
            >
              <Search className="w-[20px] h-[20px] text-white/60 group-focus-within:text-white flex-shrink-0 transition-colors duration-300" />
              <input 
                type="search" 
                name="q"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search politicians, parties, issues..."
                className="w-full bg-transparent text-[16px] text-white placeholder-white/50 focus:outline-none ml-4"
              />
            </form>

            {/* Language Toggle */}
            <button className="hidden sm:block text-white/80 hover:text-white font-medium text-[14px] transition-colors whitespace-nowrap">
              EN / हिंदी
            </button>

            {/* Menu Button */}
            <button 
              className="w-[42px] h-[42px] rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors flex-shrink-0"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <X className="w-[20px] h-[20px] text-white" /> : <Menu className="w-[20px] h-[20px] text-white" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Dropdown Menu ── */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="xl:hidden border-t border-white/[0.06] bg-[#0B0E14]/98 backdrop-blur-2xl overflow-hidden"
            >
              <nav className="flex flex-col px-6 py-4">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`py-4 border-b border-white/[0.05] font-semibold text-[16px] ${
                        isActive ? 'text-white' : 'text-white/60'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                
                {/* Mobile Search */}
                <div className="pt-6 pb-2">
                  <form onSubmit={handleSearch} className="relative">
                    <div className="absolute left-[16px] top-1/2 -translate-y-1/2">
                      <Search className="w-[18px] h-[18px] text-white/50" />
                    </div>
                    <input 
                      type="search" 
                      name="q"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="w-full h-[48px] bg-white/5 border border-white/10 rounded-full pl-[48px] pr-[20px] text-white placeholder-white/40 focus:outline-none"
                    />
                  </form>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer */}
      <div style={{ height: '80px' }} />
    </>
  );
}
