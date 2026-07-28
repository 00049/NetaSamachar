'use client';

import { Politician } from '@/lib/types';
import { QuickLookData } from '@/lib/scoring';
import { BadgeCheck, MapPin, Calendar, Clock, Award, Info, ClipboardList, User, Gavel, IndianRupee, Users, Sparkles, Scale, History, Target, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  politician: Politician;
  quickLook: QuickLookData;
}

export function PoliticianHero({ politician, quickLook }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[340px_1fr_360px] gap-[32px] mb-12">
      
      {/* COLUMN 1: PORTRAIT & DETAILS (340px) */}
      <div className="flex flex-col gap-[24px]">
        {/* Portrait Card */}
        <div className="relative overflow-hidden rounded-[24px] w-full h-[400px] bg-[var(--color-base)] transition-all duration-[220ms] ease-[cubic-bezier(.22,1,.36,1)] hover:translate-y-[-2px]">
          <div className="absolute inset-0 z-0">
            <Image
              src={politician.photoUrl}
              alt={politician.name}
              fill
              className="object-cover object-top opacity-90"
              sizes="(max-width: 1280px) 100vw, 340px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/40 to-transparent" />
          </div>
          <div className="absolute bottom-[24px] left-[24px] z-10">
            <div className="flex items-center gap-[8px] px-[16px] py-[8px] rounded-[20px] bg-black/60 backdrop-blur-md border border-white/10 apple-label text-white/90">
              <BadgeCheck className="w-4 h-4 text-[var(--color-accent-positive)]" />
              Verified Identity
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="premium-card p-[24px] flex flex-col flex-grow">
          <div className="flex items-center gap-[8px] mb-[8px]">
            <h1 className="apple-title text-2xl">{politician.name}</h1>
            <BadgeCheck className="w-5 h-5 text-[#3B82F6]" />
          </div>
          <p className="apple-card-title text-[#A1A1AA] mb-[24px]">Chief Minister, Himachal Pradesh</p>

          <div className="flex items-center gap-[16px] mb-[32px]">
            <div className="w-[40px] h-[40px] flex items-center justify-center">
              <Image src="/images/parties/inc.png" alt="INC" width={40} height={40} className="object-contain" />
            </div>
            <div>
              <div className="apple-card-title leading-tight">Indian National Congress</div>
              <div className="apple-label mt-[4px]">INC</div>
            </div>
          </div>

          <div className="flex items-center gap-[8px] apple-body mb-[32px]">
            <MapPin className="w-5 h-5" />
            <span>{politician.constituency} Constituency, H.P.</span>
          </div>

          <div className="grid grid-cols-2 gap-[16px] border-t border-white/10 pt-[24px]">
            <div>
              <div className="flex items-center gap-[8px] apple-meta mb-[8px]">
                <Calendar className="w-4 h-4" /> Age
              </div>
              <div className="apple-card-title">60 Years</div>
            </div>
            <div>
              <div className="flex items-center gap-[8px] apple-meta mb-[8px]">
                <Clock className="w-4 h-4" /> Since
              </div>
              <div className="apple-card-title">2003</div>
            </div>
          </div>
        </div>
      </div>

      {/* COLUMN 2: EXECUTIVE BRIEF & AT A GLANCE (1fr) */}
      <div className="flex flex-col gap-[24px]">
        {/* Executive Intelligence Brief */}
        <div className="premium-card p-[24px] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-[8px] mb-[16px]">
              <Sparkles className="w-[16px] h-[16px] text-[#3B82F6]" />
              <span className="apple-label text-[#3B82F6]">
                Executive Intelligence Brief
              </span>
            </div>
            <div className="apple-body leading-relaxed">
              Sukhvinder Singh Sukhu has shown strong legislative participation and excellent attendance record. 
              He has delivered on 50% of his key promises so far. One legal case is pending in court. 
              His financial disclosures are transparent and within normative limits.
            </div>
          </div>
          <div className="flex justify-end mt-[16px]">
            <Link href="#overview" className="border border-white/10 rounded-[8px] py-[8px] px-[16px] apple-label text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-all duration-[220ms] whitespace-nowrap">
              Read Full Brief &gt;
            </Link>
          </div>
        </div>

        {/* At a Glance Grid */}
        <div className="flex flex-col flex-grow">
          <div className="flex items-center mb-[16px]">
            <span className="apple-label">At a Glance</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px] flex-grow">
            
            {/* Promises */}
            <div className="premium-card !p-[20px] flex flex-col justify-between">
              <div className="flex items-center gap-[16px]">
                <ClipboardList className="w-[20px] h-[20px] text-[var(--color-accent-positive)]" />
                <div className="apple-metric !text-xl">{quickLook.promisesKept}/{quickLook.promisesTotal}</div>
              </div>
              <div className="mt-[20px]">
                <div className="apple-meta mb-[12px]">Promises Delivered</div>
                <div className="w-full h-[4px] bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--color-accent-positive)] rounded-full transition-all duration-[800ms]" style={{ width: `${(quickLook.promisesKept / quickLook.promisesTotal) * 100}%` }} />
                </div>
              </div>
            </div>

            {/* Attendance */}
            <div className="premium-card !p-[20px] flex flex-col justify-between">
              <div className="flex items-center gap-[16px]">
                <User className="w-[20px] h-[20px] text-[var(--color-accent-positive)]" />
                <div className="apple-metric !text-xl">{quickLook.attendancePercent}%</div>
              </div>
              <div className="mt-[20px]">
                <div className="apple-meta mb-[4px]">Attendance</div>
                <div className="apple-label opacity-70">Above Chamber Avg.</div>
              </div>
            </div>

            {/* Bills */}
            <div className="premium-card !p-[20px] flex flex-col justify-between">
              <div className="flex items-center gap-[16px]">
                <Gavel className="w-[20px] h-[20px] text-[var(--color-accent-warning)]" />
                <div className="apple-metric !text-xl">{quickLook.billsIntroduced}</div>
              </div>
              <div className="mt-[20px]">
                <div className="apple-meta mb-[4px]">Bills Introduced</div>
                <div className="apple-label opacity-70">{quickLook.billsPassed} Passed</div>
              </div>
            </div>

            {/* Legal */}
            <div className="premium-card !p-[20px] flex flex-col justify-between">
              <div className="flex items-center gap-[16px]">
                <Gavel className="w-[20px] h-[20px] text-[#D97706]" />
                <div className="apple-metric !text-xl">{quickLook.legalCases}</div>
              </div>
              <div className="mt-[20px]">
                <div className="apple-meta mb-[4px]">Legal Case Pending</div>
                <div className="apple-label opacity-70">Non-heinous</div>
              </div>
            </div>

            {/* Net Worth */}
            <div className="premium-card !p-[20px] flex flex-col justify-between">
              <div className="flex items-center gap-[16px]">
                <IndianRupee className="w-[20px] h-[20px] text-[#818CF8]" />
                <div className="apple-metric !text-xl">{quickLook.netWorthCr}</div>
              </div>
              <div className="mt-[20px]">
                <div className="apple-meta mb-[4px]">Net Worth (2022)</div>
                <div className="apple-label opacity-70">+21.8% vs 2017</div>
              </div>
            </div>

            {/* Public Trust */}
            <div className="premium-card !p-[20px] flex flex-col justify-between">
              <div className="flex items-center gap-[16px]">
                <Users className="w-[20px] h-[20px] text-[#60A5FA]" />
                <div className="apple-metric !text-xl">81%</div>
              </div>
              <div className="mt-[20px]">
                <div className="apple-meta mb-[4px]">Public Trust Score</div>
                <div className="apple-label opacity-70">Based on surveys</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* COLUMN 3: PERFORMANCE SCORE & QUICK LINKS (360px) */}
      <div className="flex flex-col gap-[24px]">
        {/* Performance Score */}
        <div className="premium-card p-[24px] flex flex-col items-center justify-between h-[400px]">
          <div className="w-full flex items-center justify-between mb-[16px]">
            <span className="apple-label">Overall Performance Score</span>
            <Info className="w-[24px] h-[24px] text-[#A1A1AA]" />
          </div>

          <div className="flex flex-col items-center justify-center flex-grow w-full mt-4">
            <div className="relative w-[180px] h-[180px] flex flex-col items-center justify-center mb-[24px]">
              {/* SVG Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                <circle
                  cx="50" cy="50" r="46" fill="none"
                  stroke="var(--color-accent-positive)" strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${(quickLook.score.value / 100) * 289} 289`}
                  className="transition-all duration-1000 ease-[cubic-bezier(.22,1,.36,1)]"
                />
              </svg>
              <div className="flex items-baseline mt-[8px]">
                <span className="apple-title leading-none" style={{ fontSize: '48px' }}>{quickLook.score.value}</span>
                <span className="apple-card-title text-[#A1A1AA] ml-[4px]">/100</span>
              </div>
            </div>
            <div className="apple-label text-[var(--color-accent-positive)] mt-2">
              {quickLook.score.label}
            </div>
          </div>

          <p className="text-center apple-body mt-[32px]">
            Performance is better than <span className="font-bold text-white">71%</span> of politicians in Himachal Pradesh
          </p>
        </div>

        {/* Quick Links */}
        <div className="premium-card p-[24px] flex-grow grid grid-cols-2 gap-x-[16px] gap-y-[16px]">
          <Link href="/compare" className="flex flex-col gap-[12px] group p-4 border border-white/5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-all">
            <div className="w-[36px] h-[36px] rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#3B82F6]/20 transition-all">
              <Scale className="w-[16px] h-[16px] text-[#3B82F6] group-hover:text-white transition-all" />
            </div>
            <div>
              <div className="apple-card-title text-[14px] mb-[2px]">Compare</div>
              <div className="apple-meta">Politicians</div>
            </div>
          </Link>
          
          <Link href="#timeline" className="flex flex-col gap-[12px] group p-4 border border-white/5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-all">
            <div className="w-[36px] h-[36px] rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[var(--color-accent-positive)]/20 transition-all">
              <History className="w-[16px] h-[16px] text-[var(--color-accent-positive)] group-hover:text-white transition-all" />
            </div>
            <div>
              <div className="apple-card-title text-[14px] mb-[2px]">Timeline</div>
              <div className="apple-meta">Full Journey</div>
            </div>
          </Link>

          <Link href="#promises" className="flex flex-col gap-[12px] group p-4 border border-white/5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-all">
            <div className="w-[36px] h-[36px] rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[var(--color-accent-negative)]/20 transition-all">
              <Target className="w-[16px] h-[16px] text-[var(--color-accent-negative)] group-hover:text-white transition-all" />
            </div>
            <div>
              <div className="apple-card-title text-[14px] mb-[2px]">Tracker</div>
              <div className="apple-meta">Detailed View</div>
            </div>
          </Link>

          <Link href="#sources" className="flex flex-col gap-[12px] group p-4 border border-white/5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-all">
            <div className="w-[36px] h-[36px] rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[var(--color-accent-warning)]/20 transition-all">
              <FileText className="w-[16px] h-[16px] text-[var(--color-accent-warning)] group-hover:text-white transition-all" />
            </div>
            <div>
              <div className="apple-card-title text-[14px] mb-[2px]">Sources</div>
              <div className="apple-meta">Evidence & Docs</div>
            </div>
          </Link>
        </div>
      </div>

    </div>
  );
}
