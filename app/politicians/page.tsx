import { PoliticiansClient } from './PoliticiansClient';
import { Suspense } from 'react';
import { PoliticiansGridSkeleton } from '@/components/ui/Skeletons';
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
      {/* Interactive filtering/sorting — client component */}
      <Suspense fallback={
        <div className="w-full h-screen flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
            <div className="text-white/40 text-sm">Loading database...</div>
          </div>
        </div>
      }>
        <PoliticiansClient />
      </Suspense>
    </main>
  );
}
