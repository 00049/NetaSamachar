'use client';

import { Politician } from '@/lib/types';
import { 
  ChevronDown,
  ChevronRight,
  Scale,
  FileText,
  Gavel,
  Clock,
  ShieldAlert,
  Search,
  Filter,
  User,
  Coins,
  Building2,
  MessageSquare,
  FileWarning,
  AlertTriangle,
  Info,
  CheckCircle2
} from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';

interface Props {
  politician: Politician;
}

export function CasesTab({ politician }: Props) {
  
  const cases = politician.criminalCases || [];

  if (cases.length === 0) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 border border-white/10 p-12 text-center rounded-[16px] bg-white/[0.02]">
        <h3 className="text-white font-bold mb-2">No Legal Proceedings</h3>
        <p className="text-[#A1A1AA] text-[13px]">No criminal cases or legal proceedings have been registered.</p>
      </div>
    );
  }

  const totalCases = cases.length;
  const pendingCases = cases.filter(c => c.status === 'pending').length;
  const convictedCases = cases.filter(c => c.status === 'convicted').length;
  const closedCases = cases.filter(c => ['acquitted', 'withdrawn', 'quashed'].includes(c.status)).length;
  const heinousCases = cases.filter(c => c.severity === 'heinous').length;
  const cognizableCases = cases.filter(c => c.severity === 'cognizable').length;
  const nonCognizableCases = cases.filter(c => c.severity === 'non_cognizable').length;

  const pendingPct = totalCases > 0 ? (pendingCases / totalCases) * 100 : 0;
  const convictedPct = totalCases > 0 ? (convictedCases / totalCases) * 100 : 0;
  const closedPct = totalCases > 0 ? (closedCases / totalCases) * 100 : 0;

  const getStatusMeta = (status: string) => {
    switch(status) {
      case 'pending': return { label: 'Pending', color: 'text-yellow-500' };
      case 'convicted': return { label: 'Convicted', color: 'text-red-500' };
      case 'acquitted': return { label: 'Acquitted', color: 'text-[#22c55e]' };
      case 'withdrawn': return { label: 'Withdrawn', color: 'text-[#3b82f6]' };
      case 'quashed': return { label: 'Quashed', color: 'text-[#22c55e]' };
      default: return { label: status, color: 'text-[#A1A1AA]' };
    }
  };

  const getSeverityMeta = (severity: string) => {
    switch(severity) {
      case 'heinous': return { label: 'Heinous', color: 'bg-red-500' };
      case 'cognizable': return { label: 'Cognizable', color: 'bg-yellow-500' };
      case 'non_cognizable': return { label: 'Non-Cognizable', color: 'bg-[#22c55e]' };
      default: return { label: severity, color: 'bg-[#A1A1AA]' };
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-[16px] mb-[32px]">
        <div>
          <h2 className="text-[#22c55e] text-[11px] font-bold uppercase tracking-widest mb-[4px]">Legal Proceedings</h2>
          <h3 className="text-white text-[28px] font-bold mb-[4px]">Cases</h3>
          <p className="text-[#A1A1AA] text-[13px]">Overview of criminal cases, charges, and legal proceedings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-[24px]">
        
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-[24px]">
          
          {/* Top Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-[12px]">
            
            {/* Total Cases */}
            <div className="premium-card p-[16px]">
              <div className="flex items-center gap-[12px] mb-[12px]">
                <div className="w-[32px] h-[32px] rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <Scale className="w-[16px] h-[16px] text-red-500" />
                </div>
                <div className="text-[#A1A1AA] text-[11px] font-medium leading-tight">Total Cases</div>
              </div>
              <div className="text-white font-bold text-[22px] mb-[4px]">{totalCases}</div>
              <div className="text-[#52525B] text-[11px]">Across all stages</div>
            </div>

            {/* Cases with Charges */}
            <div className="premium-card p-[16px]">
              <div className="flex items-center gap-[12px] mb-[12px]">
                <div className="w-[32px] h-[32px] rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                  <FileText className="w-[16px] h-[16px] text-yellow-500" />
                </div>
                <div className="text-[#A1A1AA] text-[11px] font-medium leading-tight">Heinous</div>
              </div>
              <div className="text-white font-bold text-[22px] mb-[4px]">{heinousCases}</div>
              <div className="text-[#52525B] text-[11px]">{totalCases ? Math.round((heinousCases / totalCases) * 100) : 0}% of total</div>
            </div>

            {/* Convictions */}
            <div className="premium-card p-[16px]">
              <div className="flex items-center gap-[12px] mb-[12px]">
                <div className="w-[32px] h-[32px] rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                  <Gavel className="w-[16px] h-[16px] text-yellow-500" />
                </div>
                <div className="text-[#A1A1AA] text-[11px] font-medium leading-tight">Convictions</div>
              </div>
              <div className="text-white font-bold text-[22px] mb-[4px]">{convictedCases}</div>
              <div className="text-[#52525B] text-[11px]">{Math.round(convictedPct)}% of total</div>
            </div>

            {/* Cases Pending */}
            <div className="premium-card p-[16px]">
              <div className="flex items-center gap-[12px] mb-[12px]">
                <div className="w-[32px] h-[32px] rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Clock className="w-[16px] h-[16px] text-purple-500" />
                </div>
                <div className="text-[#A1A1AA] text-[11px] font-medium leading-tight">Cases Pending</div>
              </div>
              <div className="text-white font-bold text-[22px] mb-[4px]">{pendingCases}</div>
              <div className="text-[#52525B] text-[11px]">{Math.round(pendingPct)}% of total</div>
            </div>

            {/* Cases Closed */}
            <div className="premium-card p-[16px]">
              <div className="flex items-center gap-[12px] mb-[12px]">
                <div className="w-[32px] h-[32px] rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center">
                  <ShieldAlert className="w-[16px] h-[16px] text-[#3b82f6]" />
                </div>
                <div className="text-[#A1A1AA] text-[11px] font-medium leading-tight">Cases Closed</div>
              </div>
              <div className="text-white font-bold text-[22px] mb-[4px]">{closedCases}</div>
              <div className="text-[#52525B] text-[11px]">{Math.round(closedPct)}% of total</div>
            </div>

          </div>

          {/* FILTERS BAR */}
          <div className="flex flex-col xl:flex-row gap-[16px] justify-between">
            
            <div className="flex flex-wrap gap-[12px] flex-grow">
              <div className="relative max-w-[200px] w-full">
                <Search className="w-[14px] h-[14px] text-[#A1A1AA] absolute left-[12px] top-[10px]" />
                <input 
                  type="text" 
                  placeholder="Search cases..." 
                  className="w-full bg-[#111111] border border-white/10 rounded-[8px] pl-[36px] pr-[12px] py-[8px] text-[13px] text-white focus:outline-none focus:border-white/20 transition-colors placeholder:text-white/20"
                />
              </div>

              <button className="flex items-center gap-[6px] px-[12px] py-[8px] rounded-[8px] border border-white/10 text-[#A1A1AA] text-[13px] hover:text-white bg-[#111111] hover:bg-white/[0.02] transition-colors">
                All Status <ChevronDown className="w-[14px] h-[14px]" />
              </button>
              <button className="flex items-center gap-[6px] px-[12px] py-[8px] rounded-[8px] border border-white/10 text-[#A1A1AA] text-[13px] hover:text-white bg-[#111111] hover:bg-white/[0.02] transition-colors">
                All Case Types <ChevronDown className="w-[14px] h-[14px]" />
              </button>
              <button className="flex items-center gap-[6px] px-[12px] py-[8px] rounded-[8px] border border-white/10 text-[#A1A1AA] text-[13px] hover:text-white bg-[#111111] hover:bg-white/[0.02] transition-colors">
                All Courts <ChevronDown className="w-[14px] h-[14px]" />
              </button>
              <button className="flex items-center gap-[6px] px-[12px] py-[8px] rounded-[8px] border border-white/10 text-[#A1A1AA] text-[13px] hover:text-white bg-[#111111] hover:bg-white/[0.02] transition-colors">
                All Years <ChevronDown className="w-[14px] h-[14px]" />
              </button>
              
              <button className="flex items-center gap-[6px] px-[12px] py-[8px] rounded-[8px] border border-white/10 text-[#A1A1AA] text-[13px] hover:text-white bg-[#111111] hover:bg-white/[0.02] transition-colors ml-auto xl:ml-0">
                More Filters <Filter className="w-[14px] h-[14px]" />
              </button>
            </div>
          </div>

          {/* MAIN TABLE */}
          <div className="premium-card overflow-x-auto flex flex-col justify-between h-fit">
            <div className="p-[20px] pb-0">
               <h3 className="text-white text-[15px] font-bold">All Cases ({totalCases})</h3>
            </div>
            
            <div className="min-w-[1000px] mt-[16px]">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-[16px] px-[20px] py-[16px] border-y border-white/5 bg-white/[0.02]">
                <div className="col-span-3 text-[#A1A1AA] text-[11px] font-medium">Case Title & Details</div>
                <div className="col-span-2 text-[#A1A1AA] text-[11px] font-medium">Case Type</div>
                <div className="col-span-2 text-[#A1A1AA] text-[11px] font-medium">FIR / Case No.</div>
                <div className="col-span-1 text-[#A1A1AA] text-[11px] font-medium">Court</div>
                <div className="col-span-1 text-[#A1A1AA] text-[11px] font-medium">Status</div>
                <div className="col-span-1 text-[#A1A1AA] text-[11px] font-medium text-center">Next Hearing</div>
                <div className="col-span-1 text-[#A1A1AA] text-[11px] font-medium text-center">Severity</div>
                <div className="col-span-1 text-[#A1A1AA] text-[11px] font-medium text-right pr-[8px]">Actions</div>
              </div>

              {/* Table Rows */}
              <div className="flex flex-col">
                {cases.map((c, index) => (
                  <Link href={`#`} key={index} className="grid grid-cols-12 gap-[16px] px-[20px] py-[20px] border-b border-white/5 hover:bg-white/[0.02] transition-colors items-center group cursor-pointer">
                    
                    {/* Case Title */}
                    <div className="col-span-3 flex gap-[12px] items-start pr-[16px]">
                       <div className="w-[40px] h-[40px] shrink-0 rounded-[12px] bg-white/[0.02] border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-colors mt-[2px]">
                         <Scale className="w-[18px] h-[18px] text-[#A1A1AA]" />
                       </div>
                       <div className="flex flex-col gap-[4px]">
                         <h4 className="text-white text-[13px] font-bold leading-snug group-hover:text-blue-400 transition-colors line-clamp-2">{c.chargeDescription}</h4>
                         <p className="text-[#A1A1AA] text-[11px] leading-relaxed line-clamp-2">{c.section}</p>
                       </div>
                    </div>

                    {/* Case Type */}
                    <div className="col-span-2 flex items-center">
                      <span className="text-[#A1A1AA] text-[12px]">{getSeverityMeta(c.severity).label}</span>
                    </div>

                    {/* FIR No */}
                    <div className="col-span-2 flex flex-col justify-center">
                      <span className="text-white text-[12px]">{c.caseNumber}</span>
                      <span className="text-[#A1A1AA] text-[12px]">Year: {c.year}</span>
                    </div>
                    
                    {/* Court */}
                    <div className="col-span-1 flex flex-col justify-center">
                      <span className="text-white text-[12px] line-clamp-2">{c.court}</span>
                    </div>

                    {/* Status */}
                    <div className="col-span-1 flex flex-col justify-center gap-[2px]">
                      <span className={clsx("text-[11px] font-bold whitespace-nowrap", getStatusMeta(c.status).color)}>
                        {getStatusMeta(c.status).label}
                      </span>
                    </div>

                    {/* Next Hearing */}
                    <div className="col-span-1 flex items-center justify-center">
                      <span className="text-[#A1A1AA] text-[12px]">—</span>
                    </div>
                    
                    {/* Severity */}
                    <div className="col-span-1 flex items-center justify-center gap-[6px]">
                      <div className={clsx("w-[6px] h-[6px] rounded-full", getSeverityMeta(c.severity).color)} />
                      <span className="text-[#A1A1AA] text-[12px]">{getSeverityMeta(c.severity).label}</span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex justify-end pr-[8px]">
                      <ChevronRight className="w-[16px] h-[16px] text-[#A1A1AA] group-hover:text-white transition-colors" />
                    </div>

                  </Link>
                ))}
              </div>
            </div>
            
            {/* Pagination Footer */}
            <div className="flex items-center justify-between px-[20px] py-[16px] bg-[#111111]/50">
               <div className="text-[#A1A1AA] text-[12px]">Showing 1 to {Math.min(5, totalCases)} of {totalCases} cases</div>
               <div className="flex items-center gap-[8px]">
                  <button className="w-[28px] h-[28px] flex items-center justify-center rounded border border-white/5 text-white/20 hover:text-white hover:bg-white/5 transition-colors">
                    <ChevronRight className="w-[14px] h-[14px] rotate-180" />
                  </button>
                  <button className="w-[28px] h-[28px] flex items-center justify-center rounded border border-[var(--color-accent-positive)]/50 bg-[var(--color-accent-positive)]/10 text-[var(--color-accent-positive)] font-bold text-[12px]">
                    1
                  </button>
                  <button className="w-[28px] h-[28px] flex items-center justify-center rounded border border-white/5 text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-colors font-bold text-[12px]">
                    2
                  </button>
                  <button className="w-[28px] h-[28px] flex items-center justify-center rounded border border-white/5 text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-colors font-bold text-[12px]">
                    3
                  </button>
                  <button className="w-[28px] h-[28px] flex items-center justify-center rounded border border-white/5 text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-colors">
                    <ChevronRight className="w-[14px] h-[14px]" />
                  </button>
               </div>
            </div>
          </div>
          
          <div className="flex items-center gap-[8px] text-[#52525B] text-[11px] px-[8px]">
            <Info className="w-[14px] h-[14px]" /> Case status is subject to change. Please refer to official court records for the latest updates.
          </div>

        </div>

        {/* RIGHT SIDEBAR */}
        <div className="flex flex-col gap-[24px]">
          
          {/* Legal Risk Score */}
          <div className="premium-card p-[24px]">
            <div className="flex items-center justify-between mb-[16px]">
              <h3 className="text-white text-[14px] font-bold flex items-center gap-[6px]">Legal Risk Score <Info className="w-[14px] h-[14px] text-[#A1A1AA]" /></h3>
            </div>
            
            <div className="flex items-end gap-[16px] mb-[12px]">
              <div className="text-yellow-500 font-bold text-[36px] leading-none">42<span className="text-white/40 text-[20px]"> / 100</span></div>
              <div className="px-[10px] py-[4px] rounded-[6px] bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[11px] font-bold uppercase tracking-wider mb-[4px]">
                Moderate Risk
              </div>
            </div>
            
            <p className="text-[#A1A1AA] text-[12px] mb-[20px]">Based on severity, number of cases, and stage of proceedings</p>
            
            <div className="relative w-full h-[6px] rounded-full overflow-hidden mb-[8px]">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500" />
              <div className="absolute top-[-2px] bottom-[-2px] w-[3px] bg-white rounded-full z-10 shadow-[0_0_5px_rgba(255,255,255,0.8)]" style={{ left: '42%' }} />
            </div>
            <div className="flex items-center justify-between text-[#52525B] text-[10px] uppercase font-bold mb-[24px]">
              <span>Low Risk</span>
              <span>High Risk</span>
            </div>

            <Link href="#" className="flex items-center gap-[6px] text-[#3b82f6] hover:text-blue-400 transition-colors text-[12px] font-medium">
              View Methodology <ChevronRight className="w-[14px] h-[14px]" />
            </Link>
          </div>

          {/* Cases by Status */}
          <div className="premium-card p-[24px]">
            <h3 className="text-white text-[14px] font-bold mb-[24px]">Cases by Status</h3>
            <div className="flex items-center gap-[24px]">
              <div className="relative w-[110px] h-[110px] shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="35" fill="none" stroke="#eab308" strokeWidth="18" strokeDasharray={`${(pendingPct / 100) * 220} 220`} strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="35" fill="none" stroke="#22c55e" strokeWidth="18" strokeDasharray={`${(closedPct / 100) * 220} 220`} strokeDashoffset={`-${(pendingPct / 100) * 220}`} />
                    <circle cx="50" cy="50" r="35" fill="none" stroke="#ef4444" strokeWidth="18" strokeDasharray={`${(convictedPct / 100) * 220} 220`} strokeDashoffset={`-${((pendingPct + closedPct) / 100) * 220}`} />
                  </svg>
                  <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] pointer-events-none" />
              </div>
              
              <div className="flex flex-col gap-[10px] w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[8px]">
                    <div className="w-[8px] h-[8px] bg-[#eab308] rounded-sm" />
                    <span className="text-[#A1A1AA] text-[11px] line-clamp-1">Pending</span>
                  </div>
                  <span className="text-white text-[11px] shrink-0">{pendingCases} <span className="text-[#52525B]">({Math.round(pendingPct)}%)</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[8px]">
                    <div className="w-[8px] h-[8px] bg-[#22c55e] rounded-sm" />
                    <span className="text-[#A1A1AA] text-[11px] line-clamp-1">Closed / Disposed</span>
                  </div>
                  <span className="text-white text-[11px] shrink-0">{closedCases} <span className="text-[#52525B]">({Math.round(closedPct)}%)</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[8px]">
                    <div className="w-[8px] h-[8px] bg-[#ef4444] rounded-sm" />
                    <span className="text-[#A1A1AA] text-[11px] line-clamp-1">Convicted</span>
                  </div>
                  <span className="text-white text-[11px] shrink-0">{convictedCases} <span className="text-[#52525B]">({Math.round(convictedPct)}%)</span></span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-[24px] pt-[16px] border-t border-white/5">
              <span className="text-[#A1A1AA] text-[12px]">Total</span>
              <span className="text-[#A1A1AA] text-[12px]">{totalCases} Cases</span>
            </div>
          </div>

          {/* Cases by Severity */}
          <div className="premium-card p-[24px]">
            <h3 className="text-white text-[14px] font-bold mb-[24px]">Cases by Severity</h3>
            <div className="flex flex-col gap-[16px]">
              
              <div className="flex items-center justify-between gap-[16px]">
                 <span className="text-[#A1A1AA] text-[11px] w-[50px] shrink-0 line-clamp-1">Heinous</span>
                 <div className="w-full h-[6px] bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-red-500 rounded-full" style={{ width: `${totalCases > 0 ? (heinousCases / totalCases) * 100 : 0}%` }} />
                 </div>
                 <span className="text-white text-[11px] w-[60px] text-right shrink-0">{heinousCases} <span className="text-[#52525B]">({totalCases > 0 ? Math.round((heinousCases / totalCases) * 100) : 0}%)</span></span>
              </div>

              <div className="flex items-center justify-between gap-[16px]">
                 <span className="text-[#A1A1AA] text-[11px] w-[50px] shrink-0 line-clamp-1">Cognizable</span>
                 <div className="w-full h-[6px] bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${totalCases > 0 ? (cognizableCases / totalCases) * 100 : 0}%` }} />
                 </div>
                 <span className="text-white text-[11px] w-[60px] text-right shrink-0">{cognizableCases} <span className="text-[#52525B]">({totalCases > 0 ? Math.round((cognizableCases / totalCases) * 100) : 0}%)</span></span>
              </div>

              <div className="flex items-center justify-between gap-[16px]">
                 <span className="text-[#A1A1AA] text-[11px] w-[50px] shrink-0 line-clamp-1">Non-Cog.</span>
                 <div className="w-full h-[6px] bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-[#22c55e] rounded-full" style={{ width: `${totalCases > 0 ? (nonCognizableCases / totalCases) * 100 : 0}%` }} />
                 </div>
                 <span className="text-white text-[11px] w-[60px] text-right shrink-0">{nonCognizableCases} <span className="text-[#52525B]">({totalCases > 0 ? Math.round((nonCognizableCases / totalCases) * 100) : 0}%)</span></span>
              </div>

            </div>
            <div className="flex items-center justify-between mt-[24px] pt-[16px] border-t border-white/5">
              <span className="text-[#A1A1AA] text-[12px]">Total</span>
              <span className="text-[#A1A1AA] text-[12px]">{totalCases} Cases</span>
            </div>
          </div>

          {/* Key Insights */}
          <div className="premium-card p-[24px]">
            <h3 className="text-white text-[14px] font-bold mb-[24px]">Key Insights</h3>
            <div className="flex flex-col gap-[20px]">
              
              <div className="flex gap-[12px] items-start">
                <div className="mt-[2px] shrink-0">
                  <AlertTriangle className="w-[14px] h-[14px] text-red-500" />
                </div>
                <p className="text-[#A1A1AA] text-[12px] leading-relaxed">{totalCases ? Math.round((pendingCases / totalCases) * 100) : 0}% of cases are currently pending.</p>
              </div>

              <div className="flex gap-[12px] items-start">
                <div className="mt-[2px] shrink-0">
                  <Info className="w-[14px] h-[14px] text-yellow-500" />
                </div>
                <p className="text-[#A1A1AA] text-[12px] leading-relaxed">{heinousCases} cases are related to heinous offenses.</p>
              </div>

              <div className="flex gap-[12px] items-start">
                <div className="mt-[2px] shrink-0">
                  <CheckCircle2 className="w-[14px] h-[14px] text-[#22c55e]" />
                </div>
                <p className="text-[#A1A1AA] text-[12px] leading-relaxed">{convictedCases === 0 ? "No convictions recorded as of now." : `${convictedCases} convictions recorded.`}</p>
              </div>

            </div>
            
            <Link href="#" className="flex items-center justify-center gap-[6px] text-[#A1A1AA] hover:text-white transition-colors text-[12px] font-medium mt-[24px] pt-[16px] border-t border-white/5">
              View Detailed Case Timeline <ChevronRight className="w-[14px] h-[14px]" />
            </Link>
          </div>
          
          <div className="flex items-center justify-end gap-[16px]">
            <span className="text-[#A1A1AA] text-[12px]">Have information about a case?</span>
            <button className="px-[16px] py-[8px] rounded-[8px] border border-green-500/30 text-green-500 text-[12px] font-medium hover:bg-green-500/10 transition-colors">
              Submit Information
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
