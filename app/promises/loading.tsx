import { PromiseCardSkeleton, StatsStripSkeleton } from '@/components/ui/Skeletons';

export default function PromisesLoading() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] pb-32">
      <div className="max-w-7xl mx-auto px-8 lg:px-12 pt-12 pb-10">
        {/* Header skeleton */}
        <div className="animate-pulse mb-12">
          <div className="h-4 w-36 bg-white/[0.06] rounded mb-6" />
          <div className="h-12 w-[520px] max-w-full bg-white/[0.06] rounded mb-4" />
          <div className="h-5 w-96 max-w-full bg-white/[0.04] rounded" />
        </div>
        <StatsStripSkeleton />
      </div>

      {/* Filter bar skeleton */}
      <div className="animate-pulse h-[60px] border-y border-white/[0.06] mb-12" />

      {/* List skeletons */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 space-y-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <PromiseCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
