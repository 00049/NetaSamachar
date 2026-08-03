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
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="https://fonts.gstatic.com/s/ibmplexsans/v19/zYX9KVElMYYaJe8bpLHnCwDKjQ76AI9sdP3pBms.woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-svh antialiased">
        <Navbar />

        <main>
          {children}
        </main>

        {/* ── Footer ── */}
        <footer className="border-t border-white/5 mt-32">
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 xl:px-20 py-24">
            <NewsletterForm />
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24 mb-24">
              <div className="md:col-span-4">
                <LiveIndicator label="Primary Source Mandate Active" className="mb-10" />
                <div className="mb-6">
                  <div className="font-serif font-bold text-white text-lg tracking-tight mb-1">
                    NETA SAMACHAR
                  </div>
                  <div className="text-meta">
                    Political Accountability Archive
                  </div>
                </div>
                <p className="text-body-sm max-w-xs">
                  An independent, non-partisan civic technology platform committed to
                  political transparency through verifiable, primary-source evidence.
                </p>
              </div>

              <div className="md:col-span-4">
                <h4 className="text-meta mb-6">Platform</h4>
                <ul className="space-y-4">
                  {FOOTER_LINKS.map(item => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-body-base hover:text-white transition-colors duration-200 hover-underline"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:col-span-4">
                <h4 className="text-meta mb-6">Operating Principles</h4>
                <ul className="space-y-4">
                  {PRINCIPLES.map((p, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="font-mono text-meta flex-shrink-0 mt-1">
                        0{i + 1}
                      </span>
                      <span className="text-body-base">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <p className="text-body-sm">
                © 2026 Neta Samachar. Data sourced from the Election Commission of India, Parliament Archives, and Official Gazettes.
              </p>
              <div className="flex items-center gap-3">
                <span className="badge-meta">GODL Framework</span>
                <span className="badge-meta">BSA 2023 Compliant</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
