import { PoliticiansGridSkeleton } from '@/components/ui/Skeletons';

/**
 * Next.js Suspense boundary for the /politicians route.
 * Shown instantly on navigation while the page JS loads and hydrates.
 * Grid dimensions match the real PoliticianCard exactly — zero layout shift.
 */
export default function PoliticiansLoading() {
  return (
    <main className="min-h-screen bg-[var(--bg-base)]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 xl:px-20 py-32 lg:py-40">
        {/* Header skeleton */}
        <div className="animate-pulse mb-16">
          <div className="h-4 w-32 bg-white/[0.06] rounded mb-6" />
          <div className="h-14 w-96 bg-white/[0.06] rounded mb-6" />
          <div className="h-5 w-[520px] max-w-full bg-white/[0.04] rounded" />
        </div>

        {/* Control bar skeleton */}
        <div className="animate-pulse h-[60px] bg-white/[0.02] border border-white/[0.06] rounded mb-12" />

        {/* Grid of skeletons */}
        <PoliticiansGridSkeleton count={12} />
      </div>
    </main>
  );
}
