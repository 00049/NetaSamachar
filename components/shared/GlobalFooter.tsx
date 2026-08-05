import Link from 'next/link';
import { ExternalLink, Mail } from 'lucide-react';

export function GlobalFooter() {
  return (
    <footer className="bg-[#11131A] border-t border-white/5 mt-32 pt-24 pb-16">
      <div className="max-w-[1440px] mx-auto px-8 md:px-12 xl:px-24">
        
        {/* TOP SECTION: 5 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24 mb-24">
          
          {/* COLUMN 1: BRANDING & SOCIAL (Span 4) */}
          <div className="lg:col-span-5 lg:pr-12">
            <div className="flex items-center gap-5 mb-5">
              <div className="w-14 h-14 rounded-2xl border border-[#e6b16a]/50 flex items-center justify-center bg-transparent">
                <span className="text-white font-bold text-3xl tracking-tighter">N</span>
              </div>
              <div>
                <div className="text-white font-bold text-xl leading-tight tracking-[0.2em]">NETA</div>
                <div className="text-white font-bold text-xl leading-tight tracking-[0.2em]">SAMACHAR</div>
              </div>
            </div>
            <div className="text-[#e6b16a] text-[11px] font-bold tracking-[0.2em] mb-8 uppercase">
              Political Intelligence Platform
            </div>
            
            <p className="text-white/60 text-[15px] sm:text-[16px] leading-[1.8] mb-10 max-w-[340px]">
              Independent, non-partisan platform for political transparency and accountability. All data sourced from official and public records.
            </p>

            <div className="flex items-center gap-5">
              <Link href="#" className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.04] transition-all duration-300">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </Link>
              <Link href="#" className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.04] transition-all duration-300">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </Link>
              <Link href="#" className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.04] transition-all duration-300">
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* COLUMNS 2, 3, 4: LINKS (Span 7) */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10">
            {/* PLATFORM */}
            <div>
              <h4 className="text-white/40 font-bold text-[12px] tracking-[0.15em] mb-8 uppercase">Platform</h4>
              <ul className="flex flex-col gap-5">
                {['Politicians', 'Parties', 'Compare', 'Archive', 'Methodology'].map(link => (
                  <li key={link}>
                    <Link href="#" className="text-white/80 hover:text-[#e6b16a] text-[15px] sm:text-[16px] transition-colors">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* RESOURCES */}
            <div>
              <h4 className="text-white/40 font-bold text-[12px] tracking-[0.15em] mb-8 uppercase">Resources</h4>
              <ul className="flex flex-col gap-5">
                {['Evidence Archive', 'Data Sources', 'API', 'Open Methodology'].map(link => (
                  <li key={link}>
                    <Link href="#" className="text-white/80 hover:text-[#e6b16a] text-[15px] sm:text-[16px] transition-colors">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* COMPANY */}
            <div>
              <h4 className="text-white/40 font-bold text-[12px] tracking-[0.15em] mb-8 uppercase">Company</h4>
              <ul className="flex flex-col gap-5">
                {['About Us', 'Contact', 'Report an Issue', 'Careers'].map(link => (
                  <li key={link}>
                    <Link href="#" className="text-white/80 hover:text-[#e6b16a] text-[15px] sm:text-[16px] transition-colors">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* MIDDLE SECTION: Data Sourced string */}
        <div className="border-t border-white/5 pt-12 pb-12 text-center text-white/50 text-[14px] sm:text-[15px]">
          Data sourced from official public records 
          <span className="text-[#e6b16a]/50 mx-4 text-xl leading-none align-middle">•</span>
          Last updated: 8/3/2026
          <span className="text-[#e6b16a]/50 mx-4 text-xl leading-none align-middle">•</span>
          Next update: in ~14 hours
        </div>

        {/* BOTTOM SECTION: Copyright & Legal */}
        <div className="border-t border-white/5 pt-10 flex flex-col xl:flex-row items-center justify-between gap-8 text-white/50 text-[14px] sm:text-[15px]">
          
          <div>
            © 2026 Neta Samachar. All rights reserved.
          </div>
          
          <div className="flex flex-wrap items-center justify-center">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="text-[#e6b16a]/50 mx-4 text-xl leading-none align-middle">•</span>
            <Link href="#" className="hover:text-white transition-colors">Terms of Use</Link>
            <span className="text-[#e6b16a]/50 mx-4 text-xl leading-none align-middle">•</span>
            <Link href="#" className="hover:text-white transition-colors">Open Data Policy</Link>
          </div>

          <div className="flex items-center gap-2">
            Made with 
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="#e6b16a" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="mx-1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            for India
          </div>

        </div>

      </div>
    </footer>
  );
}
