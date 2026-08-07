import clsx from 'clsx';
import { BillStatus } from '@/lib/types';

type AnyStatus = BillStatus | 'yes' | 'no' | 'absent' | string;

export interface StatusPillProps {
  status: AnyStatus;
  label?: string; // Optional override
  size?: 'sm' | 'md';
}

export function StatusPill({ status, label, size = 'sm' }: StatusPillProps) {
  let displayLabel = label || status;
  let color = '#A1A1AA'; // gray
  let bg = 'rgba(161,161,170,0.12)';

  switch (status) {
    // Bill statuses
    case 'introduced': 
      displayLabel = label || 'Introduced';
      color = '#60A5FA'; 
      bg = 'rgba(96,165,250,0.12)'; 
      break;
    case 'in_committee': 
      displayLabel = label || 'In Committee';
      color = '#FBBF24'; 
      bg = 'rgba(251,191,36,0.12)'; 
      break;
    case 'passed': 
      displayLabel = label || 'Passed';
      color = '#34D399'; 
      bg = 'rgba(52,211,153,0.12)'; 
      break;
    case 'rejected': 
      displayLabel = label || 'Rejected';
      color = '#F87171'; 
      bg = 'rgba(248,113,113,0.12)'; 
      break;
    case 'withdrawn': 
      displayLabel = label || 'Withdrawn';
      color = '#A1A1AA'; 
      bg = 'rgba(161,161,170,0.12)'; 
      break;
      
    // Vote statuses
    case 'yes':
      displayLabel = label || 'Yes';
      color = 'var(--accent-positive)';
      bg = 'rgba(52,211,153,0.12)';
      break;
    case 'no':
      displayLabel = label || 'No';
      color = 'var(--accent-negative)';
      bg = 'rgba(248,113,113,0.12)';
      break;
    case 'absent':
      displayLabel = label || 'Absent';
      color = '#A1A1AA';
      bg = 'rgba(161,161,170,0.12)';
      break;
  }

  return (
    <div 
      className={clsx(
        "inline-flex items-center gap-[6px] rounded-sm",
        size === 'sm' ? "h-[24px] px-[10px]" : "h-[28px] px-[12px]"
      )}
      style={{ backgroundColor: bg }}
    >
      <div 
        className={clsx("rounded-full flex-shrink-0", size === 'sm' ? "w-[6px] h-[6px]" : "w-[8px] h-[8px]")} 
        style={{ backgroundColor: color }} 
      />
      <span 
        className={clsx(
          "uppercase font-semibold tracking-[0.04em] leading-none mt-px",
          size === 'sm' ? "text-[11px]" : "text-xs"
        )} 
        style={{ color: color }}
      >
        {displayLabel}
      </span>
    </div>
  );
}
