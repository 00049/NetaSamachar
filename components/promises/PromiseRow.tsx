'use client';

import Link from 'next/link';
import { Promise as PromiseType } from '@/lib/types';
import { ChevronRight } from 'lucide-react';

interface Props {
  promise: PromiseType;
}

const getCompletionPercentage = (status: string): number => {
  switch (status) {
    case 'completed':
    case 'operational': return 100;
    case 'mostly_completed': return 75;
    case 'partially_completed': return 50;
    case 'in_progress':
    case 'construction_started':
    case 'implementation_started': return 25;
    case 'tender_issued': return 10;
    case 'planning': return 5;
    case 'delayed': return 25;
    default: return 0;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
    case 'operational':
      return 'text-[var(--color-accent-positive)] bg-[var(--color-accent-positive)]/10 border-[var(--color-accent-positive)]/20';
    case 'in_progress':
    case 'construction_started':
    case 'implementation_started':
    case 'tender_issued':
    case 'planning':
      return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    case 'mostly_completed':
    case 'partially_completed':
      return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    case 'delayed':
    case 'cancelled':
    case 'no_verified_progress':
      return 'text-[var(--color-accent-negative)] bg-[var(--color-accent-negative)]/10 border-[var(--color-accent-negative)]/20';
    default:
      return 'text-[#A1A1AA] bg-white/5 border-white/10';
  }
};

const formatStatusText = (status: string) => {
  return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export function PromiseRow({ promise }: Props) {
  const percentage = getCompletionPercentage(promise.status);
  const statusClasses = getStatusColor(promise.status);
  
  // Get latest timeline event
  const latestEvent = promise.timeline && promise.timeline.length > 0 
    ? [...promise.timeline].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;

  return (
    <Link 
      href={`/promises/${promise.id}`} 
      className="grid grid-cols-12 gap-[16px] py-[16px] border-b border-white/5 items-center hover:bg-white/[0.02] transition-colors group cursor-pointer"
    >
      {/* Promise Title */}
      <div className="col-span-4 pl-[24px]">
        <h4 className="text-white text-[14px] font-semibold line-clamp-2 pr-[16px]">{promise.title}</h4>
      </div>

      {/* Category */}
      <div className="col-span-2">
        <span className="text-[#A1A1AA] text-[13px]">{promise.category}</span>
      </div>

      {/* Status */}
      <div className="col-span-2">
        <span className={`inline-flex items-center px-[10px] py-[4px] rounded-full text-[11px] font-bold tracking-wide border ${statusClasses}`}>
          {formatStatusText(promise.status)}
        </span>
      </div>

      {/* Progress */}
      <div className="col-span-2 flex items-center gap-[12px]">
        <div className="w-full h-[4px] bg-white/5 rounded-full overflow-hidden max-w-[80px]">
          <div 
            className={`h-full rounded-full transition-all duration-[800ms] ${percentage === 100 ? 'bg-[var(--color-accent-positive)]' : percentage > 0 ? 'bg-yellow-500' : percentage === 0 && (promise.status === 'delayed' || promise.status === 'cancelled') ? 'bg-[var(--color-accent-negative)]' : 'bg-transparent'}`} 
            style={{ width: `${percentage}%` }} 
          />
        </div>
        <span className="text-white text-[12px] font-bold">{percentage}%</span>
      </div>

      {/* Timeline */}
      <div className="col-span-2 flex items-center justify-between pr-[24px]">
        <span className="text-[#A1A1AA] text-[12px] line-clamp-1 max-w-[120px]">
          {latestEvent ? latestEvent.description : 'No updates'}
        </span>
        <ChevronRight className="w-[16px] h-[16px] text-[#A1A1AA] group-hover:text-white transition-colors flex-shrink-0" />
      </div>
    </Link>
  );
}
