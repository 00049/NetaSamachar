export function SkeletonCard() {
  return (
    <div className="h-auto md:h-[340px] w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[4px] p-[32px] flex flex-col justify-between overflow-hidden relative">
      {/* Shimmer Effect */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          background: 'linear-gradient(110deg, transparent 8%, rgba(255,255,255,0.04) 18%, transparent 33%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s linear infinite'
        }}
      />
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-[88px] h-[88px] rounded-full bg-white/[0.03]" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-16 bg-white/[0.03] rounded-sm" />
            <div className="h-6 w-3/4 bg-white/[0.03] rounded-sm" />
          </div>
        </div>
        <div className="space-y-3 mb-8">
          <div className="h-4 w-full bg-white/[0.03] rounded-sm" />
          <div className="h-4 w-5/6 bg-white/[0.03] rounded-sm" />
          <div className="h-4 w-4/6 bg-white/[0.03] rounded-sm" />
        </div>
      </div>
      <div className="relative z-10 w-full h-8 bg-white/[0.03] rounded-sm" />
    </div>
  );
}
