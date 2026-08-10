'use client';

import { useState } from 'react';
import { Politician, Bill } from '@/lib/types';
import {
  FileText,
  CheckCircle2,
  Hourglass,
  XCircle,
  FileMinus,
  Search,
  Filter,
  LayoutGrid,
  List,
  ChevronRight,
  ChevronDown,
  Droplet,
  Building2,
  FileCode,
  Shield,
  Car,
  Factory,
  Activity
} from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Pagination } from '@/components/ui/Pagination';

interface Props {
  politician: Politician;
  bills: Bill[];
}

const getBillType = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('cess') || t.includes('finance') || t.includes('money')) return 'Money Bill';
  if (t.includes('amendment')) return 'Amendment Bill';
  if (t.includes('private')) return 'Private Member Bill';
  return 'Ordinary Bill';
};

const getProgress = (status: string) => {
  switch (status) {
    case 'passed': return 100;
    case 'in_committee': return 60;
    case 'floor_vote': return 80;
    case 'introduced': return 40;
    case 'rejected':
    case 'withdrawn': return 20;
    default: return 0;
  }
};

const getStatusDisplay = (status: string) => {
  switch (status) {
    case 'passed': return { label: 'Passed', color: 'var(--color-accent-positive)', bg: 'bg-[var(--color-accent-positive)]/10' };
    case 'in_committee': return { label: 'In Committee', color: 'var(--color-accent-warning)', bg: 'bg-[var(--color-accent-warning)]/10' };
    case 'floor_vote': return { label: 'Floor Vote', color: '#3B82F6', bg: 'bg-[#3B82F6]/10' };
    case 'introduced': return { label: 'In Progress', color: '#3B82F6', bg: 'bg-[#3B82F6]/10' };
    case 'rejected': return { label: 'Not Passed', color: 'var(--color-accent-negative)', bg: 'bg-[var(--color-accent-negative)]/10' };
    case 'withdrawn': return { label: 'Withdrawn', color: '#8B5CF6', bg: 'bg-[#8B5CF6]/10' };
    default: return { label: status, color: '#A1A1AA', bg: 'bg-white/10' };
  }
};

const getBillTypeColor = (type: string) => {
  switch (type) {
    case 'Money Bill': return 'text-[var(--color-accent-positive)] bg-[var(--color-accent-positive)]/10';
    case 'Amendment Bill': return 'text-yellow-500 bg-yellow-500/10';
    case 'Ordinary Bill': return 'text-red-500 bg-red-500/10';
    case 'Private Member Bill': return 'text-purple-500 bg-purple-500/10';
    default: return 'text-white/60 bg-white/10';
  }
}

// Helper icons mapping based on keywords
const getBillIcon = (title: string, type: string) => {
  const t = title.toLowerCase();
  if (t.includes('water') || t.includes('cess')) return <Droplet className="w-[20px] h-[20px] text-[var(--color-accent-positive)]" />;
  if (t.includes('municipal') || t.includes('town')) return <Building2 className="w-[20px] h-[20px] text-yellow-500" />;
  if (t.includes('anti-social')) return <Shield className="w-[20px] h-[20px] text-red-500" />;
  if (t.includes('transport')) return <Car className="w-[20px] h-[20px] text-[var(--color-accent-positive)]" />;
  if (t.includes('investment') || t.includes('industry')) return <Factory className="w-[20px] h-[20px] text-purple-500" />;
  return <FileCode className="w-[20px] h-[20px] text-[#3B82F6]" />;
};

// Explicit column widths: Title(flex) | Type | Date | Status | Progress | LastUpdated | Actions
const BILLS_TABLE_GRID = 'grid-cols-[minmax(180px,1fr)_minmax(90px,110px)_minmax(100px,130px)_minmax(100px,130px)_minmax(70px,90px)_minmax(90px,110px)_48px]';

