'use client';

import { useState, useMemo } from 'react';
import { Politician, VoteRecord } from '@/lib/types';
import { ArrowUpDown, Check, X, Minus, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { StatusPill } from '@/components/ui/StatusPill';

interface Props {
  politician: Politician;
  votes: VoteRecord[];
}

type SortField = 'date' | 'bill';
type SortOrder = 'asc' | 'desc';

export function VotingRecordTab({ politician, votes }: Props) {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showDivergentOnly, setShowDivergentOnly] = useState(false);

  const filteredAndSortedVotes = useMemo(() => {
    let result = [...(votes || [])];

    if (showDivergentOnly) {
      result = result.filter(v => v.vote !== 'absent' && v.vote !== v.partyPosition);
    }

    result.sort((a, b) => {
      if (sortField === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        const titleA = a.billTitle.toLowerCase();
        const titleB = b.billTitle.toLowerCase();
        if (titleA < titleB) return sortOrder === 'asc' ? -1 : 1;
        if (titleA > titleB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      }
    });

    return result;
  }, [votes, sortField, sortOrder, showDivergentOnly]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder(field === 'date' ? 'desc' : 'asc');
    }
  };

  if (!votes || votes.length === 0) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 border border-[var(--border-subtle)] p-12 text-center">
        <h3 className="text-[var(--text-primary)] font-bold mb-2">No Voting Records Found</h3>
        <p className="text-[var(--text-tertiary)] text-sm">There are no verifiable voting records for {politician.name} in our database.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)]">
          Legislative Voting Record
        </h2>
        
        <label 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setShowDivergentOnly(!showDivergentOnly)}
        >
          <div className={clsx(
            "w-10 h-5 rounded-full transition-colors relative",
            showDivergentOnly ? "bg-[var(--accent-info)]" : "bg-white/10"
          )}>
            <div className={clsx(
              "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform",
              showDivergentOnly && "translate-x-5"
            )} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] group-hover:text-white transition-colors">
            Show only divergent votes
          </span>
        </label>
      </div>

      {/* Table container */}
      <div className="w-full overflow-x-auto border border-[var(--border-subtle)] bg-[var(--bg-base)] rounded-[4px] mb-8">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] bg-[rgba(255,255,255,0.02)] text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">
              <th 
                className="px-6 py-4 cursor-pointer hover:text-[var(--text-secondary)] transition-colors group"
                onClick={() => toggleSort('bill')}
              >
                <div className="flex items-center gap-2">
                  Bill
                  <ArrowUpDown className={clsx(
                    "w-3 h-3 transition-colors",
                    sortField === 'bill' ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100"
                  )} />
                </div>
              </th>
              <th className="px-6 py-4">Vote</th>
              <th 
                className="px-6 py-4 cursor-pointer hover:text-[var(--text-secondary)] transition-colors group"
                onClick={() => toggleSort('date')}
              >
                <div className="flex items-center gap-2">
                  Date
                  <ArrowUpDown className={clsx(
                    "w-3 h-3 transition-colors",
                    sortField === 'date' ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100"
                  )} />
                </div>
              </th>
              <th className="px-6 py-4">Party Position</th>
              <th className="px-6 py-4 text-center">Match</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedVotes.map((vote, idx) => {
              const isEven = idx % 2 === 0;
              
              let matchIcon = <Minus className="w-4 h-4 text-[var(--text-tertiary)] mx-auto" />;
              if (vote.vote !== 'absent') {
                if (vote.vote === vote.partyPosition) {
                  matchIcon = <Check className="w-4 h-4 text-[var(--accent-positive)] mx-auto" />;
                } else {
                  matchIcon = <X className="w-4 h-4 text-[var(--accent-negative)] mx-auto" />;
                }
              }

              return (
                <tr 
                  key={vote.id} 
                  className={clsx(
                    "border-b border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.04)] transition-colors",
                    isEven ? "bg-[rgba(255,255,255,0.02)]" : "bg-transparent",
                    "last:border-0"
                  )}
                >
                  <td className="px-6 py-5">
                    <Link 
                      href={`?tab=bills`} // Ideally ?tab=bills&billId=${vote.billId} if we support expanding specific bills
                      className="text-[var(--text-primary)] font-serif font-semibold text-base hover:text-[var(--accent-info)] hover:underline line-clamp-1"
                    >
                      {vote.billTitle}
                    </Link>
                  </td>
                  <td className="px-6 py-5">
                    <StatusPill status={vote.vote} size="md" />
                  </td>
                  <td className="px-6 py-5 text-sm text-[var(--text-secondary)]">
                    {new Date(vote.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                  </td>
                  <td className="px-6 py-5">
                    <StatusPill status={vote.partyPosition} size="md" />
                  </td>
                  <td className="px-6 py-5">
                    {matchIcon}
                  </td>
                </tr>
              );
            })}
            
            {filteredAndSortedVotes.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-[var(--text-tertiary)] italic font-serif">
                  No voting records match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <a 
          href="https://sansad.in/ls" // Using a generic placeholder for the official parliament portal
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--text-tertiary)] hover:text-[var(--accent-info)] hover:underline transition-colors"
        >
          Official Parliament Voting Record
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  );
}
