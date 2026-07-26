import { STATUS_CONFIG, POLICY_CATEGORIES } from '@/lib/utils';
import { PromiseStatus, PolicyCategory } from '@/lib/types';
import clsx from 'clsx';

interface StatusBadgeProps {
  status: PromiseStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function StatusBadge({ status, size = 'md', showIcon = true }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  
  return (
    <div className={clsx(
      'inline-flex items-center gap-2 border',
      config.colorClass,
      {
        'px-2 py-1 text-[10px]': size === 'sm',
        'px-3 py-1.5 text-xs': size === 'md',
        'px-4 py-2 text-sm': size === 'lg',
      }
    )}>
      {showIcon && <span>{config.icon}</span>}
      <span className="font-bold uppercase tracking-wider">{config.label}</span>
    </div>
  );
}

interface CategoryBadgeProps {
  category: PolicyCategory;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function CategoryBadge({ category, size = 'md', showIcon = true }: CategoryBadgeProps) {
  const config = POLICY_CATEGORIES[category];
  
  return (
    <div className={clsx(
      'inline-flex items-center gap-1.5 border border-[var(--border-subtle)] text-[var(--text-primary)]',
      {
        'px-2 py-1 text-[10px]': size === 'sm',
        'px-3 py-1.5 text-xs': size === 'md',
        'px-4 py-2 text-sm': size === 'lg',
      }
    )}>
      {showIcon && <span>{config.icon}</span>}
      <span className="font-semibold uppercase tracking-wider">{config.label}</span>
    </div>
  );
}
