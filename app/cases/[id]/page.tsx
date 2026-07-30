import { Breadcrumbs } from '@/components/shared/Breadcrumbs';

export default async function CaseDetailPlaceholder({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="min-h-screen pt-[80px]">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <Breadcrumbs items={[
          { label: 'Legal Cases', href: '#' },
          { label: id }
        ]} />
        <div className="mb-8">
          <div className="text-[#EF4444] font-mono text-sm tracking-widest mb-4">CASE DETAIL PAGE</div>
          <h1 className="text-4xl font-bold text-white mb-2">Legal Proceeding: {id}</h1>
          <p className="text-[#A1A1AA]">Structural placeholder for case tracking.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 flex flex-col gap-2">
            {['Timeline', 'Orders', 'Hearings', 'Documents', 'Court', 'Status'].map(tab => (
              <button key={tab} className="text-left px-4 py-3 rounded-lg hover:bg-white/[0.04] text-[#A1A1AA] hover:text-white transition-colors border border-transparent hover:border-white/5">
                {tab}
              </button>
            ))}
          </div>
          <div className="md:col-span-3">
            <div className="premium-card p-8 h-full min-h-[400px] flex items-center justify-center text-[#A1A1AA] border border-white/10 border-dashed">
              [ Detailed Case {id} Data will render here ]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
