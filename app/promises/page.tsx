import { PromisesClient } from './PromisesClient';
import { Suspense } from 'react';
import { PromiseCardSkeleton } from '@/components/ui/Skeletons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Investigations',
  description:
    'A forensic tracker of political commitments. Every promise is subjected to rigorous evidentiary standards.',
};

export default function PromisesPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] pb-32">
      {/* Editorial Header — statically rendered */}
      <div className="max-w-7xl mx-auto px-8 lg:px-12 pt-12 pb-10">
        <div className="section-label mb-6">Investigative Database</div>
        <h1
          className="font-serif font-black text-[var(--text-primary)] mb-4 leading-tight"
          style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', letterSpacing: '-0.03em' }}
        >
          The Promise Accountability Index
        </h1>
        <p
          className="text-[var(--text-secondary)] max-w-2xl leading-relaxed mb-12"
          style={{ fontSize: 'var(--font-body-lg)' }}
        >
          A forensic tracker of political commitments. Every promise is subjected to rigorous
          evidentiary standards.
        </p>
      </div>

      {/* Interactive filtering — client component */}
      <Suspense fallback={
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          {/* Skeleton for search/filter bar */}
          <div className="h-14 w-full bg-white/[0.02] border border-white/[0.06] rounded-lg mb-8 animate-pulse" />
          <div className="flex flex-col gap-6">
            <PromiseCardSkeleton />
            <PromiseCardSkeleton />
            <PromiseCardSkeleton />
            <PromiseCardSkeleton />
          </div>
        </div>
      }>
        <PromisesClient />
      </Suspense>
    </div>
  );
}
