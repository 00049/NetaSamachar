'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, FileText, Globe, BookOpen } from 'lucide-react';
import clsx from 'clsx';

const tiers = [
  {
    tier: 'Tier 1: Absolute',
    color: 'text-[var(--accent-positive)]',
    borderColor: 'border-[var(--accent-positive)]',
    bgColor: 'bg-[var(--accent-positive)]',
    icon: ShieldCheck,
    desc: 'Government Gazettes, Supreme Court Judgments, CAG Audits.',
  },
  {
    tier: 'Tier 2: High',
    color: 'text-[var(--accent-info)]',
    borderColor: 'border-[var(--accent-info)]',
    bgColor: 'bg-[var(--accent-info)]',
    icon: Globe,
    desc: 'Global Wire Agencies (Reuters, PTI).',
  },
  {
    tier: 'Tier 3: Moderate',
    color: 'text-[var(--accent-warning)]',
    borderColor: 'border-[var(--accent-warning)]',
    bgColor: 'bg-[var(--accent-warning)]',
    icon: FileText,
    desc: 'Mainstream Investigative Journalism.',
  },
  {
    tier: 'Tier 4: Low',
    color: 'text-[var(--text-tertiary)]',
    borderColor: 'border-[var(--text-tertiary)]',
    bgColor: 'bg-[var(--text-tertiary)]',
    icon: BookOpen,
    desc: 'Think Tanks, Policy Organizations.',
  }
];

export function EvidenceHierarchyDiagram() {
  return (
    <div className="py-12 flex flex-col items-center">
      {tiers.map((t, i) => {
        const Icon = t.icon;
        const width = 100 - (i * 15); // Pyramid effect
        return (
          <motion.div
            key={t.tier}
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className={clsx(
              "relative flex flex-col items-center p-6 border-b-4 bg-[var(--bg-base)] shadow-lg z-10 mb-[-1px]",
              t.borderColor
            )}
            style={{ width: `${width}%` }}
          >
            <div className="absolute inset-0 opacity-5 pointer-events-none" />
            <Icon className={clsx("w-6 h-6 mb-3", t.color)} />
            <h3 className={clsx("text-xs font-bold uppercase tracking-widest text-center mb-2", t.color)}>{t.tier}</h3>
            <p className="text-[10px] text-[var(--text-tertiary)] text-center hidden md:block">{t.desc}</p>
          </motion.div>
        );
      })}
      
      {/* Foundation Base */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="w-full mt-4 border-t-2 border-[var(--text-tertiary)] pt-4"
      >
        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">
          Evidentiary Foundation Layer
        </p>
      </motion.div>
    </div>
  );
}
