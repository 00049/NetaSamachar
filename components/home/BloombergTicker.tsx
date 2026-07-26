'use client';

import { motion } from 'framer-motion';
import { AnimatedCounter } from '../ui/AnimatedCounter';

const MOCK_DATA = [
  { label: 'PROMISES TRACKED', value: 4219, suffix: '', trend: '+12' },
  { label: 'EVIDENCE ARCHIVED', value: 12847, suffix: '', trend: '+45' },
  { label: 'HEINOUS CASES', value: 184, suffix: '', trend: 'UNCHANGED' },
  { label: 'CAG AUDITS', value: 56, suffix: '', trend: '+2' },
  { label: 'COMPLETED', value: 28, suffix: '%', trend: '-1%' },
  { label: 'RTI REQUESTS', value: 890, suffix: '', trend: '+15' },
];

export function BloombergTicker() {
  return (
    <div className="w-full bg-[var(--text-primary)] text-[var(--bg-base)] overflow-hidden border-y border-[var(--text-primary)]">
      <div className="flex items-center py-2 relative">
        <div className="flex items-center whitespace-nowrap px-4 w-full justify-between">
          {MOCK_DATA.map((item, i) => (
            <div key={i} className="flex items-center gap-2 pr-8 border-r border-white/20 last:border-0 last:pr-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--bg-base)]/70">
                {item.label}
              </span>
              <span className="font-mono text-xs font-bold flex items-center">
                <AnimatedCounter value={item.value} duration={2 + i * 0.2} />
                {item.suffix}
              </span>
              <span className={`text-[10px] font-bold ${
                item.trend.startsWith('+') ? 'text-emerald-400' :
                item.trend.startsWith('-') ? 'text-red-400' : 'text-zinc-400'
              }`}>
                {item.trend}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
