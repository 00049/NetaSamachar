import { Breadcrumbs } from '@/components/shared/Breadcrumbs';

export default function InvestigationsPlaceholder() {
  return (
    <div className="min-h-screen pt-[80px]">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <Breadcrumbs items={[
          { label: 'Investigations' }
        ]} />
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Investigations</h1>
          <p className="text-[#A1A1AA]">Global dashboard for active Neta Samachar investigations.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="premium-card p-6 min-h-[250px] flex flex-col justify-between group cursor-pointer hover:border-white/20 transition-all">
              <div>
                <div className="text-[var(--color-accent-negative)] text-xs font-bold uppercase tracking-wider mb-2">Active Investigation</div>
                <h3 className="text-white text-xl font-bold mb-2 group-hover:text-[#3B82F6] transition-colors">Investigation Topic {i}</h3>
                <p className="text-[#A1A1AA] text-sm line-clamp-3">Placeholder for an in-depth data journalism investigation tracking political irregularities or major policy impacts.</p>
              </div>
              <div className="mt-6 text-sm text-[#3B82F6] font-medium flex items-center gap-2">
                Read Report &rarr;
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
