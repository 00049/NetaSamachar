'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';
import { ConfidenceScore } from '../ui/ConfidenceScore';

const scores = [
  { range: '90–100', value: 95, label: 'Absolute', color: 'text-[var(--accent-positive)]', desc: 'Cryptographic primary evidence.' },
  { range: '70–89', value: 80, label: 'High', color: 'text-[var(--accent-info)]', desc: 'Peer-reviewed consensus or CAG audits.' },
  { range: '50–69', value: 60, label: 'Moderate', color: 'text-[var(--accent-warning)]', desc: 'Tier 3 journalism or older RTIs.' },
  { range: '<50', value: 30, label: 'Unverified', color: 'text-[var(--accent-negative)]', desc: 'Fails epistemological thresholds.' },
];

export function ConfidenceScoreVisualisation() {
  return (
    <div className="py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {scores.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="border border-[var(--border-subtle)] bg-[var(--bg-base)] p-6 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden"
        >
          {/* Background Indicator */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg-base)] pointer-events-none" />
          
          <div className="relative z-10 mb-4">
            <ConfidenceScore score={s.value} size="lg" showLabel={false} />
          </div>
          
          <div className={clsx("font-serif text-3xl font-black mb-1 relative z-10", s.color)}>
            {s.range}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-primary)] mb-3 relative z-10">
            {s.label}
          </div>
          <p className="text-[10px] text-[var(--text-tertiary)] leading-relaxed relative z-10 px-2">
            {s.desc}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
