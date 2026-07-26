import type { Metadata } from 'next';
import { Inter, IBM_Plex_Sans } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navigation/Navbar';
import { LiveIndicator } from '@/components/ui/LiveIndicator';
import { NewsletterForm } from '@/components/home/NewsletterForm';
import Link from 'next/link';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const ibmPlex = IBM_Plex_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: 'Neta Samachar | Evidence-Based Political Accountability',
    template: '%s | Neta Samachar',
  },
  description: 'India\'s most comprehensive, evidence-driven political accountability platform. Track politician promises, legislative records, criminal cases, and financial disclosures — all backed by primary source documentation.',
  keywords: ['political accountability', 'India politicians', 'promise tracker', 'political transparency', 'election promises', 'RTI', 'legislative tracking'],
  openGraph: {
    title: 'Neta Samachar — Political Accountability',
    description: 'Track every promise. Verify every claim. Hold power accountable.',
    type: 'website',
  },
};

const FOOTER_LINKS = [
  { href: '/politicians', label: 'Politicians' },
  { href: '/promises',    label: 'Investigations' },
  { href: '/archive',     label: 'Evidence Archive' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/search',      label: 'Database Search' },
  { href: '/about',       label: 'About' },
  { href: '/weekly-brief',label: 'Weekly Brief' },
  { href: '/api',         label: 'API' },
];

const PRINCIPLES = [
  'Non-partisan neutrality',
  'Primary source dependency',
  'Open methodology',
  'Immutable version history',
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${ibmPlex.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-svh antialiased">
        <Navbar />

        {/* Page content — Navbar component renders its own height spacer */}
        <main>
          {children}
        </main>

        {/* ── Footer ── */}
        <footer className="border-t border-[var(--border-subtle)] mt-40">
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 xl:px-20 pt-[64px] pb-[64px]">
            <NewsletterForm />
            
            {/* Top row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24 mb-[64px]">

              {/* Brand column */}
              <div className="md:col-span-4">
                <LiveIndicator label="Primary Source Mandate Active" className="mb-[40px]" />
                <div className="mb-6">
                  <div
                    className="font-serif font-black text-[var(--text-primary)] tracking-tight mb-1"
                    style={{ fontSize: '17px', letterSpacing: '-0.02em' }}
                  >
                    NETA SAMACHAR
                  </div>
                  <div
                    className="text-[var(--text-tertiary)] font-bold uppercase"
                    style={{ fontSize: '9px', letterSpacing: '0.14em' }}
                  >
                    Political Accountability Archive
                  </div>
                </div>
                <p className="text-[var(--text-tertiary)] text-sm leading-relaxed max-w-xs">
                  An independent, non-partisan civic technology platform committed to
                  political transparency through verifiable, primary-source evidence.
                </p>
              </div>

              {/* Directory */}
              <div className="md:col-span-4">
                <h4
                  className="text-[var(--text-tertiary)] font-bold uppercase mb-6"
                  style={{ fontSize: '11px', letterSpacing: '0.12em' }}
                >
                  Platform
                </h4>
                <ul className="space-y-4">
                  {FOOTER_LINKS.map(item => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-[var(--text-secondary)] text-base hover:text-[var(--text-primary)] transition-colors duration-200 hover-underline"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Principles */}
              <div className="md:col-span-4">
                <h4
                  className="text-[var(--text-tertiary)] font-bold uppercase mb-6"
                  style={{ fontSize: '11px', letterSpacing: '0.12em' }}
                >
                  Operating Principles
                </h4>
                <ul className="space-y-4">
                  {PRINCIPLES.map((p, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span
                        className="font-mono text-[var(--text-tertiary)] flex-shrink-0 mt-1"
                        style={{ fontSize: '11px' }}
                      >
                        0{i + 1}
                      </span>
                      <span className="text-[var(--text-secondary)] text-base leading-relaxed">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-start sm:items-center gap-[8px] justify-start">
              <p className="text-[#71717A] text-xs">
                © 2026 Neta Samachar. Data sourced from the Election Commission of India, Parliament Archives, and Official Gazettes.
              </p>
              <div className="flex items-center gap-[8px] sm:ml-auto md:ml-0 mt-4 sm:mt-0">
                <span className="px-[10px] py-[4px] bg-white/[0.06] rounded-[4px] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#D4D4D8]">
                  GODL Framework
                </span>
                <span className="px-[10px] py-[4px] bg-white/[0.06] rounded-[4px] text-[11px] font-semibold uppercase tracking-[0.04em] text-[#D4D4D8]">
                  BSA 2023 Compliant
                </span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
