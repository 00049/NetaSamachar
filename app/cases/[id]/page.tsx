import { getCriminalCase } from '@/lib/api';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { Scale, ChevronRight, User, AlertTriangle, Calendar, FileText } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const ccase = await getCriminalCase(id);
  if (!ccase) return { title: 'Case Not Found' };
  return {
    title: `${ccase.caseNumber} | Criminal Record | Neta Samachar`,
    description: ccase.chargeDescription,
    alternates: {
      canonical: `/cases/${id}`,
    },
  };
}

export default async function CaseDetailPage({ params }: PageProps) {
  const { id } = await params;
  const ccase = await getCriminalCase(id);
  
  if (!ccase) {
    notFound();
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'heinous': return 'text-red-500 border-red-500/20 bg-red-500/5';
      case 'cognizable': return 'text-orange-500 border-orange-500/20 bg-orange-500/5';
      default: return 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] pb-32">
      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-raised)] pt-24 pb-12 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-[#8A8F98] mb-6">
            <Link href="/investigations" className="hover:text-white transition-colors">Legal Records</Link>
            <ChevronRight size={14} />
            <span className="text-[#e6b16a]">Case {ccase.caseNumber}</span>
          </div>
          
          <div className="flex items-start gap-4 mb-6">
            <div className="mt-1.5 p-3 rounded-full bg-white/[0.04] border border-white/10 text-white">
              <Scale size={28} />
            </div>
            <div>
              <h1 className="font-serif text-3xl md:text-5xl font-black text-[#F5F5F7] mb-2 leading-tight">
                {ccase.caseNumber}
              </h1>
              <div className="text-xl text-[#A1A1AA] font-serif italic">
                {ccase.court}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <div className={`px-4 py-2 rounded-sm border ${getSeverityColor(ccase.severity)} flex items-center gap-2 text-sm font-bold uppercase tracking-widest`}>
              <AlertTriangle size={16} />
              {ccase.severity.replace('_', ' ')}
            </div>
            <div className="px-4 py-2 rounded-sm border border-[var(--border-subtle)] bg-white/[0.02] flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#A1A1AA]">
              Status: {ccase.status}
            </div>
            <div className="px-4 py-2 rounded-sm border border-[var(--border-subtle)] bg-white/[0.02] flex items-center gap-2 text-sm font-bold tracking-widest text-[#A1A1AA]">
              <Calendar size={16} />
              Year: {ccase.year}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-12">
          <section>
            <h2 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-2">
              <FileText size={20} className="text-[#e6b16a]" />
              Charge Description
            </h2>
            <div className="bg-[var(--bg-raised)] border border-[var(--border-subtle)] rounded-sm p-6 text-[#A1A1AA] leading-[1.7] text-[16px]">
              {ccase.chargeDescription}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-white mb-6">Applicable Sections</h2>
            <div className="flex flex-wrap gap-2">
              {ccase.section.split(',').map((sec, i) => (
                <div key={i} className="px-3 py-1.5 bg-white/[0.04] border border-[var(--border-subtle)] rounded-sm text-sm text-white font-mono">
                  {sec.trim()}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="bg-[var(--bg-raised)] border border-[var(--border-subtle)] rounded-sm p-6">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8A8F98] mb-4">Accused Politician</h3>
            <Link href={`/politicians/${ccase.politician.id}`} className="group flex items-center gap-4 p-3 -mx-3 rounded-sm hover:bg-white/[0.04] transition-colors">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white overflow-hidden flex-shrink-0">
                {ccase.politician.photoUrl ? (
                  <img src={ccase.politician.photoUrl} alt={ccase.politician.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                ) : (
                  <User size={24} />
                )}
              </div>
              <div>
                <div className="text-sm font-bold text-white group-hover:text-[#e6b16a] transition-colors">{ccase.politician.name}</div>
                <div className="text-[11px] text-[#A1A1AA] uppercase tracking-wider mt-1">{ccase.politician.position}</div>
              </div>
            </Link>
          </div>
          
          <div className="bg-[var(--bg-raised)] border border-[var(--border-subtle)] rounded-sm p-6">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8A8F98] mb-4">Source Material</h3>
            <p className="text-sm text-[#A1A1AA] leading-relaxed mb-4">
              This information is sourced directly from election affidavits filed by the candidate and verified against eCourts records where available.
            </p>
            <Link href="/sources" className="text-[12px] font-bold text-[#e6b16a] hover:text-white uppercase tracking-widest transition-colors flex items-center">
              View Our Sources <ChevronRight size={14} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
