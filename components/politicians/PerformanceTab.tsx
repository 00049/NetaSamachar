'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

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
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col gap-[24px]">
      


      {/* 3-COLUMN CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
        
        {/* CHART 1: Legislative Activity */}
        <div className="card-elevated p-[24px] flex flex-col">
          <div className="flex items-center justify-between mb-[8px]">
            <div className="flex items-center gap-[6px]">
              <h3 className="text-white text-[13px] font-bold uppercase tracking-wider">Legislative Activity Over Time</h3>
            </div>
          </div>
          <p className="text-[#A1A1AA] text-[13px] mb-[32px]">Overview of bills introduced and participation in the legislative assembly.</p>
          
          <div className="flex-grow flex items-center justify-center pb-[32px] pt-[24px]">
            <span className="text-[#A1A1AA] text-[13px]">Historical data is currently being verified.</span>
          </div>

          <div className="mt-auto border-t border-white/5 pt-[16px]">
            <Link href="#legislation" className="w-full flex items-center justify-center gap-[8px] text-[13px] text-[#A1A1AA] hover:text-white transition-colors py-[8px] bg-white/[0.02] hover:bg-white/[0.05] rounded-lg">
              View Full Legislative Timeline <ChevronRight className="w-[14px] h-[14px]" />
            </Link>
          </div>
        </div>

        {/* CHART 2: Bills By Status */}
        <div className="card-elevated p-[24px] flex flex-col">
          <div className="flex items-center gap-[6px] mb-[8px]">
            <h3 className="text-white text-[13px] font-bold uppercase tracking-wider">Bills By Status</h3>
            <Info className="w-[14px] h-[14px] text-[#A1A1AA]" />
          </div>
          <p className="text-[#A1A1AA] text-[13px] mb-[40px]">Breakdown of all bills introduced.</p>
          
          <div className="flex-grow flex items-center justify-center gap-[32px] pb-[32px]">
            <div className="relative w-[180px] h-[180px]">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {/* Pending (80%) */}
                <motion.circle 
                  cx="50" cy="50" r="42" fill="none" stroke="#EAB308" strokeWidth="8" className="drop-shadow-md"
                  initial={{ strokeDasharray: "0 264" }}
                  whileInView={{ strokeDasharray: `${quickLook.billsIntroduced > 0 ? ((quickLook.billsIntroduced - quickLook.billsPassed) / quickLook.billsIntroduced) * 264 : 0} 264` }}
                  viewport={{ once: true }}
                  transition={{ duration: shouldReduceMotion ? 0 : 1, ease: [0.22, 1, 0.36, 1] }}
                />
                {/* Passed (20%) */}
                <motion.circle 
                  cx="50" cy="50" r="42" fill="none" stroke="var(--color-accent-positive)" strokeWidth="8" className="drop-shadow-md"
                  initial={{ strokeDasharray: "0 264", strokeDashoffset: 0 }}
                  whileInView={{ 
                    strokeDasharray: `${quickLook.billsIntroduced > 0 ? (quickLook.billsPassed / quickLook.billsIntroduced) * 264 : 0} 264`,
                    strokeDashoffset: `-${quickLook.billsIntroduced > 0 ? ((quickLook.billsIntroduced - quickLook.billsPassed) / quickLook.billsIntroduced) * 264 : 0}`
                  }}
                  viewport={{ once: true }}
                  transition={{ duration: shouldReduceMotion ? 0 : 1, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-white font-bold text-[32px] leading-none tabular-nums">{quickLook.billsIntroduced}</span>
                <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA] font-semibold mt-[4px]">Total Bills</span>
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
        <div className="card-elevated p-[24px] flex flex-col">
          <div className="flex items-center justify-between mb-[8px]">
            <div className="flex items-center gap-[6px]">
              <h3 className="text-white text-[13px] font-bold uppercase tracking-wider">Assembly Attendance</h3>
            </div>
          </div>
          <p className="text-[#A1A1AA] text-[13px] mb-[40px]">Attendance record vs. chamber average.</p>
          
          <div className="flex-grow flex items-end justify-between px-[16px] pb-[40px] pt-[16px] relative h-[200px]">
             {/* Grid lines */}
             <div className="absolute inset-0 z-0 flex flex-col justify-between pointer-events-none pb-[40px]">
               <div className="flex items-center w-full">
                 <span className="text-[#A1A1AA] text-[10px] tracking-wider w-[32px] shrink-0 text-right mr-[8px] tabular-nums font-semibold">100%</span>
                 <div className="w-full h-[1px] border-b border-solid border-white/5"></div>
               </div>
               <div className="flex items-center w-full">
                 <span className="text-[#A1A1AA] text-[10px] tracking-wider w-[32px] shrink-0 text-right mr-[8px] tabular-nums font-semibold">75%</span>
                 <div className="w-full h-[1px] border-b border-solid border-white/5"></div>
               </div>
               <div className="flex items-center w-full">
                 <span className="text-[#A1A1AA] text-[10px] tracking-wider w-[32px] shrink-0 text-right mr-[8px] tabular-nums font-semibold">50%</span>
                 <div className="w-full h-[1px] border-b border-solid border-white/5"></div>
               </div>
               <div className="flex items-center w-full">
                 <span className="text-[#A1A1AA] text-[10px] tracking-wider w-[32px] shrink-0 text-right mr-[8px] tabular-nums font-semibold">25%</span>
                 <div className="w-full h-[1px] border-b border-solid border-white/5"></div>
               </div>
               <div className="flex items-center w-full">
                 <span className="text-[#A1A1AA] text-[10px] tracking-wider w-[32px] shrink-0 text-right mr-[8px] tabular-nums font-semibold">0%</span>
                 <div className="w-full h-[1px] border-b border-solid border-white/10"></div>
               </div>
             </div>

             <div className="relative z-10 flex w-full h-full pb-[40px] pl-[40px] justify-center items-end">
                <motion.div 
                  className="flex flex-col items-center w-[60px] relative group" 
                  initial={{ height: "0%" }}
                  whileInView={{ height: `${politician.attendancePercent}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: shouldReduceMotion ? 0 : 1, ease: [0.22, 1, 0.36, 1] }}
                >
                   <div className="absolute -top-[24px] text-white font-bold text-[14px] tabular-nums">{politician.attendancePercent}%</div>
                   <div className="w-full h-full bg-gradient-to-t from-[var(--color-accent-positive)]/20 to-[var(--color-accent-positive)]/90 rounded-t-[4px] border-t-2 border-[var(--color-accent-positive)]" />
                   <div className="absolute -bottom-[24px] text-[10px] uppercase tracking-wider text-[#A1A1AA] font-semibold whitespace-nowrap text-center">{politician.name.split(' ')[0]}</div>
                </motion.div>
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
      <div className="card-elevated p-[24px] grid grid-cols-1 sm:grid-cols-3 gap-[24px] sm:divide-x sm:divide-white/10">
        
        <div className="flex gap-[16px] items-center min-w-0">
          <Users className="w-[32px] h-[32px] text-[#A1A1AA] shrink-0" />
          <div className="min-w-0">
            <div className="text-white font-bold text-[18px] tabular-nums">{politician.attendancePercent}%</div>
            <div className="text-[#A1A1AA] text-[12px] mt-[2px]">Overall Attendance</div>
            <div className="text-[var(--color-accent-positive)] text-[11px] font-semibold mt-[2px]">Above Average</div>
          </div>
        </div>

        <div className="flex gap-[16px] items-center sm:pl-[24px] min-w-0">
          <Mic className="w-[32px] h-[32px] text-[#A1A1AA] shrink-0" />
          <div className="min-w-0">
            <div className="text-white font-bold text-[18px] tabular-nums">{politician.questionsRaised}</div>
            <div className="text-[#A1A1AA] text-[12px] mt-[2px]">Questions Asked</div>
          </div>
        </div>

        <div className="flex gap-[16px] items-center sm:pl-[24px] min-w-0">
          <FileText className="w-[32px] h-[32px] text-[#A1A1AA] shrink-0" />
          <div className="min-w-0">
            <div className="text-white font-bold text-[18px] tabular-nums">{politician.debatesParticipated}</div>
            <div className="text-[#A1A1AA] text-[12px] mt-[2px]">Debates Participated</div>
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
      </div>

    </div>
  );
}
