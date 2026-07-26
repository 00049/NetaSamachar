'use client';

import { Evidence } from '@/lib/types';
import { EVIDENCE_TYPE_CONFIG } from '@/lib/utils';
import { ConfidenceScore } from '../ui/ConfidenceScore';
import { motion } from 'framer-motion';
import { FileText, ShieldCheck, ChevronRight } from 'lucide-react';

interface Props {
  evidence: Evidence;
  onClick: (evidence: Evidence) => void;
}

export function EvidenceRow({ evidence, onClick }: Props) {
  const typeConfig = EVIDENCE_TYPE_CONFIG[evidence.type];

  return (
    <motion.div 
      whileHover={{ scale: 1.01, backgroundColor: 'var(--bg-base)' }}
      onClick={() => onClick(evidence)}
      className="group grid grid-cols-12 gap-4 items-center p-4 border-b border-[var(--border-subtle)] cursor-pointer glide-transition"
    >
      {/* Title & Tier (Col 1-5) */}
      <div className="col-span-12 md:col-span-5 flex items-start gap-4">
        <div className="mt-1 bg-[var(--bg-base)] border border-[var(--border-subtle)] p-2 rounded-sm text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] glide-transition">
          <FileText className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-primary)]">
              T{typeConfig.tier}
            </span>
            <span className="w-1 h-1 rounded-full bg-[var(--border-subtle)]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">
              {typeConfig.label}
            </span>
          </div>
          <h3 className="font-serif text-base font-bold text-[var(--text-primary)] leading-snug group-hover:underline decoration-1 underline-offset-4 decoration-[var(--border-subtle)]">
            {evidence.title}
          </h3>
        </div>
      </div>

      {/* Source (Col 6-8) */}
      <div className="hidden md:block col-span-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] leading-relaxed">
        {evidence.source}
      </div>

      {/* Date (Col 9) */}
      <div className="hidden md:block col-span-2 text-xs font-mono text-[var(--text-tertiary)]">
        {new Date(evidence.date).toISOString().split('T')[0]}
      </div>

      {/* Score & Action (Col 10-12) */}
      <div className="hidden md:flex col-span-2 items-center justify-between">
        <div className="flex items-center gap-2">
          {evidence.confidenceScore > 80 && <ShieldCheck className="w-4 h-4 text-[var(--accent-positive)]" />}
          <ConfidenceScore score={evidence.confidenceScore} size="sm" showLabel={false} />
        </div>
        <ChevronRight className="w-4 h-4 text-[var(--border-subtle)] group-hover:text-[var(--text-primary)] glide-transition" />
      </div>
    </motion.div>
  );
}
