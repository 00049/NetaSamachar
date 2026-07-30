import { Breadcrumbs } from '@/components/shared/Breadcrumbs';

export default function PartiesPlaceholder() {
  return (
    <div className="min-h-screen pt-[80px]">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <Breadcrumbs items={[
          { label: 'Political Parties' }
        ]} />
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Political Parties</h1>
          <p className="text-[#A1A1AA]">Global dashboard for tracking and comparing political parties.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="premium-card p-6 flex flex-col items-center text-center group cursor-pointer hover:border-white/20 transition-all">
              <div className="w-[80px] h-[80px] rounded-full bg-white/5 border border-white/10 mb-4 flex items-center justify-center text-white/20">Logo</div>
              <h3 className="text-white text-lg font-bold mb-1 group-hover:text-[#3B82F6] transition-colors">Party Name {i}</h3>
              <p className="text-[#A1A1AA] text-xs">National Party</p>
              <div className="mt-6 w-full pt-4 border-t border-white/5 flex justify-between text-sm">
                <span className="text-[#A1A1AA]">Politicians</span>
                <span className="text-white font-bold">142</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
