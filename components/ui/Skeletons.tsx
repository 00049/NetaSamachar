/**
 * PoliticianCardSkeleton — matches the exact dimensions of PoliticianCard in grid mode.
 * Used as a loading placeholder to prevent layout shift.
 * Height: ~340px (same as compact card), grid: repeat(auto-fill, minmax(280px, 1fr))
 */
function PoliticianCardSkeleton() {
  return (
    <div className="animate-pulse bg-white/[0.02] border border-white/[0.06] rounded-[12px] p-6 h-[340px] flex flex-col items-center">
      {/* Avatar */}
      <div className="w-[88px] h-[88px] rounded-full bg-white/[0.06] mb-6 shrink-0" />
      {/* Name */}
      <div className="h-6 w-3/4 bg-white/[0.06] rounded mb-2" />
      <div className="h-4 w-1/2 bg-white/[0.04] rounded mb-8" />
      {/* Party chip */}
      <div className="h-[26px] w-16 bg-white/[0.04] rounded-[3px] mb-8" />
      {/* Stats */}
      <div className="w-full space-y-3 mt-auto">
        <div className="flex justify-between">
          <div className="h-3 w-20 bg-white/[0.04] rounded" />
          <div className="h-3 w-10 bg-white/[0.04] rounded" />
        </div>
        <div className="h-[6px] w-full bg-white/[0.04] rounded-[3px]" />
      </div>
    </div>
  );
}

/** Renders a full grid of skeleton cards matching the politicians list layout. */
export function PoliticiansGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
      {Array.from({ length: count }).map((_, i) => (
        <PoliticianCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Skeleton for a single promise/investigation card row. */
export function PromiseCardSkeleton() {
  return (
    <div className="animate-pulse border border-white/[0.06] rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-4 w-20 bg-white/[0.06] rounded" />
        <div className="h-4 w-16 bg-white/[0.04] rounded" />
      </div>
      <div className="h-6 w-2/3 bg-white/[0.06] rounded" />
      <div className="h-4 w-full bg-white/[0.04] rounded" />
      <div className="h-4 w-4/5 bg-white/[0.04] rounded" />
      <div className="flex gap-3 pt-2">
        <div className="h-8 w-24 bg-white/[0.04] rounded" />
        <div className="h-8 w-24 bg-white/[0.04] rounded" />
      </div>
    </div>
  );
}

/** Skeleton for a stats strip (4 cells). */
export function StatsStripSkeleton() {
  return (
    <div className="animate-pulse grid grid-cols-2 md:grid-cols-4 gap-0 border border-white/[0.06]">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-6 border-r border-white/[0.06] last:border-r-0 space-y-3">
          <div className="h-3 w-20 bg-white/[0.06] rounded" />
          <div className="h-10 w-16 bg-white/[0.06] rounded" />
        </div>
      ))}
    </div>
  );
}
