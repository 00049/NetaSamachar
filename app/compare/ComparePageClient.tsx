'use client';

import dynamic from 'next/dynamic';

// Skeleton shown while the heavy CompareBuilder JS loads
function CompareBuilderSkeleton() {
  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-10 xl:px-20 py-32 lg:py-40">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-6 animate-pulse">
        <div>
          <div className="h-4 w-32 bg-white/[0.06] rounded mb-3" />
          <div className="h-12 w-64 bg-white/[0.06] rounded" />
        </div>
        <div className="flex gap-2">
          {['Party', 'State', 'Constituency', 'Politician'].map((t) => (
            <div
              key={t}
              className="h-[36px] w-28 bg-white/[0.04] rounded-md border border-white/[0.08]"
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6 mb-16">
        {['A', 'B'].map((s) => (
          <div key={s} className="flex-1 animate-pulse">
            <div className="h-3 w-8 bg-white/[0.06] rounded mb-3" />
            <div className="h-[60px] bg-white/[0.02] border border-white/[0.08] rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Dynamic import with ssr:false is only valid inside a Client Component
const CompareBuilder = dynamic(
  () => import('@/components/compare/CompareBuilder').then((m) => m.CompareBuilder),
  {
    ssr: false,
    loading: () => <CompareBuilderSkeleton />,
  }
);

interface Props {
  initialSearchParams: { type?: string; a?: string; b?: string; c?: string };
}

export function ComparePageClient({ initialSearchParams }: Props) {
  return <CompareBuilder initialSearchParams={initialSearchParams} />;
}
