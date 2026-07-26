import { ArchiveClient } from './ArchiveClient';
import { Suspense } from 'react';
import { PromiseCardSkeleton } from '@/components/ui/Skeletons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Evidence Archive',
  description:
    'Primary source document repository: 12,847+ verified government records, gazette notifications, court orders and RTI responses backing every claim on the platform.',
};

export default function ArchivePage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      {/* Static header — rendered at build time */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 xl:px-20 py-32 lg:py-40">
        <div className="section-label mb-6">Evidence Repository</div>
        <h1
          className="font-serif font-black text-[var(--text-primary)] mb-6 leading-tight"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', letterSpacing: '-0.03em' }}
        >
          Primary Source Archive
        </h1>
        <p
          className="text-[var(--text-secondary)] max-w-2xl leading-relaxed"
          style={{ fontSize: 'var(--font-body-xl)' }}
        >
          Every claim on this platform is backed by a primary source document. Browse,
          search, and verify the evidence chain directly.
        </p>
      </div>

      {/* Interactive content — client component; code-split from homepage bundle */}
      <Suspense fallback={
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 xl:px-20 pb-32">
          {/* Skeleton for search/filter bar */}
          <div className="h-14 w-full bg-white/[0.02] border border-white/[0.06] rounded-lg mb-8 animate-pulse" />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <PromiseCardSkeleton />
            <PromiseCardSkeleton />
            <PromiseCardSkeleton />
            <PromiseCardSkeleton />
          </div>
        </div>
      }>
        <ArchiveClient />
      </Suspense>
    </div>
  );
}
