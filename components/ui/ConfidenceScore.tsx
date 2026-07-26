import { getConfidenceTier, CONFIDENCE_CONFIG } from '@/lib/utils';
import clsx from 'clsx';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface Props {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showBar?: boolean;
}

export function ConfidenceScore({ score, size = 'md', showLabel = true, showBar = false }: Props) {
  const tier = getConfidenceTier(score);
  const config = CONFIDENCE_CONFIG[tier];

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className={clsx('flex items-center gap-2', config.colorClass)}>
        <svg className={clsx({
          'w-4 h-4': size === 'sm',
          'w-5 h-5': size === 'md',
          'w-6 h-6': size === 'lg',
        })} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <div className="flex items-baseline gap-1">
          <span className={clsx('font-bold tracking-tight', {
            'text-sm': size === 'sm',
            'text-base': size === 'md',
            'text-lg': size === 'lg',
          })}>
            {score}
          </span>
          <span className={clsx('font-semibold text-[10px] uppercase tracking-wider')}>
            /100
          </span>
        </div>
        
        {showLabel && (
          <>
            <span className="text-[var(--border-subtle)] px-1">|</span>
            <span className={clsx('font-bold uppercase tracking-wider', {
              'text-[10px]': size === 'sm',
              'text-xs': size === 'md',
              'text-sm': size === 'lg',
            })}>
              {config.label}
            </span>
          </>
        )}
      </div>

      {showBar && (
        <ProgressBar
          value={score}
          color={`var(--accent-${tier === 'absolute' || tier === 'high' ? 'positive' : tier === 'moderate' ? 'warning' : 'negative'})`}
          height="4px"
        />
      )}
    </div>
  );
}