export function BillsTab({ politician, bills }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const shouldReduceMotion = useReducedMotion();
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(bills.length / ITEMS_PER_PAGE);
  const currentBills = bills.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (bills.length === 0) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 border border-white/10 p-12 text-center rounded-md bg-white/[0.02]">
        <h3 className="text-white font-bold mb-2">No Legislative Records</h3>
        <p className="text-[#A1A1AA] text-[13px]">No legislative records are currently available for this politician.</p>
      </div>
    );
  }

  const totalBills = bills.length;
  // Calculate stats based on generic assumptions if actual data is small
  // For the sake of matching the exact screenshot design, we will use accurate counts from the real mock data or fallbacks
  const passedBills = bills.filter(b => b.status === 'passed').length;
  const inProgressBills = bills.filter(b => ['introduced', 'in_committee', 'floor_vote'].includes(b.status)).length;
  const notPassedBills = bills.filter(b => b.status === 'rejected').length;
  const withdrawnBills = bills.filter(b => b.status === 'withdrawn').length;

  const passedPct = totalBills ? ((passedBills / totalBills) * 100).toFixed(1) : '0.0';
  const inProgressPct = totalBills ? ((inProgressBills / totalBills) * 100).toFixed(1) : '0.0';
  const notPassedPct = totalBills ? ((notPassedBills / totalBills) * 100).toFixed(1) : '0.0';
  const withdrawnPct = totalBills ? ((withdrawnBills / totalBills) * 100).toFixed(1) : '0.0';

  // Calculate Type stats
  let moneyCount = 0, amendmentCount = 0, ordinaryCount = 0, privateCount = 0;
  bills.forEach(b => {
    const type = getBillType(b.title);
    if (type === 'Money Bill') moneyCount++;
    else if (type === 'Amendment Bill') amendmentCount++;
    else if (type === 'Private Member Bill') privateCount++;
    else ordinaryCount++;
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-[16px] mb-[24px]">
        {/* Total Bills */}
        <div className="card-elevated p-[16px] flex items-center justify-between">
          <div>
            <div className="text-[#A1A1AA] text-[12px] font-medium mb-[8px]">Total Bills</div>
            <div className="text-white font-bold text-[28px] leading-none mb-[8px]">{totalBills}</div>
            <div className="text-[#A1A1AA] text-[10px] uppercase tracking-wider">Introduced / Sponsored</div>
          </div>
          <div className="w-[48px] h-[48px] rounded-sm bg-white/[0.05] border border-white/10 flex items-center justify-center">
            <FileText className="w-[24px] h-[24px] text-[var(--color-accent-positive)]" />
          </div>
        </div>

        {/* Passed */}
        <div className="card-elevated p-[16px] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-[16px]">
            <div className="w-[32px] h-[32px] rounded-full bg-[var(--color-accent-positive)]/10 border border-[var(--color-accent-positive)]/20 flex items-center justify-center">
              <CheckCircle2 className="w-[16px] h-[16px] text-[var(--color-accent-positive)]" />
            </div>
            <div className="text-[#A1A1AA] text-[12px]">Passed</div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-white font-bold text-[28px] leading-none">{passedBills}</div>
            <div className="text-[#A1A1AA] text-[11px] font-medium">{passedPct}%</div>
          </div>
        </div>

        {/* In Progress */}
        <div className="card-elevated p-[16px] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-[16px]">
            <div className="w-[32px] h-[32px] rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
              <Hourglass className="w-[16px] h-[16px] text-yellow-500" />
            </div>
            <div className="text-[#A1A1AA] text-[12px]">In Progress</div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-white font-bold text-[28px] leading-none">{inProgressBills}</div>
            <div className="text-[#A1A1AA] text-[11px] font-medium">{inProgressPct}%</div>
          </div>
        </div>

        {/* Not Passed */}
        <div className="card-elevated p-[16px] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-[16px]">
            <div className="w-[32px] h-[32px] rounded-full bg-[var(--color-accent-negative)]/10 border border-[var(--color-accent-negative)]/20 flex items-center justify-center">
              <XCircle className="w-[16px] h-[16px] text-[var(--color-accent-negative)]" />
            </div>
            <div className="text-[#A1A1AA] text-[12px]">Not Passed</div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-white font-bold text-[28px] leading-none">{notPassedBills}</div>
            <div className="text-[#A1A1AA] text-[11px] font-medium">{notPassedPct}%</div>
          </div>
        </div>

        {/* Withdrawn */}
        <div className="card-elevated p-[16px] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-[16px]">
            <div className="w-[32px] h-[32px] rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <FileMinus className="w-[16px] h-[16px] text-purple-500" />
            </div>
            <div className="text-[#A1A1AA] text-[12px]">Withdrawn</div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-white font-bold text-[28px] leading-none">{withdrawnBills}</div>
            <div className="text-[#A1A1AA] text-[11px] font-medium">{withdrawnPct}%</div>
          </div>
        </div>
      </div>

      {/* FILTERS BAR */}
      <div className="flex flex-col xl:flex-row gap-[16px] justify-between mb-[24px]">

        <div className="flex flex-wrap gap-[12px] flex-grow">
          <div className="relative max-w-[300px] w-full">
            <Search className="w-[14px] h-[14px] text-[#A1A1AA] absolute left-[12px] top-[10px]" />
            <input
              type="text"
              placeholder="Search laws or bills..."
              className="w-full bg-[#111111] border border-white/10 rounded-xs pl-[36px] pr-[12px] py-[8px] text-[13px] text-white focus:outline-none focus:border-white/20 transition-colors placeholder:text-white/20"
            />
          </div>

          <button className="flex items-center gap-[6px] px-[12px] py-[8px] rounded-xs border border-white/10 text-[#A1A1AA] text-[13px] hover:text-white bg-[#111111] hover:bg-white/[0.02] transition-colors">
            Status <ChevronDown className="w-[14px] h-[14px]" />
          </button>
          <button className="flex items-center gap-[6px] px-[12px] py-[8px] rounded-xs border border-white/10 text-[#A1A1AA] text-[13px] hover:text-white bg-[#111111] hover:bg-white/[0.02] transition-colors">
            Title <ChevronDown className="w-[14px] h-[14px]" />
          </button>
          <button className="flex items-center gap-[6px] px-[12px] py-[8px] rounded-xs border border-white/10 text-[#A1A1AA] text-[13px] hover:text-white bg-[#111111] hover:bg-white/[0.02] transition-colors">
            House <ChevronDown className="w-[14px] h-[14px]" />
          </button>
          <button className="flex items-center gap-[6px] px-[12px] py-[8px] rounded-xs border border-white/10 text-[#A1A1AA] text-[13px] hover:text-white bg-[#111111] hover:bg-white/[0.02] transition-colors">
            Year <ChevronDown className="w-[14px] h-[14px]" />
          </button>

          <button className="flex items-center gap-[6px] px-[12px] py-[8px] rounded-xs border border-white/10 text-[#A1A1AA] text-[13px] hover:text-white bg-[#111111] hover:bg-white/[0.02] transition-colors ml-auto xl:ml-0">
            More Filters <Filter className="w-[14px] h-[14px]" />
          </button>
        </div>

        <div className="flex items-center gap-[12px] shrink-0">
          <button className="flex items-center gap-[6px] px-[16px] py-[8px] rounded-xs border border-white/10 text-[#A1A1AA] text-[13px] hover:text-white bg-[#111111] hover:bg-white/[0.02] transition-colors">
            Sort by: Latest <ChevronDown className="w-[14px] h-[14px]" />
          </button>

          <div className="flex items-center rounded-xs border border-white/10 bg-[#111111] overflow-hidden">
            <button className="p-[8px] text-[var(--color-accent-positive)] hover:bg-white/5 transition-colors border-r border-white/10">
              <LayoutGrid className="w-[16px] h-[16px]" />
            </button>
            <button className="p-[8px] text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-colors">
              <List className="w-[16px] h-[16px]" />
            </button>
          </div>
        </div>

      </div>

      {/* TWO COLUMN MAIN CONTENT */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-[24px]">

        {/* LEFT MAIN TABLE */}
        <div className="card-elevated overflow-x-auto flex flex-col justify-between h-fit">
          <div className="min-w-[900px]">
            {/* Table Header */}
            <div className={clsx('grid gap-[16px] px-[24px] py-[16px] border-b border-white/5', BILLS_TABLE_GRID)}>
              <div className="text-[#A1A1AA] text-[11px] font-semibold tracking-wider">Bill / Act Name</div>
              <div className="text-[#A1A1AA] text-[11px] font-semibold tracking-wider">Type</div>
              <div className="text-[#A1A1AA] text-[11px] font-semibold tracking-wider">Introduced On</div>
              <div className="text-[#A1A1AA] text-[11px] font-semibold tracking-wider">Status</div>
              <div className="text-[#A1A1AA] text-[11px] font-semibold tracking-wider">Progress</div>
              <div className="text-[#A1A1AA] text-[11px] font-semibold tracking-wider">Last Updated</div>
              <div className="text-[#A1A1AA] text-[11px] font-semibold tracking-wider text-right">↗</div>
            </div>

            {/* Table Rows */}
            <div className="flex flex-col">
              <AnimatePresence mode="popLayout">
                {currentBills.map((bill, i) => {
                  const type = getBillType(bill.title);
                  const progress = getProgress(bill.status);
                  const statusMeta = getStatusDisplay(bill.status);

                  return (
                    <motion.div
                      key={bill.id}
                      layout={!shouldReduceMotion}
                      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.98 }}
                      transition={{ 
                        duration: shouldReduceMotion ? 0 : 0.25, 
                        delay: shouldReduceMotion ? 0 : i * 0.04,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                    >
                      <Link href={`/bills/${bill.id}`} className={clsx('grid gap-[16px] px-[24px] py-[20px] border-b border-white/5 hover:bg-white/[0.04] transition-colors items-center group', BILLS_TABLE_GRID)}>

                        {/* Bill Name */}
                        <div className="flex gap-[12px] items-start min-w-0">
                          <div className="w-[36px] h-[36px] shrink-0 rounded-sm bg-white/[0.02] border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-colors mt-[2px]">
                            {getBillIcon(bill.title, type)}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-white text-[13px] font-bold leading-snug mb-[4px] group-hover:text-[#3B82F6] transition-colors line-clamp-2">{bill.title}</h4>
                            <div className="text-[#A1A1AA] text-[11px]">Bill No. {bill.id.split('-').pop()} of 2023</div>
                          </div>
                        </div>

                        {/* Type */}
                        <div className="flex items-center">
                          <span className={clsx('px-[6px] py-[2px] rounded-sm text-[10px] font-bold whitespace-nowrap', getBillTypeColor(type))}>
                            {type}
                          </span>
                        </div>

                        {/* Introduced On */}
                        <div className="flex flex-col justify-center">
                          <span className="text-white text-[13px] font-bold">{new Date(bill.introducedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                          <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA] font-semibold">Introduced</span>
                        </div>

                        {/* Status */}
                        <div className="flex flex-col justify-center gap-[4px]">
                          <div className={clsx('w-fit px-[8px] py-[2px] rounded border border-current/20 text-[11px] font-bold', statusMeta.bg)} style={{ color: statusMeta.color }}>
                            {statusMeta.label}
                          </div>
                          <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA] font-semibold line-clamp-1">{bill.status === 'passed' ? 'Assented' : bill.status === 'rejected' ? 'House Dissolved' : 'Under Consideration'}</span>
                        </div>

                        {/* Progress */}
                        <div className="flex items-center gap-[8px]">
                          <div className="flex-1 h-[4px] bg-white/10 rounded-full overflow-hidden min-w-[30px]">
                            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%`, backgroundColor: statusMeta.color }} />
                          </div>
                          <span className="text-white text-[12px] font-bold tabular-nums shrink-0">{progress}%</span>
                        </div>

                        {/* Last Updated */}
                        <div className="flex items-center">
                          <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA] font-semibold">{new Date(bill.introducedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end">
                          <ChevronRight className="w-[16px] h-[16px] text-[#A1A1AA] group-hover:text-white transition-colors" />
                        </div>

                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-[24px] py-[16px] border-t border-white/5 bg-[#111111]/50">
              <div className="text-[#A1A1AA] text-[12px]">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, totalBills)} of {totalBills} bills
              </div>
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="flex flex-col gap-[24px]">

          {/* Bills by Current Status */}
          <div className="card-elevated p-[24px]">
            <h3 className="text-white text-[14px] font-bold mb-[24px]">Bills by Current Status</h3>
            <div className="flex items-center gap-[24px]">
              <div className="relative w-[100px] h-[100px] shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#8B5CF6" strokeWidth="18" strokeDasharray={`${(withdrawnPct ? parseFloat(withdrawnPct) : 0) / 100 * 220} 220`} strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#3B82F6" strokeWidth="18" strokeDasharray={`${(notPassedPct ? parseFloat(notPassedPct) : 0) / 100 * 220} 220`} strokeDashoffset={`-${(withdrawnPct ? parseFloat(withdrawnPct) : 0) / 100 * 220}`} />
                  <circle cx="50" cy="50" r="35" fill="none" stroke="var(--color-accent-warning)" strokeWidth="18" strokeDasharray={`${(inProgressPct ? parseFloat(inProgressPct) : 0) / 100 * 220} 220`} strokeDashoffset={`-${((withdrawnPct ? parseFloat(withdrawnPct) : 0) + (notPassedPct ? parseFloat(notPassedPct) : 0)) / 100 * 220}`} />
                  <circle cx="50" cy="50" r="35" fill="none" stroke="var(--color-accent-positive)" strokeWidth="18" strokeDasharray={`${(passedPct ? parseFloat(passedPct) : 0) / 100 * 220} 220`} strokeDashoffset={`-${((withdrawnPct ? parseFloat(withdrawnPct) : 0) + (notPassedPct ? parseFloat(notPassedPct) : 0) + (inProgressPct ? parseFloat(inProgressPct) : 0)) / 100 * 220}`} />
                </svg>
                <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] pointer-events-none" />
              </div>

              <div className="flex flex-col gap-[10px] w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[8px]">
                    <div className="w-[8px] h-[8px] bg-[var(--color-accent-positive)] rounded-sm" />
                    <span className="text-[#A1A1AA] text-[12px]">Passed</span>
                  </div>
                  <span className="text-white text-[12px]">{passedBills} <span className="text-[#A1A1AA] ml-1">({passedPct}%)</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[8px]">
                    <div className="w-[8px] h-[8px] bg-[var(--color-accent-warning)] rounded-sm" />
                    <span className="text-[#A1A1AA] text-[12px]">In Progress</span>
                  </div>
                  <span className="text-white text-[12px]">{inProgressBills} <span className="text-[#A1A1AA] ml-1">({inProgressPct}%)</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[8px]">
                    <div className="w-[8px] h-[8px] bg-[#3B82F6] rounded-sm" />
                    <span className="text-[#A1A1AA] text-[12px]">Not Passed</span>
                  </div>
                  <span className="text-white text-[12px]">{notPassedBills} <span className="text-[#A1A1AA] ml-1">({notPassedPct}%)</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[8px]">
                    <div className="w-[8px] h-[8px] bg-[#8B5CF6] rounded-sm" />
                    <span className="text-[#A1A1AA] text-[12px]">Withdrawn</span>
                  </div>
                  <span className="text-white text-[12px]">{withdrawnBills} <span className="text-[#A1A1AA] ml-1">({withdrawnPct}%)</span></span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-[24px] pt-[16px] border-t border-white/5">
              <span className="text-[#A1A1AA] text-[12px]">Total</span>
              <span className="text-[#A1A1AA] text-[12px]">{totalBills} Bills</span>
            </div>
          </div>

          {/* Bills by Type */}
          <div className="card-elevated p-[24px]">
            <h3 className="text-white text-[14px] font-bold mb-[24px]">Bills by Type</h3>
            <div className="flex flex-col gap-[20px]">

              <div className="flex items-center justify-between gap-[16px]">
                <span className="text-[#A1A1AA] text-[12px] w-[100px] shrink-0">Money Bill</span>
                <div className="w-full h-[6px] bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--color-accent-positive)] rounded-full" style={{ width: `${totalBills ? (moneyCount / totalBills) * 100 : 0}%` }} />
                </div>
                <span className="text-white text-[12px] w-[50px] text-right shrink-0">{moneyCount} <span className="text-[#A1A1AA] text-[10px]">({totalBills ? ((moneyCount / totalBills) * 100).toFixed(1) : 0}%)</span></span>
              </div>

              <div className="flex items-center justify-between gap-[16px]">
                <span className="text-[#A1A1AA] text-[12px] w-[100px] shrink-0">Amendment Bill</span>
                <div className="w-full h-[6px] bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${totalBills ? (amendmentCount / totalBills) * 100 : 0}%` }} />
                </div>
                <span className="text-white text-[12px] w-[50px] text-right shrink-0">{amendmentCount} <span className="text-[#A1A1AA] text-[10px]">({totalBills ? ((amendmentCount / totalBills) * 100).toFixed(1) : 0}%)</span></span>
              </div>

              <div className="flex items-center justify-between gap-[16px]">
                <span className="text-[#A1A1AA] text-[12px] w-[100px] shrink-0">Ordinary Bill</span>
                <div className="w-full h-[6px] bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#3B82F6] rounded-full" style={{ width: `${totalBills ? (ordinaryCount / totalBills) * 100 : 0}%` }} />
                </div>
                <span className="text-white text-[12px] w-[50px] text-right shrink-0">{ordinaryCount} <span className="text-[#A1A1AA] text-[10px]">({totalBills ? ((ordinaryCount / totalBills) * 100).toFixed(1) : 0}%)</span></span>
              </div>

              <div className="flex items-center justify-between gap-[16px]">
                <span className="text-[#A1A1AA] text-[12px] w-[100px] shrink-0">Private Member Bill</span>
                <div className="w-full h-[6px] bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#8B5CF6] rounded-full" style={{ width: `${totalBills ? (privateCount / totalBills) * 100 : 0}%` }} />
                </div>
                <span className="text-white text-[12px] w-[50px] text-right shrink-0">{privateCount} <span className="text-[#A1A1AA] text-[10px]">({totalBills ? ((privateCount / totalBills) * 100).toFixed(1) : 0}%)</span></span>
              </div>

            </div>
            <div className="flex items-center justify-between mt-[24px] pt-[16px] border-t border-white/5">
              <span className="text-[#A1A1AA] text-[12px]">Total</span>
              <span className="text-[#A1A1AA] text-[12px]">{totalBills} Bills</span>
            </div>
          </div>

          {/* Recent Legislative Activity */}
          <div className="card-elevated p-[24px]">
            <h3 className="text-white text-[14px] font-bold mb-[24px]">Recent Legislative Activity</h3>

            <div className="flex flex-col gap-[20px]">
              {bills.slice(0, 3).map((bill, index) => {
                const type = getBillType(bill.title);
                return (
                  <div key={bill.id + index} className="flex gap-[16px] items-start pb-[16px] border-b border-white/5 last:border-0 last:pb-0">
                    <div className={clsx("w-[32px] h-[32px] rounded-lg border flex items-center justify-center shrink-0 mt-[2px]", getStatusDisplay(bill.status).bg, `border-${getStatusDisplay(bill.status).color}/20`)}>
                      {getStatusDisplay(bill.status).label === 'Passed' ? <CheckCircle2 className="w-[16px] h-[16px]" style={{ color: getStatusDisplay(bill.status).color }} /> :
                        getStatusDisplay(bill.status).label === 'In Committee' ? <Hourglass className="w-[16px] h-[16px]" style={{ color: getStatusDisplay(bill.status).color }} /> :
                          <FileText className="w-[16px] h-[16px]" style={{ color: getStatusDisplay(bill.status).color }} />}
                    </div>
                    <div>
                      <h4 className="text-[#A1A1AA] text-[12px] leading-relaxed mb-[8px]">{bill.title} — {getStatusDisplay(bill.status).label}</h4>
                      <span className="text-[#52525B] text-[11px] font-medium">{new Date(bill.introducedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <span className="flex items-center gap-[4px] text-[var(--color-accent-positive)] text-[12px] font-medium mt-[24px] opacity-40 cursor-not-allowed" aria-disabled="true">
              View All Legislative Activity <ChevronRight className="w-[14px] h-[14px]" />
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
