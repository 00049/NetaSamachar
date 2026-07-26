'use client';

import { AlertCircle } from 'lucide-react';

interface Props {
  onRetry: () => void;
  message?: string;
}

export function ErrorState({ onRetry, message = "Unable to fetch data from primary sources. Please try again." }: Props) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-[var(--accent-negative)]/30 rounded-[var(--radius-sharp)] bg-[var(--bg-card)] w-full">
      <div className="flex items-center gap-3 mb-4 text-[var(--accent-negative)]">
        <AlertCircle className="w-5 h-5" />
        <h3 className="text-sm font-semibold uppercase tracking-widest">
          Fetch Error
        </h3>
      </div>
      <p className="text-[var(--text-secondary)] mb-8 max-w-sm leading-relaxed text-sm">
        {message}
      </p>
      <button 
        onClick={onRetry} 
        className="btn-secondary hover:!border-[var(--accent-negative)] transition-colors"
      >
        Retry Connection
      </button>
    </div>
  );
}
