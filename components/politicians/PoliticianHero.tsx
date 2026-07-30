'use client';

import { Politician, Party } from '@/lib/types';
import { QuickLookData } from '@/lib/scoring';
import { BadgeCheck, MapPin, Calendar, Clock, Award, Info, ClipboardList, User, Gavel, IndianRupee, Users, Sparkles, Scale, History, Target, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  politician: Politician;
  party: Party | null;
  quickLook: QuickLookData;
}

export function PoliticianHero({ politician, party, quickLook }: Props) {
  return (
    <div className="flex flex-col gap-[24px] mb-12">
      {/* TOP ROW */}
      <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr_400px] gap-[24px]">
        {/* COLUMN 1: PORTRAIT */}
        <div className="relative overflow-hidden rounded-[24px] w-full h-full min-h-[400px] bg-[var(--color-base)] transition-all duration-[220ms] hover:translate-y-[-2px]">
          <div className="absolute inset-0 z-0">
            <Image
              src={politician.photoUrl}
              alt={politician.name}
              fill
              className="object-cover object-top opacity-90"
              sizes="(max-width: 1280px) 100vw, 300px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/40 to-transparent" />
          </div>
          <div className="absolute bottom-[24px] left-[24px] z-10">
            <div className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-[20px] bg-black/60 backdrop-blur-md border border-white/10 text-[12px] font-bold text-[var(--color-accent-positive)] uppercase tracking-wider">
              <BadgeCheck className="w-4 h-4" />
              VERIFIED IDENTITY
            </div>
          </div>
        </div>

        {/* COLUMN 2: DETAILS & SCORE */}
        <div className="premium-card p-[32px] flex flex-col md:flex-row gap-[32px]">
          {/* Left: Details */}
          <div className="flex-1 flex flex-col justify-between border-r border-white/10 pr-[32px]">
            <div>
              <div className="flex items-center gap-[8px] mb-[4px]">
                <h1 className="text-3xl font-bold text-white">{politician.name}</h1>
                <BadgeCheck className="w-6 h-6 text-[#3B82F6]" />
              </div>
              <p className="text-[#A1A1AA] text-[16px] font-medium mb-[24px]">{politician.position}, {politician.state}</p>

              <div className="flex items-center gap-[16px] mb-[24px]">
                {party?.logoUrl ? (
                  <div className="w-[48px] h-[48px] flex items-center justify-center bg-white rounded-full">
                    <Image src={party.logoUrl} alt={party.abbreviation} width={32} height={32} className="object-contain" />
                  </div>
                ) : (
                  <div className="w-[48px] h-[48px] flex items-center justify-center bg-white rounded-full">
                    <Users className="w-[24px] h-[24px] text-gray-500" />
                  </div>
                )}
                <div>
                  <div className="font-semibold text-white text-[16px]">{party?.name || 'Independent'}</div>
                  <div className="text-[#A1A1AA] text-[14px]">{party?.abbreviation || 'IND'}</div>
                </div>
              </div>

              <div className="flex items-center gap-[8px] text-[#A1A1AA] text-[15px] mb-[32px]">
                <MapPin className="w-5 h-5" />
                <span>{politician.constituency} Constituency, H.P.</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-[16px] pt-[24px]">
              <div>
                <div className="flex items-center gap-[6px] text-[#A1A1AA] text-[12px] uppercase tracking-wider font-semibold mb-[8px]">
                  <Calendar className="w-4 h-4" /> Age
                </div>
                <div className="text-white font-semibold text-[15px]">{politician.age} Years</div>
              </div>
              <div>
                <div className="flex items-center gap-[6px] text-[#A1A1AA] text-[12px] uppercase tracking-wider font-semibold mb-[8px]">
                  <Calendar className="w-4 h-4" /> In Politics Since
                </div>
                <div className="text-white font-semibold text-[15px]">{politician.termsSince}</div>
              </div>
              <div>
                <div className="flex items-center gap-[6px] text-[#A1A1AA] text-[12px] uppercase tracking-wider font-semibold mb-[8px]">
                  <Award className="w-4 h-4" /> Political Career
                </div>
                <div className="text-white font-semibold text-[15px]">{politician.yearsInPolitics} Years</div>
              </div>
            </div>

            <div className="mt-[24px] bg-white/[0.03] border border-white/10 rounded-[12px] p-[16px] flex items-center justify-between">
               <div className="flex items-center gap-[8px]">
                 <div className="w-2 h-2 rounded-full bg-[var(--color-accent-positive)]" />
                 <span className="text-[#A1A1AA] text-[13px] uppercase tracking-wider font-semibold">Current Status</span>
               </div>
               <div className="flex items-center gap-[12px]">
                 <span className="text-[var(--color-accent-positive)] font-semibold text-[15px]">In Office</span>
                 <span className="text-[#A1A1AA] text-[14px]">Since {politician.termsSince}</span>
               </div>
            </div>
          </div>

          {/* Right: Score */}
          <div className="w-[240px] flex flex-col items-center justify-center shrink-0 pl-[8px]">
            <div className="w-full flex items-center justify-between mb-[16px] text-[#A1A1AA] text-[12px] uppercase tracking-wider font-semibold">
              <span>Overall Performance Score</span>
              <Info className="w-[16px] h-[16px]" />
            </div>

            <div className="relative w-[180px] h-[180px] flex flex-col items-center justify-center mb-[24px]">
              <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                <circle
                  cx="50" cy="50" r="46" fill="none"
                  stroke="var(--color-accent-positive)" strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${(quickLook.score.value / 100) * 289} 289`}
                  className="transition-all duration-1000 ease-[cubic-bezier(.22,1,.36,1)]"
                />
              </svg>
              <div className="flex items-baseline mt-[8px]">
                <span className="text-white font-bold leading-none tracking-tight" style={{ fontSize: '56px' }}>{quickLook.score.value}</span>
                <span className="text-[#A1A1AA] font-semibold text-[20px] ml-[2px]">/100</span>
              </div>
              <div className="text-[var(--color-accent-positive)] font-bold tracking-wide mt-2">
                {quickLook.score.label.toUpperCase()}
              </div>
            </div>

            <p className="text-center text-[#A1A1AA] text-[13px] leading-relaxed">
              Performance is better than <br/><span className="text-white font-semibold">71% of politicians</span> in Himachal Pradesh
            </p>
          </div>
        </div>

        {/* COLUMN 3: AT A GLANCE */}
        <div className="flex flex-col h-full">
          <div className="flex items-center mb-[16px] h-[24px]">
            <span className="text-[#A1A1AA] text-[12px] uppercase tracking-wider font-bold">At a Glance</span>
          </div>
          <div className="grid grid-cols-2 gap-[12px] flex-grow">
            {/* Promises */}
            <Link href="#promises" className="premium-card p-[16px] flex flex-col justify-center group hover:bg-white/[0.04] transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-[12px]">
                <ClipboardList className="w-[20px] h-[20px] text-[var(--color-accent-positive)] group-hover:scale-110 transition-transform" />
                <div className="text-white font-bold text-[20px]">{quickLook.promisesKept}/{quickLook.promisesTotal}</div>
              </div>
              <div className="text-[#A1A1AA] text-[13px] font-medium mb-[8px] group-hover:text-white transition-colors">Promises Delivered</div>
              <div className="w-full h-[4px] bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[var(--color-accent-positive)] rounded-full transition-all duration-[800ms]" style={{ width: `${quickLook.promisesTotal > 0 ? (quickLook.promisesKept / quickLook.promisesTotal) * 100 : 0}%` }} />
              </div>
            </Link>

            {/* Attendance */}
            <Link href="#performance" className="premium-card p-[16px] flex flex-col justify-center group hover:bg-white/[0.04] transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-[12px]">
                <User className="w-[20px] h-[20px] text-[var(--color-accent-positive)] group-hover:scale-110 transition-transform" />
                <div className="text-white font-bold text-[20px]">{quickLook.attendancePercent}%</div>
              </div>
              <div className="text-[#A1A1AA] text-[13px] font-medium mb-[4px] group-hover:text-white transition-colors">Attendance</div>
              <div className="text-[#A1A1AA] text-[11px]">Above Chamber Avg.</div>
            </Link>

            {/* Bills */}
            <Link href="#legislation" className="premium-card p-[16px] flex flex-col justify-center group hover:bg-white/[0.04] transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-[12px]">
                <Gavel className="w-[20px] h-[20px] text-[var(--color-accent-warning)] group-hover:scale-110 transition-transform" />
                <div className="text-white font-bold text-[20px]">{quickLook.billsIntroduced}</div>
              </div>
              <div className="text-[#A1A1AA] text-[13px] font-medium mb-[4px] group-hover:text-white transition-colors">Bills Introduced</div>
              <div className="text-[#A1A1AA] text-[11px]">{quickLook.billsPassed} Passed</div>
            </Link>

            {/* Legal */}
            <Link href="#cases" className="premium-card p-[16px] flex flex-col justify-center group hover:bg-white/[0.04] transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-[12px]">
                <Scale className="w-[20px] h-[20px] text-[#D97706] group-hover:scale-110 transition-transform" />
                <div className="text-white font-bold text-[20px]">{quickLook.legalCases}</div>
              </div>
              <div className="text-[#A1A1AA] text-[13px] font-medium mb-[4px] group-hover:text-white transition-colors">{quickLook.legalCases === 1 ? 'Legal Case Pending' : 'Legal Cases Pending'}</div>
              <div className="text-[#A1A1AA] text-[11px]">{quickLook.legalCases > 0 ? (politician.criminalCases.some(c => c.severity === 'heinous') ? 'Heinous Offenses Found' : 'Non-heinous') : 'Clear Record'}</div>
            </Link>

            {/* Net Worth */}
            <Link href="#financials" className="premium-card p-[16px] flex flex-col justify-center group hover:bg-white/[0.04] transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-[12px]">
                <IndianRupee className="w-[20px] h-[20px] text-[#818CF8] group-hover:scale-110 transition-transform" />
                <div className="text-white font-bold text-[20px]">{quickLook.netWorthCr}</div>
              </div>
              <div className="text-[#A1A1AA] text-[13px] font-medium mb-[4px] group-hover:text-white transition-colors">Net Worth ({politician.assetDeclarations?.[0]?.year || 'Latest'})</div>
              <div className="text-[#A1A1AA] text-[11px]">{(politician.assetDeclarations?.[0]?.growthPercent && politician.assetDeclarations[0].growthPercent > 0) ? `+${politician.assetDeclarations[0].growthPercent}%` : (politician.assetDeclarations?.[0]?.growthPercent || 0)}% vs prev cycle</div>
            </Link>

            {/* Public Trust */}
            <Link href="#performance" className="premium-card p-[16px] flex flex-col justify-center group hover:bg-white/[0.04] transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-[12px]">
                <Users className="w-[20px] h-[20px] text-[#60A5FA] group-hover:scale-110 transition-transform" />
                <div className="text-white font-bold text-[20px]">81%</div>
              </div>
              <div className="text-[#A1A1AA] text-[13px] font-medium mb-[4px] group-hover:text-white transition-colors">Public Trust Score</div>
              <div className="text-[#A1A1AA] text-[11px]">Based on surveys</div>
            </Link>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-[24px]">
        {/* AI SUMMARY */}
        <div className="premium-card p-[24px] flex items-center justify-between">
          <div className="flex-1 pr-[24px]">
             <div className="flex items-center gap-[8px] mb-[12px]">
               <Sparkles className="w-[16px] h-[16px] text-[#3B82F6]" />
               <span className="text-[#3B82F6] text-[12px] uppercase tracking-wider font-bold">AI Summary</span>
             </div>
             <div className="text-[#A1A1AA] text-[15px] leading-relaxed">
               {quickLook.verdictEn}
             </div>
          </div>
          <div className="shrink-0">
             <Link href={`/politicians/${politician.id}/executive-brief`} className="flex items-center justify-center border border-white/10 rounded-[8px] py-[10px] px-[20px] text-[#A1A1AA] text-[14px] font-medium hover:text-white hover:bg-white/5 transition-all duration-[220ms] whitespace-nowrap">
               Read Full Summary <span className="ml-[8px]">&gt;</span>
             </Link>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="premium-card p-[20px] grid grid-cols-2 gap-[12px]">
          <Link href="/compare" className="flex items-center gap-[16px] group p-[12px] rounded-xl hover:bg-white/[0.04] transition-all">
            <div className="w-[40px] h-[40px] rounded-full bg-white/[0.03] flex items-center justify-center border border-white/5 group-hover:border-[#3B82F6]/30 group-hover:bg-[#3B82F6]/10 transition-all">
              <Scale className="w-[18px] h-[18px] text-[#3B82F6] group-hover:text-[#60A5FA] transition-all" />
            </div>
            <div>
              <div className="text-white text-[14px] font-semibold mb-[2px]">Compare</div>
              <div className="text-[#A1A1AA] text-[12px]">Politicians</div>
            </div>
          </Link>
          
          <Link href="#timeline" className="flex items-center gap-[16px] group p-[12px] rounded-xl hover:bg-white/[0.04] transition-all">
            <div className="w-[40px] h-[40px] rounded-full bg-white/[0.03] flex items-center justify-center border border-white/5 group-hover:border-[var(--color-accent-positive)]/30 group-hover:bg-[var(--color-accent-positive)]/10 transition-all">
              <History className="w-[18px] h-[18px] text-[var(--color-accent-positive)] group-hover:text-green-400 transition-all" />
            </div>
            <div>
              <div className="text-white text-[14px] font-semibold mb-[2px]">View Timeline</div>
              <div className="text-[#A1A1AA] text-[12px]">Full Journey</div>
            </div>
          </Link>

          <Link href="#promises" className="flex items-center gap-[16px] group p-[12px] rounded-xl hover:bg-white/[0.04] transition-all">
            <div className="w-[40px] h-[40px] rounded-full bg-white/[0.03] flex items-center justify-center border border-white/5 group-hover:border-[var(--color-accent-negative)]/30 group-hover:bg-[var(--color-accent-negative)]/10 transition-all">
              <Target className="w-[18px] h-[18px] text-[var(--color-accent-negative)] group-hover:text-red-400 transition-all" />
            </div>
            <div>
              <div className="text-white text-[14px] font-semibold mb-[2px]">Promise Tracker</div>
              <div className="text-[#A1A1AA] text-[12px]">Detailed View</div>
            </div>
          </Link>

          <Link href="#sources" className="flex items-center gap-[16px] group p-[12px] rounded-xl hover:bg-white/[0.04] transition-all">
            <div className="w-[40px] h-[40px] rounded-full bg-white/[0.03] flex items-center justify-center border border-white/5 group-hover:border-[var(--color-accent-warning)]/30 group-hover:bg-[var(--color-accent-warning)]/10 transition-all">
              <FileText className="w-[18px] h-[18px] text-[var(--color-accent-warning)] group-hover:text-yellow-400 transition-all" />
            </div>
            <div>
              <div className="text-white text-[14px] font-semibold mb-[2px]">Sources</div>
              <div className="text-[#A1A1AA] text-[12px]">Evidence & Docs</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

