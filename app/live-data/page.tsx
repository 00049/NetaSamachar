import { Breadcrumbs } from '@/components/shared/Breadcrumbs';

export default function LiveDataPlaceholder() {
  return (
    <div className="min-h-screen pt-[80px]">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <Breadcrumbs items={[
          { label: 'Live Data' }
        ]} />
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <h1 className="text-4xl font-bold text-white">Live Data Feed</h1>
          </div>
          <p className="text-[#A1A1AA]">Real-time tracking of legislative sessions, breaking cases, and immediate promises.</p>
        </div>
        <div className="premium-card p-8 min-h-[500px] flex flex-col items-center justify-center text-[#A1A1AA] border border-white/10 border-dashed">
          <p className="mb-4 text-center max-w-md">The Live Data stream connects directly to parliamentary APIs and court registries to provide real-time updates.</p>
          <div className="px-4 py-2 bg-white/5 rounded-full text-sm">Connecting to live feed...</div>
        </div>
      </div>
    </div>
  );
}
