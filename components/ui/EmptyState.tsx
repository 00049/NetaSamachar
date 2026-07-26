'use client';

import { SearchX } from 'lucide-react';

interface Props {
  onReset: () => void;
}

export function EmptyState({ onReset }: Props) {
  return (
    <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-[var(--border-subtle)] rounded-[var(--radius-sharp)] bg-[var(--bg-card)] w-full">
      <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center mb-6">
        <SearchX className="w-8 h-8 text-[var(--text-tertiary)]" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2 tracking-tight">
        No records matched
      </h3>
      <p className="text-[var(--text-secondary)] mb-8 max-w-sm leading-relaxed">
        No investigations or records match your current filter parameters. Try broadening your search criteria.
      </p>
      <button onClick={onReset} className="btn-secondary">
        Reset Filters
      </button>
    </div>
  );
}
