'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search } from 'lucide-react';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { SearchBar } from '@/components/shared/SearchBar';

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

  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => { 
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false); 
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || menuOpen
            ? 'bg-[var(--bg-base)]/95 backdrop-blur-2xl border-b border-white/[0.06]'
            : 'bg-[var(--bg-base)] border-b border-transparent'
        }`}
      >
        {/* ── Main bar: 80px tall ── */}
        <div className="w-full max-w-7xl mx-auto px-6 md:px-10 xl:px-16 h-[80px] flex items-center justify-between">
          
          {/* ── LEFT SIDE: Logo ── */}
          <Link href="/" className="flex items-center gap-[12px] group" aria-label="Neta Samachar home">
            <div className="w-[42px] h-[42px] rounded-sm border-[1.5px] border-[#22C55E] flex items-center justify-center bg-black/20 group-hover:bg-[#22C55E]/10 transition-colors">
              <span className="text-white font-bold text-[22px] leading-none">N</span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-white font-bold text-[15px] leading-[1.1] tracking-wide">NETA</span>
              <span className="text-white font-bold text-[15px] leading-[1.1] tracking-wide">SAMACHAR</span>
            </div>
          </Link>

          {/* ── CENTER: Links ── */}
          {/* ml-14 = 56px deliberate gap between logo block and first nav link */}
          <nav
            className="hidden xl:flex items-center h-full gap-[52px] ml-14"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map((item) => {
              // Exact match or active subroute
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative h-full flex items-center group/navlink outline-none"
                >
                  <span className={`font-semibold text-[15px] tracking-wide transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-white/70 group-hover/navlink:text-white group-focus-visible/navlink:text-white'
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

                  {/* Keyboard Focus Indicator (Inactive Links) */}
                  {!isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/20 rounded-t-full opacity-0 group-focus-visible/navlink:opacity-100 transition-opacity duration-200" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── RIGHT SIDE: Search + Menu ── */}
          {/* pl-10 = 40px breathing room between nav links and search bar */}
          <div className="flex items-center gap-[12px] pl-10">
            
            {/* Search Bar — opens command palette */}
            <button
              onClick={() => setCommandOpen(true)}
              className="hidden lg:flex items-center justify-between w-[280px] xl:w-[380px] h-[44px] bg-white/[0.03] border border-white/15 hover:border-white/30 rounded-full px-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 transition-all duration-300 group text-left"
              aria-label="Open command palette"
            >
              <div className="flex items-center gap-3">
                <Search className="w-4 h-4 text-white/50 group-hover:text-white flex-shrink-0 transition-colors duration-300" aria-hidden="true" />
                <span className="text-[13px] text-white/40 group-hover:text-white/60 transition-colors">
                  Search politicians, parties...
                </span>
              </div>
              <div className="px-2 py-0.5 rounded bg-white/[0.07] text-[11px] font-mono text-white/50 flex items-center shrink-0">
                ⌘K
              </div>
            </button>

            {/* Vertical divider — visually separates search from menu button */}
            <div className="hidden lg:block w-px h-5 bg-white/10 mx-2" aria-hidden="true" />

            {/* Menu Button */}
            <button 
              className="w-[40px] h-[40px] rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors flex-shrink-0"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <X className="w-[18px] h-[18px] text-white" /> : <Menu className="w-[18px] h-[18px] text-white" />}
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
              className="xl:hidden border-t border-white/[0.06] bg-[var(--bg-base)]/98 backdrop-blur-2xl overflow-hidden"
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
                  <SearchBar variant="mobile" placeholder="Search..." onSearch={() => setMenuOpen(false)} />
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Command Palette */}
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />

      {/* Spacer */}
      <div style={{ height: '80px' }} />
    </>
  );
}
