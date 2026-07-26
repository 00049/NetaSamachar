'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { LiveIndicator } from '@/components/ui/LiveIndicator';

const NAV_ITEMS = [
  { href: '/politicians',  label: 'Politicians' },
  { href: '/promises',     label: 'Investigations' },
  { href: '/compare',      label: 'Compare' },
  { href: '/archive',      label: 'Archive' },
  { href: '/search',       label: 'Search' },
  { href: '/about',        label: 'About' },
];

export function Navbar() {
  const pathname  = usePathname();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#090B12]/95 backdrop-blur-2xl border-b border-white/[0.06]'
            : 'bg-transparent'
        }`}
      >
        {/* ── Main bar: 80px tall ── */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 xl:px-20">
          <div className="flex items-center justify-between" style={{ height: '80px' }}>

            {/* ── Logo ── */}
            <Link href="/" className="group flex-shrink-0 flex flex-col" aria-label="Neta Samachar home">
              <div className="text-white text-[18px] font-bold tracking-[0.02em] leading-none group-hover:opacity-80 transition-opacity">
                NETA SAMACHAR
              </div>
              <div className="text-[#71717A] text-[10px] uppercase tracking-[0.14em] mt-1.5 leading-none">
                Political Accountability
              </div>
            </Link>

            {/* ── Desktop Nav — centered ── */}
            <nav
              className="hidden md:flex items-center"
              style={{ gap: '40px' }}
              aria-label="Main navigation"
            >
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative py-2"
                    style={{
                      fontSize: '12px',
                      fontWeight: isActive ? 500 : 400,
                      letterSpacing: '0.01em',
                      color: isActive ? '#F4F5F7' : 'rgba(244,245,247,0.5)',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={e => { if (!isActive) (e.target as HTMLElement).style.color = 'rgba(244,245,247,0.85)'; }}
                    onMouseLeave={e => { if (!isActive) (e.target as HTMLElement).style.color = 'rgba(244,245,247,0.5)'; }}
                  >
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full"
                        style={{ background: '#F4F5F7' }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* ── Right side ── */}
            <div className="hidden md:flex items-center" style={{ gap: '24px' }}>
              {/* Live indicator */}
              <LiveIndicator label="Live Data" />

              {/* CTA */}
              <Link
                href="/promises"
                className="flex items-center justify-center font-bold uppercase text-[#090B12] bg-white hover:bg-white/90 transition-colors duration-200"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.06em',
                  padding: '10px 20px',
                  borderRadius: 0,
                }}
              >
                Search Database
              </Link>
            </div>

            {/* ── Mobile toggle ── */}
            <button
              className="md:hidden flex items-center justify-center text-white/60 hover:text-white transition-colors"
              style={{ width: 40, height: 40 }}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="md:hidden border-t bg-[#090B12]/98 backdrop-blur-2xl"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <nav className="max-w-7xl mx-auto px-8 py-6 flex flex-col" style={{ gap: '2px' }}>
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="py-3.5 border-b"
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        letterSpacing: '0.01em',
                        color: isActive ? '#F4F5F7' : 'rgba(244,245,247,0.45)',
                        borderColor: 'rgba(255,255,255,0.05)',
                      }}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <div className="pt-4">
                  <Link
                    href="/promises"
                    className="block text-center font-bold uppercase bg-white text-[#090B12]"
                    style={{ fontSize: '11px', letterSpacing: '0.06em', padding: '12px 0' }}
                  >
                    Search Database
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer so content starts below the 80px navbar */}
      <div style={{ height: '80px' }} />
    </>
  );
}
