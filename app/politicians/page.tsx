import { PoliticiansClient } from './PoliticiansClient';
import type { Metadata } from 'next';
import { POLITICIANS } from '@/data/politicians';

export const metadata: Metadata = {
  title: 'Politicians',
  description: `Comprehensive dossiers on ${POLITICIANS.length} Indian legislators. All data sourced from mandatory electoral affidavits, parliamentary records, and official government disclosures.`,
};

// This page is a React Server Component — full HTML is generated at build
// time and delivered to the client with real content already in it.
export default function PoliticiansPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-base)]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 xl:px-20 py-32 lg:py-40">
        <div className="section-label mb-6">Politician Database</div>
        <h1
          className="font-serif font-black text-[var(--text-primary)] mb-6 leading-tight"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', letterSpacing: '-0.03em' }}
        >
          Legislative Dossiers
        </h1>
        <p
          className="text-[var(--text-secondary)] max-w-2xl leading-relaxed mb-16"
          style={{ fontSize: 'var(--font-body-xl)' }}
        >
          Comprehensive dossiers on Indian legislators. All data sourced exclusively from mandatory
          electoral affidavits, parliamentary records, and official government disclosures.
        </p>
      </div>

      {/* Interactive filtering/sorting — client component */}
      <PoliticiansClient />
    </main>
  );
}
