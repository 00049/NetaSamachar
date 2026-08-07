import { AlertTriangle, Info } from 'lucide-react';

interface Props {
  severity: 'heinous' | 'standard' | string;
}

export function CriminalCaseBadge({ severity }: Props) {
  const isHeinous = severity === 'heinous';

  return (
    <div className="relative group inline-flex items-center justify-center cursor-help pt-1">
      {isHeinous ? (
        <AlertTriangle className="w-3.5 h-3.5 text-[var(--color-accent-negative)]" aria-label="Heinous Offense" />
      ) : (
        <Info className="w-3.5 h-3.5 text-[var(--color-accent-warning)]" aria-label="Standard Offense" />
      )}
      
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] p-2 bg-[var(--bg-raised)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 text-[10px] text-[var(--text-secondary)] font-normal normal-case whitespace-normal">
        {isHeinous 
          ? 'Heinous Offense: Serious crimes including murder, rape, or kidnapping under IPC.' 
          : 'Standard Offense: Other charges filed under the Indian Penal Code.'}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-[var(--border-subtle)]"></div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[2px] border-[3px] border-transparent border-t-[var(--bg-raised)]"></div>
      </div>
    </div>
  );
}
