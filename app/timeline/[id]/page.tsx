import { Breadcrumbs } from '@/components/shared/Breadcrumbs';

export default async function TimelineDetailPlaceholder({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="min-h-screen pt-[80px]">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <Breadcrumbs items={[
          { label: 'Timeline', href: '#' },
          { label: id }
        ]} />
        <div className="mb-8">
          <div className="text-[var(--color-accent-positive)] font-mono text-sm tracking-widest mb-4">TIMELINE POSITION</div>
          <h1 className="text-4xl font-bold text-white mb-2">Role: {id}</h1>
          <p className="text-[#A1A1AA]">Structural placeholder for career position timeline.</p>
        </div>
        <div className="premium-card p-8 h-full min-h-[400px] flex flex-col items-center justify-center text-[#A1A1AA] border border-white/10 border-dashed">
          <p className="mb-4">Role overview and impact metrics for {id}</p>
          <button className="px-4 py-2 bg-white/5 rounded hover:bg-white/10 transition-colors">View Official Documents</button>
        </div>
      </div>
    </div>
  );
}
