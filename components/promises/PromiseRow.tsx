'use client';

import Link from 'next/link';
import { Promise as PromiseType } from '@/lib/types';
import { ChevronRight } from 'lucide-react';
import { getCompletionPercentage, getStatusMeta } from '@/lib/promises';
import { PROMISE_TABLE_COLS } from '@/components/politicians/PromisesTab';
import clsx from 'clsx';

interface Props {
  promise: PromiseType;
}

export function PromiseRow({ promise }: Props) {
  const percentage = getCompletionPercentage(promise.status);
  const statusMeta = getStatusMeta(promise.status);
  
  // Get latest timeline event
  const latestEvent = promise.timeline && promise.timeline.length > 0 
    ? [...promise.timeline].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;

  return (
    <Link 
      href={`/promises/${promise.id}`} 
      className={clsx('grid gap-[16px] py-[16px] border-b border-white/5 items-center hover:bg-white/[0.02] transition-colors group cursor-pointer px-[24px]', PROMISE_TABLE_COLS)}
    >
      {/* Promise Title */}
      <div className="min-w-0">
        <h4 className="text-white text-[14px] font-semibold line-clamp-2 pr-[8px]">{promise.title}</h4>
      </div>

      {/* Category */}
      <div className="min-w-0">
        <span className="text-[10px] uppercase tracking-wider text-[#A1A1AA] font-semibold line-clamp-1">{promise.category.replace(/_/g, ' ')}</span>
      </div>

      {/* Status */}
      <div className="min-w-0">
        <span className={`inline-flex items-center px-[10px] py-[4px] rounded-full text-[11px] font-bold tracking-wide border ${statusMeta.tailwind}`}>
          {statusMeta.label}
        </span>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-[8px]">
        <div className="flex-1 h-[4px] bg-white/5 rounded-full overflow-hidden max-w-[60px]">
          <div 
            className={`h-full rounded-full transition-all duration-[800ms] ${percentage === 100 ? 'bg-[var(--color-accent-positive)]' : percentage > 0 ? 'bg-yellow-500' : percentage === 0 && (promise.status === 'delayed' || promise.status === 'cancelled') ? 'bg-[var(--color-accent-negative)]' : 'bg-transparent'}`} 
            style={{ width: `${percentage}%` }} 
          />
        </div>
        <span className="text-white text-[12px] font-bold tabular-nums">{percentage}%</span>
      </div>

      {/* Timeline */}
      <div className="flex items-center justify-between">
        <span 
          className="text-[10px] uppercase tracking-wider text-[#A1A1AA] font-semibold line-clamp-1 max-w-[120px]"
          title={latestEvent ? latestEvent.description : ''}
        >
          {latestEvent ? latestEvent.description : 'No updates'}
        </span>
        <ChevronRight className="w-[16px] h-[16px] text-[#A1A1AA] group-hover:text-white transition-colors flex-shrink-0" />
      </div>
    </Link>
  );
}
