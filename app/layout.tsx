import type { Metadata } from 'next';
import { Inter, IBM_Plex_Sans } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navigation/Navbar';
import { GlobalFooter } from '@/components/shared/GlobalFooter';
import { LiveIndicator } from '@/components/ui/LiveIndicator';
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

        <GlobalFooter />
      </body>
    </html>
  );
}
