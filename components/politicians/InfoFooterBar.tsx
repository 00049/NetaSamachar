'use client';

import { Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function InfoFooterBar() {
  const lastUpdated = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="w-full border-b border-white/5 bg-[var(--color-panel)] py-[16px] px-[40px]">
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-[16px] apple-meta">
        
        <div className="flex flex-col sm:flex-row items-center gap-[24px]">
          <div className="flex items-center gap-[8px] text-[var(--color-text-secondary)]">
            <Clock className="w-[16px] h-[16px]" />
            <span>Last Updated: {lastUpdated}</span>
          </div>
          
          <div className="hidden sm:block text-[var(--color-border-strong)]">|</div>
          
          <div className="text-[var(--color-text-tertiary)]">
            Data Sources: ECI, Parliament, Govt. Websites, Court Records, Affidavits
          </div>
        </div>

        <div className="flex items-center gap-[24px]">
          <div className="flex items-center gap-[8px] text-[var(--color-text-secondary)]">
            <ShieldCheck className="w-[16px] h-[16px] text-[var(--color-accent-positive)]" />
            <span>Our data is verified and updated regularly</span>
          </div>
          
          <Link href="/about" className="flex items-center gap-[4px] text-[var(--color-text-secondary)] hover:text-white transition-all duration-[220ms] group">
            Learn More <ChevronRight className="w-[12px] h-[12px] group-hover:translate-x-[4px] transition-transform duration-[220ms] ease-[cubic-bezier(.22,1,.36,1)]" />
          </Link>
        </div>

      </div>
    </div>
  );
}
