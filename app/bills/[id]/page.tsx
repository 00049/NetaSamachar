import { getBill } from '@/lib/api';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, FileText, CheckCircle2, XCircle, ChevronRight, User } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const bill = await getBill(id);
  if (!bill) return { title: 'Bill Not Found' };
  return {
    title: `${bill.title} | Neta Samachar`,
    description: bill.summary,
    alternates: {
      canonical: `/bills/${bill.id}`,
    },
  };
}

export default async function BillDetailPage({ params }: PageProps) {
  const { id } = await params;
  const bill = await getBill(id);
  
  if (!bill) {
    notFound();
  }

  // Use the mocked API to get sponsor info if possible. Since we didn't add getPolitician directly in phase D instructions but we might need it, let's just do a quick mock fetch here.
  // Actually, we have POLITICIANS in lib/api but it's not exported. Let's add getPolitician to lib/api.ts.
  
  return (
    <div className="min-h-screen bg-[var(--bg-base)] pb-32">
      {/* Header section */}
      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-raised)] pt-24 pb-12 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-[#8A8F98] mb-6">
            <Link href="/investigations" className="hover:text-white transition-colors">Legislation</Link>
            <ChevronRight size={14} />
            <span className="text-[#e6b16a]">{bill.type || 'Bill'}</span>
          </div>
          
          <h1 className="font-serif text-3xl md:text-5xl font-black text-[#F5F5F7] mb-6 leading-tight">
            {bill.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-[13px] text-[#A1A1AA]">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              Introduced: {new Date(bill.introducedDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            {bill.house && (
              <div className="flex items-center gap-2">
                <LandmarkIcon size={16} />
                {bill.house}
              </div>
            )}
            <div className="px-3 py-1 rounded-full border border-[var(--border-subtle)] bg-white/[0.02] uppercase tracking-widest text-[10px] font-bold">
              Status: {bill.status.replace('_', ' ')}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-12">
          
          <section>
            <h2 className="text-xl font-serif font-bold text-white mb-4 flex items-center gap-2">
              <FileText size={20} className="text-[#e6b16a]" />
              Summary
            </h2>
            <div className="text-[#A1A1AA] leading-[1.7] text-[16px]">
              {bill.summary}
            </div>
          </section>
          
          {bill.objectives && bill.objectives.length > 0 && (
            <section>
              <h2 className="text-xl font-serif font-bold text-white mb-6">Key Objectives</h2>
              <ul className="space-y-4">
                {bill.objectives.map((obj, i) => (
                  <li key={i} className="bg-[var(--bg-raised)] border border-[var(--border-subtle)] p-5 rounded-sm">
                    <strong className="block text-white mb-2">{obj.title}</strong>
                    <span className="text-[#A1A1AA] text-sm">{obj.description}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {bill.timeline && bill.timeline.length > 0 && (
            <section>
              <h2 className="text-xl font-serif font-bold text-white mb-6">Legislative Timeline</h2>
              <div className="relative border-l border-[var(--border-subtle)] ml-3 space-y-8 pb-4">
                {bill.timeline.map((event, i) => (
                  <div key={i} className="relative pl-8">
                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[var(--bg-base)] border-2 border-[#e6b16a]" />
                    <div className="text-[12px] text-[#e6b16a] font-bold tracking-widest uppercase mb-1">{new Date(event.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    <div className="text-white font-bold mb-1">{event.title}</div>
                    <div className="text-sm text-[#A1A1AA]">{event.description}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-[var(--bg-raised)] border border-[var(--border-subtle)] rounded-sm p-6">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8A8F98] mb-4">Sponsorship</h3>
            <Link href={`/politicians/${bill.politicianId}`} className="group flex items-center gap-3 p-3 -mx-3 rounded-sm hover:bg-white/[0.04] transition-colors">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white overflow-hidden">
                <User size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-white group-hover:text-[#e6b16a] transition-colors">View Sponsor</div>
                <div className="text-[11px] text-[#A1A1AA] capitalize">{bill.sponsorRole.replace('_', ' ')}</div>
              </div>
            </Link>
          </div>

          {bill.votingRecord && (
            <div className="bg-[var(--bg-raised)] border border-[var(--border-subtle)] rounded-sm p-6">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8A8F98] mb-4">Voting Record</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white">Aye</span>
                    <span className="font-mono text-[#8A8F98]">{bill.votingRecord.aye}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500/50" style={{ width: `${(bill.votingRecord.aye / bill.votingRecord.totalVotes) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white">No</span>
                    <span className="font-mono text-[#8A8F98]">{bill.votingRecord.no}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500/50" style={{ width: `${(bill.votingRecord.no / bill.votingRecord.totalVotes) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white">Abstain</span>
                    <span className="font-mono text-[#8A8F98]">{bill.votingRecord.abstain}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500/50" style={{ width: `${(bill.votingRecord.abstain / bill.votingRecord.totalVotes) * 100}%` }} />
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <span className="text-sm text-[#A1A1AA]">Outcome</span>
                  <span className={`text-sm font-bold flex items-center gap-1 ${bill.votingRecord.passed ? 'text-green-500' : 'text-red-500'}`}>
                    {bill.votingRecord.passed ? <><CheckCircle2 size={16} /> Passed</> : <><XCircle size={16} /> Failed</>}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Quick component for landmark icon missing from import above
function LandmarkIcon({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" x2="21" y1="22" y2="22" />
      <line x1="6" x2="6" y1="18" y2="11" />
      <line x1="10" x2="10" y1="18" y2="11" />
      <line x1="14" x2="14" y1="18" y2="11" />
      <line x1="18" x2="18" y1="18" y2="11" />
      <polygon points="12 2 20 7 4 7" />
    </svg>
  );
}
