'use client';

import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, animate } from 'framer-motion';

interface Props {
  value: number;
  duration?: number;
  suffix?: string;
}

export function AnimatedCounter({ value, duration = 1.2, suffix = '' }: Props) {
  const ref      = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const raw      = useMotionValue(0);

  useEffect(() => {
    if (isInView) {
      animate(raw, value, {
        duration,
        ease: 'easeOut',
      });
    }
  }, [isInView, value, raw, duration]);

  useEffect(() =>
    raw.on('change', (v) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat('en-IN').format(Math.round(v)) + suffix;
      }
    }),
  [raw, suffix]);

  // SSR / pre-animation: show 0 to start count-up from zero, or target to prevent layout shift.
  // Specs say "animate from 0 to final value", we will start at 0 visually to ensure the effect is obvious on load.
  return (
    <span ref={ref}>
      0{suffix}
    </span>
  );
}
