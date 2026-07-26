import { StatsStripSkeleton } from '@/components/ui/Skeletons';

export default function ArchiveLoading() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 xl:px-20 py-32 lg:py-40">
        <div className="animate-pulse mb-16">
          <div className="h-4 w-32 bg-white/[0.06] rounded mb-6" />
          <div className="h-14 w-80 bg-white/[0.06] rounded mb-6" />
          <div className="h-5 w-[480px] max-w-full bg-white/[0.04] rounded" />
        </div>
      </div>

      <StatsStripSkeleton />

      {/* Filter bar skeleton */}
      <div className="animate-pulse h-[60px] border-y border-white/[0.06] mb-12" />

      <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12 py-16 space-y-12">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse border border-white/[0.06] rounded-xl p-8 space-y-4"
          >
            <div className="h-4 w-24 bg-white/[0.06] rounded" />
            <div className="h-7 w-3/4 bg-white/[0.06] rounded" />
            <div className="h-4 w-full bg-white/[0.04] rounded" />
            <div className="h-4 w-5/6 bg-white/[0.04] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
