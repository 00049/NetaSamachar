import Link from 'next/link';
import { NewsletterForm } from '@/components/home/NewsletterForm';

export function GlobalFooter() {
  return (
    <footer className="bg-[var(--color-panel)] border-t border-white/5 pt-8 pb-12">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-10 xl:px-16">
        
        <NewsletterForm />

        {/* TOP SECTION: 5 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24 mb-8">
          
          {/* COLUMN 1: BRANDING (Span 4) */}
          <div className="lg:col-span-4 lg:pr-8">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl border border-[#e6b16a]/50 flex items-center justify-center bg-transparent">
                <span className="text-white font-bold text-2xl tracking-tighter">N</span>
              </div>
              <div>
                <div className="text-white font-bold text-lg leading-tight tracking-[0.15em]">NETA</div>
                <div className="text-white font-bold text-lg leading-tight tracking-[0.15em]">SAMACHAR</div>
              </div>
            </div>
            <div className="text-[#e6b16a] text-xs font-semibold tracking-widest mb-6 uppercase">
              Political Intelligence Platform
            </div>
            
            <p className="text-white/60 text-sm leading-relaxed max-w-[340px]">
              Independent, non-partisan platform for political transparency and accountability. All data sourced from official and public records.
            </p>
          </div>

          {/* COLUMNS 2, 3, 4: LINKS (Span 8) */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12 xl:gap-16">
            {/* PLATFORM */}
            <div>
              <h4 className="text-white/40 font-semibold text-xs tracking-widest mb-6 uppercase">Platform</h4>
              <ul className="flex flex-col gap-4">
                {[
                  { label: 'Politicians', href: '/politicians' },
                  { label: 'Parties', href: '/parties' },
                  { label: 'Compare', href: '/compare' },
                  { label: 'Archive', href: '/archive' },
                  { label: 'Methodology', href: '/methodology' },
                ].map(link => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-white/70 hover:text-white transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* RESOURCES */}
            <div>
              <h4 className="text-white/40 font-semibold text-xs tracking-widest mb-6 uppercase">Resources</h4>
              <ul className="flex flex-col gap-4">
                {[
                  { label: 'Evidence Archive', href: '/archive' },
                  { label: 'Search', href: '/search' },
                ].map(link => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-white/70 hover:text-white transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* COMPANY */}
            <div>
              <h4 className="text-white/40 font-semibold text-xs tracking-widest mb-6 uppercase">Company</h4>
              <ul className="flex flex-col gap-4">
                {[
                  { label: 'About Us', href: '/about' },
                ].map(link => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-white/70 hover:text-white transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* MIDDLE SECTION: Data Sourced string */}
        <div className="border-t border-white/5 py-8 text-center text-white/50 text-[14px] sm:text-[15px]">
          Data sourced from official public records
        </div>

        {/* BOTTOM SECTION: Copyright & Legal */}
        <div className="border-t border-white/5 pt-8 flex flex-col xl:flex-row items-center justify-between gap-8 text-white/50 text-[14px] sm:text-[15px]">
          
          <div>
            © 2026 Neta Samachar. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link href="/open-data" className="hover:text-white transition-colors">Open Data</Link>
          </div>

          <div className="flex items-center gap-2">
            Made with 
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="#e6b16a" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="mx-1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            for India
          </div>

          <div className="flex items-center gap-4">
            <Link href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors" aria-label="X / Twitter">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
            </Link>
            <Link href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors" aria-label="YouTube">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </Link>
          </div>

        </div>

      </div>
    </footer>
  );
}
