'use client';

import { motion } from 'framer-motion';

interface Props {
  label: string;
  className?: string;
}

export function LiveIndicator({ label, className = '' }: Props) {
  return (
    <div className={`flex items-center gap-[6px] ${className}`}>
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1, 0.8] }}
        transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
        className="rounded-full bg-[#34D399] shrink-0"
        style={{ width: 6, height: 6 }}
      />
      <span
        className="font-semibold uppercase tracking-[0.12em] text-[#A1A1AA]"
        style={{ fontSize: '10px' }}
      >
        {label}
      </span>
    </div>
  );
}
