'use client';

import { Politician, Party } from '@/lib/types';
import { QuickLookData } from '@/lib/scoring';
import { IntelligenceOverview } from './IntelligenceOverview';
import { BadgeCheck, MapPin, Calendar, Clock, Award, Info, ClipboardList, User, Gavel, IndianRupee, Users, Sparkles, Scale, History, Target, FileText, GraduationCap } from 'lucide-react';
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
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,300px)_1fr_minmax(280px,400px)] gap-[24px]">
        {/* COLUMN 1: PORTRAIT */}
        <div className="relative overflow-hidden rounded-lg w-full h-full min-h-[400px] bg-[var(--bg-base)] transition-all duration-[220ms] hover:translate-y-[-2px]">
          <div className="absolute inset-0 z-0">
            <Image
              src={politician.photoUrl}
              alt={politician.name}
              fill
              className="object-cover object-top opacity-90"
              sizes="(max-width: 1280px) 100vw, 300px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)] via-[var(--bg-base)]/40 to-transparent" />
          </div>
          <div className="absolute bottom-[24px] left-[24px] z-10">
            <div className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[12px] font-bold text-[var(--color-accent-positive)] uppercase tracking-wider">
              <BadgeCheck className="w-4 h-4" />
              VERIFIED IDENTITY
            </div>
          </div>
        </div>

        {/* COLUMN 2: DETAILS & SCORE */}
        <div className="card-elevated p-[32px] flex flex-col md:flex-row gap-[32px]">
          {/* Left: Details */}
          <div className="flex-1 flex flex-col justify-between border-r border-white/10 pr-[32px]">
            <div>
              <div className="flex items-center gap-[8px] mb-[4px]">
                <h1 className="text-3xl font-bold text-white break-words min-w-0">{politician.name}</h1>
                <BadgeCheck className="w-6 h-6 text-[#3B82F6]" />
              </div>
              <p className="text-[#A1A1AA] text-[16px] font-medium mb-[24px] break-words min-w-0">{politician.position}, {politician.state}</p>

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

            <div className="mt-[24px] bg-white/[0.03] border border-white/10 rounded-sm p-[16px] flex items-center justify-between">
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
              <span className="flex items-center gap-1 group relative cursor-help">
                Overall Performance Score
                <Info className="w-[14px] h-[14px]" aria-hidden="true" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[220px] p-3 bg-[var(--bg-raised)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 text-[11px] text-[var(--text-secondary)] font-normal normal-case tracking-normal">
                  Score = (Promises Fulfilled × 40) + (Attendance × 30) + (Legislation × 20) + (Transparency × 10). Higher = better accountability record.
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-[var(--border-subtle)]"></div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[2px] border-[3px] border-transparent border-t-[var(--bg-raised)]"></div>
                </div>
              </span>
            </div>

            <div className="relative w-[180px] h-[180px] flex flex-col items-center justify-center mb-[24px]">
              <svg
                role="img"
                aria-label={`Overall performance score: ${quickLook.score.value} out of 100`}
                className="absolute inset-0 w-full h-full -rotate-90 transform"
                viewBox="0 0 100 100"
              >
                <title>{`Overall performance score: ${quickLook.score.value} / 100`}</title>
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
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

          </div>
        </div>

        {/* COLUMN 3: AT A GLANCE */}
        <div className="flex flex-col h-full">
          <div className="flex items-center mb-[16px] h-[24px]">
            <span className="text-[#A1A1AA] text-[12px] uppercase tracking-wider font-bold">At a Glance</span>
          </div>
          <div className="grid grid-cols-2 gap-[8px] flex-grow">
            {/* Promises */}
            <Link href="#promises" className="card-elevated p-[12px] flex flex-col justify-center group hover:bg-white/[0.04] transition-all cursor-pointer min-w-0">
              <div className="flex items-center justify-between mb-[10px] gap-[4px]">
                <ClipboardList className="w-[18px] h-[18px] shrink-0 text-[var(--color-accent-positive)] group-hover:scale-110 transition-transform" />
                <div className="text-white font-bold text-[18px] tabular-nums">{quickLook.promisesKept}/{quickLook.promisesTotal}</div>
              </div>
              <div className="text-[#A1A1AA] text-[12px] font-medium mb-[8px] group-hover:text-white transition-colors leading-tight">Promises Delivered</div>
              <div className="w-full h-[4px] bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[var(--color-accent-positive)] rounded-full transition-all duration-[800ms]" style={{ width: `${quickLook.promisesTotal > 0 ? (quickLook.promisesKept / quickLook.promisesTotal) * 100 : 0}%` }} />
              </div>
            </Link>

            {/* Attendance */}
            <Link href="#performance" className="card-elevated p-[12px] flex flex-col justify-center group hover:bg-white/[0.04] transition-all cursor-pointer min-w-0">
              <div className="flex items-center justify-between mb-[10px] gap-[4px]">
                <User className="w-[18px] h-[18px] shrink-0 text-[var(--color-accent-positive)] group-hover:scale-110 transition-transform" />
                <div className="text-white font-bold text-[18px] tabular-nums">{quickLook.attendancePercent}%</div>
              </div>
              <div className="text-[#A1A1AA] text-[12px] font-medium mb-[2px] group-hover:text-white transition-colors leading-tight">Attendance</div>
              <div className="text-[#A1A1AA] text-[10px]">Above Chamber Avg.</div>
            </Link>

            {/* Bills */}
            <Link href="#legislation" className="card-elevated p-[12px] flex flex-col justify-center group hover:bg-white/[0.04] transition-all cursor-pointer min-w-0">
              <div className="flex items-center justify-between mb-[10px] gap-[4px]">
                <Gavel className="w-[18px] h-[18px] shrink-0 text-[var(--color-accent-warning)] group-hover:scale-110 transition-transform" />
                <div className="text-white font-bold text-[18px] tabular-nums">{quickLook.billsIntroduced}</div>
              </div>
              <div className="text-[#A1A1AA] text-[12px] font-medium mb-[2px] group-hover:text-white transition-colors leading-tight">Bills Introduced</div>
              <div className="text-[#A1A1AA] text-[10px]">{quickLook.billsPassed} Passed</div>
            </Link>

            {/* Legal */}
            <Link href="#cases" className="card-elevated p-[12px] flex flex-col justify-center group hover:bg-white/[0.04] transition-all cursor-pointer min-w-0">
              <div className="flex items-center justify-between mb-[10px] gap-[4px]">
                <Scale className="w-[18px] h-[18px] shrink-0 text-[#D97706] group-hover:scale-110 transition-transform" />
                <div className="text-white font-bold text-[18px] tabular-nums">{quickLook.legalCases}</div>
              </div>
              <div className="text-[#A1A1AA] text-[12px] font-medium mb-[2px] group-hover:text-white transition-colors leading-tight">{quickLook.legalCases === 1 ? 'Legal Case' : 'Legal Cases'}</div>
              <div className="text-[#A1A1AA] text-[10px]">{quickLook.legalCases > 0 ? (politician.criminalCases.some(c => c.severity === 'heinous') ? 'Heinous Offenses' : 'Non-heinous') : 'Clear Record'}</div>
            </Link>

            {/* Net Worth */}
            <Link href="#financials" className="card-elevated p-[12px] flex flex-col justify-center group hover:bg-white/[0.04] transition-all cursor-pointer min-w-0">
              <div className="flex items-center justify-between mb-[10px] gap-[4px]">
                <IndianRupee className="w-[18px] h-[18px] shrink-0 text-[#818CF8] group-hover:scale-110 transition-transform" />
                <div className="text-white font-bold text-[18px] tabular-nums truncate max-w-[80px]">{quickLook.netWorthCr || '—'}</div>
              </div>
              <div className="text-[#A1A1AA] text-[12px] font-medium mb-[2px] group-hover:text-white transition-colors leading-tight">Net Worth ({politician.assetDeclarations?.[0]?.year || 'N/A'})</div>
              <div className="text-[#A1A1AA] text-[11px]">
                {(() => {
                  const percent = politician.assetDeclarations?.[0]?.growthPercent;
                  if (!percent) return '0%';
                  return percent > 0 ? `+${percent}%` : `${percent}%`;
                })()} vs prev cycle
              </div>            </Link>

            {/* Education Level */}
            <div className="card-elevated p-[12px] flex flex-col justify-center group hover:bg-white/[0.04] transition-all min-w-0">
              <div className="flex items-center mb-[6px]">
                <GraduationCap className="w-[18px] h-[18px] shrink-0 text-[#60A5FA] group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-white font-bold text-[12px] leading-tight line-clamp-2 mb-[4px]" title={politician.education}>{politician.education || '—'}</div>
              <div className="text-[#A1A1AA] text-[12px] font-medium mb-[2px] group-hover:text-white transition-colors leading-tight">Education</div>
              <div className="text-[#A1A1AA] text-[11px]">Highest Qualification</div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-[24px]">
        {/* AI SUMMARY / INTELLIGENCE OVERVIEW */}
        <IntelligenceOverview politicianId={politician.id} />

        {/* QUICK LINKS */}
        <div className="card-elevated p-[20px] grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-[8px]">
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

