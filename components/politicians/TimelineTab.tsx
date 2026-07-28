'use client';
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from 'react';
import { Politician, Promise as PromiseType } from '@/lib/types';
import { TimelineSpine } from '@/components/promises/TimelineSpine';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import clsx from 'clsx';

interface Props {
  politician: Politician;
  promises: PromiseType[];
}

export function TimelineTab({ politician, promises }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const promiseIdParam = searchParams.get('promiseId');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (promises.length === 0) return;
    
    if (promiseIdParam && promises.some(p => p.id === promiseIdParam)) {
      setSelectedId(promiseIdParam);
    } else if (!selectedId) {
      setSelectedId(promises[0].id);
    }
  }, [promiseIdParam, promises, selectedId]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    // Optionally update the URL without triggering a full page reload
    const params = new URLSearchParams(searchParams.toString());
    params.set('promiseId', id);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (!promises || promises.length === 0) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 border border-[var(--border-subtle)] p-12 text-center">
        <h3 className="text-[var(--text-primary)] font-bold mb-2">No Promises Tracked</h3>
        <p className="text-[var(--text-tertiary)] text-sm">There are no tracked promises for {politician.name} to generate a timeline from.</p>
      </div>
    );
  }

  const selectedPromise = promises.find(p => p.id === selectedId) || promises[0];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] mb-6">
          Promise Timelines
        </h2>
        
        {/* Horizontal scrollable chip row */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 mask-fade-edges">
          {promises.map(promise => (
            <button
              key={promise.id}
              onClick={() => handleSelect(promise.id)}
              className={clsx(
                "flex-shrink-0 h-[36px] px-[16px] rounded-[18px] text-[13px] font-semibold transition-all duration-200 border",
                selectedId === promise.id
                  ? "bg-[var(--text-primary)] text-[var(--bg-base)] border-[var(--text-primary)]"
                  : "bg-transparent text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-white/30 hover:text-[var(--text-primary)]"
              )}
            >
              {promise.title}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] rounded-[4px] p-6 md:p-10">
        <div className="mb-8 border-b border-[rgba(255,255,255,0.08)] pb-8">
          <h3 className="font-serif font-bold text-2xl text-[var(--text-primary)] mb-3">
            {selectedPromise.title}
          </h3>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            {selectedPromise.fullStatement}
          </p>
        </div>

        <TimelineSpine promise={selectedPromise} />
      </div>
    </div>
  );
}
