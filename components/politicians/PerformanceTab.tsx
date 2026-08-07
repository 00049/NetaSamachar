'use client';

import Link from 'next/link';

import { Politician } from '@/lib/types';
import { QuickLookData } from '@/lib/scoring';
import { 
  ClipboardList, 
  User, 
  Gavel, 
  Scale, 
  IndianRupee, 
  Users, 
  ChevronDown, 
  ChevronRight, 
  Mic, 
  MessageSquare, 
  FileText, 
  Clock,
  Info,
  Lightbulb,
  MapPin,
  GraduationCap
} from 'lucide-react';

interface Props {
  politician: Politician;
  quickLook: QuickLookData;
}

export function PerformanceTab({ politician, quickLook }: Props) {
  return (
    <div className="flex flex-col gap-[24px]">
      
      {/* 6-CARD GRID (AT A GLANCE) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-[16px]">
        {/* Promises */}
        <Link href="#promises" className="premium-card p-[16px] flex flex-col justify-center group hover:bg-white/[0.04] transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-[12px]">
            <ClipboardList className="w-[24px] h-[24px] text-[var(--color-accent-positive)] group-hover:scale-110 transition-transform" />
            <div className="text-white font-bold text-[24px]">{quickLook.promisesKept}/{quickLook.promisesTotal}</div>
          </div>
          <div className="text-[#A1A1AA] text-[13px] font-medium mb-[8px] group-hover:text-white transition-colors">Promises Delivered</div>
          <div className="w-full h-[4px] bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-[var(--color-accent-positive)] rounded-full transition-all duration-[800ms]" style={{ width: `${quickLook.promisesTotal > 0 ? (quickLook.promisesKept / quickLook.promisesTotal) * 100 : 0}%` }} />
          </div>
        </Link>

        {/* Attendance */}
        <Link href="#performance" className="premium-card p-[16px] flex flex-col justify-center group hover:bg-white/[0.04] transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-[12px]">
            <User className="w-[24px] h-[24px] text-[var(--color-accent-positive)] group-hover:scale-110 transition-transform" />
            <div className="text-white font-bold text-[24px]">{quickLook.attendancePercent}%</div>
          </div>
          <div className="text-[#A1A1AA] text-[13px] font-medium mb-[4px] group-hover:text-white transition-colors">Attendance</div>
          <div className="text-[#A1A1AA] text-[11px]">Above Chamber Avg.</div>
        </Link>

        {/* Bills */}
        <Link href="#legislation" className="premium-card p-[16px] flex flex-col justify-center group hover:bg-white/[0.04] transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-[12px]">
            <Gavel className="w-[24px] h-[24px] text-[var(--color-accent-warning)] group-hover:scale-110 transition-transform" />
            <div className="text-white font-bold text-[24px]">{quickLook.billsIntroduced}</div>
          </div>
          <div className="text-[#A1A1AA] text-[13px] font-medium mb-[4px] group-hover:text-white transition-colors">Bills Introduced</div>
          <div className="text-[#A1A1AA] text-[11px]">{quickLook.billsPassed} Passed</div>
        </Link>

        {/* Legal */}
        <Link href="#cases" className="premium-card p-[16px] flex flex-col justify-center group hover:bg-white/[0.04] transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-[12px]">
            <Scale className="w-[24px] h-[24px] text-[#D97706] group-hover:scale-110 transition-transform" />
            <div className="text-white font-bold text-[24px]">{quickLook.legalCases}</div>
          </div>
          <div className="text-[#A1A1AA] text-[13px] font-medium mb-[4px] group-hover:text-white transition-colors">{quickLook.legalCases === 1 ? 'Legal Case Pending' : 'Legal Cases Pending'}</div>
          <div className="text-[#A1A1AA] text-[11px]">{quickLook.legalCases > 0 ? (politician.criminalCases.some(c => c.severity === 'heinous') ? 'Heinous Offenses Found' : 'Non-heinous') : 'Clear Record'}</div>
        </Link>

        {/* Net Worth */}
        <Link href="#financials" className="premium-card p-[16px] flex flex-col justify-center group hover:bg-white/[0.04] transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-[12px]">
            <IndianRupee className="w-[24px] h-[24px] text-[#818CF8] group-hover:scale-110 transition-transform" />
            <div className="text-white font-bold text-[24px]">{quickLook.netWorthCr}</div>
          </div>
          <div className="text-[#A1A1AA] text-[13px] font-medium mb-[4px] group-hover:text-white transition-colors">Net Worth ({politician.assetDeclarations?.[0]?.year || 'Latest'})</div>
          <div className="text-[#A1A1AA] text-[11px]">{(politician.assetDeclarations?.[0]?.growthPercent && politician.assetDeclarations[0].growthPercent > 0) ? `+${politician.assetDeclarations[0].growthPercent}%` : (politician.assetDeclarations?.[0]?.growthPercent || 0)}% vs prev cycle</div>
        </Link>

        {/* Education Level */}
        <div className="premium-card p-[16px] flex flex-col justify-center group hover:bg-white/[0.04] transition-all">
          <div className="flex items-center justify-between mb-[8px]">
            <GraduationCap className="w-[24px] h-[24px] text-[#60A5FA] group-hover:scale-110 transition-transform shrink-0" />
          </div>
          <div className="text-white font-bold text-[14px] leading-tight line-clamp-2 mb-[4px]" title={politician.education}>{politician.education}</div>
          <div className="text-[#A1A1AA] text-[13px] font-medium mb-[4px] group-hover:text-white transition-colors">Education Level</div>
          <div className="text-[#A1A1AA] text-[11px]">Highest Qualification</div>
        </div>
      </div>

      {/* 3-COLUMN CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
        
        {/* CHART 1: Legislative Activity */}
        <div className="premium-card p-[24px] flex flex-col">
          <div className="flex items-center justify-between mb-[8px]">
            <div className="flex items-center gap-[6px]">
              <h3 className="text-white text-[13px] font-bold uppercase tracking-wider">Legislative Activity Over Time</h3>
              <Info className="w-[14px] h-[14px] text-[#A1A1AA]" />
            </div>
            <button className="flex items-center gap-[6px] px-[12px] py-[4px] rounded-full border border-white/10 text-[#A1A1AA] text-[12px] hover:text-white transition-colors">
              All Years <ChevronDown className="w-[14px] h-[14px]" />
            </button>
          </div>
          <p className="text-[#A1A1AA] text-[13px] mb-[32px]">Overview of bills introduced and participation in the legislative assembly.</p>
          
          <div className="flex items-center gap-[16px] mb-[24px] text-[12px] text-[#A1A1AA]">
            <div className="flex items-center gap-[6px]">
              <div className="w-[8px] h-[8px] rounded-full bg-[var(--color-accent-positive)]" /> Bills Introduced
            </div>
            <div className="flex items-center gap-[6px]">
              <div className="w-[8px] h-[8px] rounded-full bg-[#3B82F6]" /> Bills Passed
            </div>
          </div>

          <div className="flex-grow flex items-end justify-center pb-[32px] pt-[24px]">
            {/* SVG Line Chart (Mock) */}
            <svg width="100%" height="180" viewBox="0 0 400 180" className="overflow-visible">
              {/* Y-axis lines */}
              <line x1="20" y1="20" x2="400" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="20" y1="60" x2="400" y2="60" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="20" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="20" y1="140" x2="400" y2="140" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="20" y1="180" x2="400" y2="180" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

              {/* Y-axis labels */}
              <text x="10" y="24" fill="#A1A1AA" fontSize="12" textAnchor="end">8</text>
              <text x="10" y="64" fill="#A1A1AA" fontSize="12" textAnchor="end">6</text>
              <text x="10" y="104" fill="#A1A1AA" fontSize="12" textAnchor="end">4</text>
              <text x="10" y="144" fill="#A1A1AA" fontSize="12" textAnchor="end">2</text>
              <text x="10" y="184" fill="#A1A1AA" fontSize="12" textAnchor="end">0</text>

              {/* X-axis labels */}
              <text x="40" y="205" fill="#A1A1AA" fontSize="12" textAnchor="middle">2022</text>
              <text x="130" y="205" fill="#A1A1AA" fontSize="12" textAnchor="middle">2023</text>
              <text x="220" y="205" fill="#A1A1AA" fontSize="12" textAnchor="middle">2024</text>
              <text x="310" y="205" fill="#A1A1AA" fontSize="12" textAnchor="middle">2025</text>
              <text x="380" y="205" fill="#A1A1AA" fontSize="12" textAnchor="middle">2026 (YTD)</text>

              {/* Data Lines */}
              {/* Bills Passed (Blue) */}
              <path d="M 40 160 L 130 160 L 220 160 L 310 160 L 380 160" fill="none" stroke="#3B82F6" strokeWidth="2" />
              {/* Bills Introduced (Green) */}
              <path d="M 40 140 L 130 120 L 220 140 L 310 100 L 380 140" fill="none" stroke="var(--color-accent-positive)" strokeWidth="2" />

              {/* Data Points */}
              {/* Blue Points */}
              <circle cx="40" cy="160" r="4" fill="#3B82F6" />
              <circle cx="130" cy="160" r="4" fill="#3B82F6" />
              <circle cx="220" cy="160" r="4" fill="#3B82F6" />
              <circle cx="310" cy="160" r="4" fill="#3B82F6" />
              <circle cx="380" cy="160" r="4" fill="#3B82F6" />
              <text x="310" y="152" fill="#3B82F6" fontSize="12" textAnchor="middle">0</text>

              {/* Green Points */}
              <circle cx="40" cy="140" r="4" fill="var(--color-accent-positive)" />
              <circle cx="130" cy="120" r="4" fill="var(--color-accent-positive)" />
              <circle cx="220" cy="140" r="4" fill="var(--color-accent-positive)" />
              <circle cx="310" cy="100" r="4" fill="var(--color-accent-positive)" />
              <circle cx="380" cy="140" r="4" fill="var(--color-accent-positive)" />
              
              <text x="40" y="132" fill="var(--color-accent-positive)" fontSize="12" textAnchor="middle">1</text>
              <text x="130" y="112" fill="var(--color-accent-positive)" fontSize="12" textAnchor="middle">2</text>
              <text x="220" y="132" fill="var(--color-accent-positive)" fontSize="12" textAnchor="middle">1</text>
              <text x="310" y="92" fill="var(--color-accent-positive)" fontSize="12" textAnchor="middle">3</text>
              <text x="380" y="132" fill="var(--color-accent-positive)" fontSize="12" textAnchor="middle">1</text>
            </svg>
          </div>

          <div className="mt-auto border-t border-white/5 pt-[16px]">
            <Link href="#legislation" className="w-full flex items-center justify-center gap-[8px] text-[13px] text-[#A1A1AA] hover:text-white transition-colors py-[8px] bg-white/[0.02] hover:bg-white/[0.05] rounded-lg">
              View Full Legislative Timeline <ChevronRight className="w-[14px] h-[14px]" />
            </Link>
          </div>
        </div>

        {/* CHART 2: Bills By Status */}
        <div className="premium-card p-[24px] flex flex-col">
          <div className="flex items-center gap-[6px] mb-[8px]">
            <h3 className="text-white text-[13px] font-bold uppercase tracking-wider">Bills By Status</h3>
            <Info className="w-[14px] h-[14px] text-[#A1A1AA]" />
          </div>
          <p className="text-[#A1A1AA] text-[13px] mb-[40px]">Breakdown of all bills introduced.</p>
          
          <div className="flex-grow flex items-center justify-center gap-[32px] pb-[32px]">
            <div className="relative w-[180px] h-[180px]">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {/* Pending (80%) */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#EAB308" strokeWidth="12" strokeDasharray={`${quickLook.billsIntroduced > 0 ? ((quickLook.billsIntroduced - quickLook.billsPassed) / quickLook.billsIntroduced) * 251 : 0} 251`} className="drop-shadow-sm" />
                {/* Passed (20%) */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-accent-positive)" strokeWidth="12" strokeDasharray={`${quickLook.billsIntroduced > 0 ? (quickLook.billsPassed / quickLook.billsIntroduced) * 251 : 0} 251`} strokeDashoffset={`-${quickLook.billsIntroduced > 0 ? ((quickLook.billsIntroduced - quickLook.billsPassed) / quickLook.billsIntroduced) * 251 : 0}`} className="drop-shadow-sm" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-white font-bold text-[32px] leading-none">{quickLook.billsIntroduced}</span>
                <span className="text-[#A1A1AA] text-[12px] font-semibold mt-[4px]">Total Bills</span>
              </div>
            </div>

            <div className="flex flex-col gap-[16px]">
              <div className="flex items-center gap-[12px]">
                <div className="w-[8px] h-[8px] rounded-full bg-[var(--color-accent-positive)]" />
                <span className="text-white text-[14px]">Passed</span>
                <span className="text-[#A1A1AA] text-[13px] ml-[auto]">{quickLook.billsPassed} ({quickLook.billsIntroduced > 0 ? Math.round((quickLook.billsPassed / quickLook.billsIntroduced) * 100) : 0}%)</span>
              </div>
              <div className="flex items-center gap-[12px]">
                <div className="w-[8px] h-[8px] rounded-full bg-[#EAB308]" />
                <span className="text-white text-[14px]">Pending</span>
                <span className="text-[#A1A1AA] text-[13px] ml-[auto]">{quickLook.billsIntroduced - quickLook.billsPassed} ({quickLook.billsIntroduced > 0 ? Math.round(((quickLook.billsIntroduced - quickLook.billsPassed) / quickLook.billsIntroduced) * 100) : 0}%)</span>
              </div>
              <div className="flex items-center gap-[12px]">
                <div className="w-[8px] h-[8px] rounded-full bg-[var(--color-accent-negative)]" />
                <span className="text-white text-[14px]">Rejected</span>
                <span className="text-[#A1A1AA] text-[13px] ml-[auto]">0 (0%)</span>
              </div>
            </div>
          </div>

          <div className="mt-auto border-t border-white/5 pt-[16px]">
            <button className="w-full flex items-center justify-center gap-[8px] text-[13px] text-[#A1A1AA] hover:text-white transition-colors py-[8px] bg-white/[0.02] hover:bg-white/[0.05] rounded-lg">
              View All Bills <ChevronRight className="w-[14px] h-[14px]" />
            </button>
          </div>
        </div>

        {/* CHART 3: Assembly Attendance */}
        <div className="premium-card p-[24px] flex flex-col">
          <div className="flex items-center justify-between mb-[8px]">
            <div className="flex items-center gap-[6px]">
              <h3 className="text-white text-[13px] font-bold uppercase tracking-wider">Assembly Attendance</h3>
              <Info className="w-[14px] h-[14px] text-[#A1A1AA]" />
            </div>
            <button className="flex items-center gap-[6px] px-[12px] py-[4px] rounded-full border border-white/10 text-[#A1A1AA] text-[12px] hover:text-white transition-colors">
              All Years <ChevronDown className="w-[14px] h-[14px]" />
            </button>
          </div>
          <p className="text-[#A1A1AA] text-[13px] mb-[40px]">Attendance record vs. chamber average.</p>
          
          <div className="flex-grow flex items-end justify-between px-[16px] pb-[40px] pt-[16px] relative h-[200px]">
             {/* Grid lines */}
             <div className="absolute inset-0 z-0 flex flex-col justify-between pointer-events-none pb-[40px]">
               <div className="flex items-center w-full">
                 <span className="text-[#A1A1AA] text-[11px] w-[32px] shrink-0 text-right mr-[8px]">100%</span>
                 <div className="w-full h-[1px] bg-white/[0.05] border-b border-dashed border-white/10"></div>
               </div>
               <div className="flex items-center w-full">
                 <span className="text-[#A1A1AA] text-[11px] w-[32px] shrink-0 text-right mr-[8px]">75%</span>
                 <div className="w-full h-[1px] bg-white/[0.05] border-b border-dashed border-white/10"></div>
               </div>
               <div className="flex items-center w-full">
                 <span className="text-[#A1A1AA] text-[11px] w-[32px] shrink-0 text-right mr-[8px]">50%</span>
                 <div className="w-full h-[1px] bg-white/[0.05] border-b border-dashed border-white/10"></div>
               </div>
               <div className="flex items-center w-full">
                 <span className="text-[#A1A1AA] text-[11px] w-[32px] shrink-0 text-right mr-[8px]">25%</span>
                 <div className="w-full h-[1px] bg-white/[0.05] border-b border-dashed border-white/10"></div>
               </div>
               <div className="flex items-center w-full">
                 <span className="text-[#A1A1AA] text-[11px] w-[32px] shrink-0 text-right mr-[8px]">0%</span>
                 <div className="w-full h-[1px] bg-white/[0.1]"></div>
               </div>
             </div>

             <div className="relative z-10 flex w-full h-full pb-[40px] pl-[40px] justify-around items-end">
                <div className="flex flex-col items-center h-[95%] w-[40px] relative group" style={{ height: `${politician.attendancePercent}%` }}>
                   <div className="absolute -top-[24px] text-white font-bold text-[14px]">{politician.attendancePercent}%</div>
                   <div className="w-full h-full bg-gradient-to-t from-[var(--color-accent-positive)]/40 to-[var(--color-accent-positive)] rounded-t-[4px]" />
                   <div className="absolute -bottom-[24px] text-[#A1A1AA] text-[11px] whitespace-nowrap text-center">{politician.name}</div>
                </div>
                
                <div className="flex flex-col items-center h-[79%] w-[40px] relative group">
                   <div className="absolute -top-[24px] text-white font-bold text-[14px]">79%</div>
                   <div className="w-full h-full bg-gradient-to-t from-white/5 to-white/20 rounded-t-[4px]" />
                   <div className="absolute -bottom-[24px] text-[#A1A1AA] text-[11px] whitespace-nowrap text-center">Chamber Average</div>
                </div>
             </div>
          </div>

          <div className="mt-auto border-t border-white/5 pt-[16px]">
            <button className="w-full flex items-center justify-center gap-[8px] text-[13px] text-[#A1A1AA] hover:text-white transition-colors py-[8px] bg-white/[0.02] hover:bg-white/[0.05] rounded-lg">
              View Attendance Details <ChevronRight className="w-[14px] h-[14px]" />
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER STATS BAR */}
      <div className="premium-card p-[24px] grid grid-cols-2 lg:grid-cols-3 gap-[24px] divide-x divide-white/10">
        
        <div className="flex gap-[16px] items-center">
          <Users className="w-[32px] h-[32px] text-[#A1A1AA]" />
          <div>
            <div className="text-white font-bold text-[18px]">{politician.attendancePercent}%</div>
            <div className="text-[#A1A1AA] text-[12px] mt-[2px]">Overall Attendance</div>
            <div className="text-[var(--color-accent-positive)] text-[11px] font-semibold mt-[2px]">Above Average</div>
          </div>
        </div>

        <div className="flex gap-[16px] items-center pl-[24px]">
          <Mic className="w-[32px] h-[32px] text-[#A1A1AA]" />
          <div>
            <div className="text-white font-bold text-[18px]">{politician.questionsRaised}</div>
            <div className="text-[#A1A1AA] text-[12px] mt-[2px]">Questions Asked</div>
            <div className="text-[var(--color-accent-positive)] text-[11px] font-semibold mt-[2px] cursor-pointer hover:underline">View Details</div>
          </div>
        </div>

        <div className="flex gap-[16px] items-center pl-[24px]">
          <FileText className="w-[32px] h-[32px] text-[#A1A1AA]" />
          <div>
            <div className="text-white font-bold text-[18px]">{politician.debatesParticipated}</div>
            <div className="text-[#A1A1AA] text-[12px] mt-[2px]">Debates Participated</div>
            <div className="text-[var(--color-accent-positive)] text-[11px] font-semibold mt-[2px] cursor-pointer hover:underline">View Details</div>
          </div>
        </div>

      </div>

      {/* FOOTER NOTE */}
      <div className="flex items-center justify-between py-[16px] px-[24px] bg-[#131722]/50 border border-white/5 rounded-md mt-[-8px]">
        <div className="flex items-center gap-[12px]">
          <Lightbulb className="w-[16px] h-[16px] text-yellow-500" />
          <span className="text-[#A1A1AA] text-[13px]">
            <span className="font-bold text-yellow-500 mr-[4px]">Note:</span> 
            Performance metrics are based on public records and may not include all recent activities.
          </span>
        </div>
        <div className="flex items-center gap-[6px] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer">
          <span className="text-[13px] font-medium">How we calculate</span>
          <Info className="w-[14px] h-[14px]" />
        </div>
      </div>

    </div>
  );
}
