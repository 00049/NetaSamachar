'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface Props {
  value: number;
  duration?: number;
  suffix?: string;
}

export function AnimatedCounter({ value, duration = 1200, suffix = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const rafId = useRef<number>(0);
  const startTime = useRef<number | null>(null);
  const prefersReduced = useRef(false);
  
  // Track previous value to animate from it when value changes
  const [prevValue, setPrevValue] = useState(0);

  useEffect(() => {
    prefersReduced.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (!isInView || !ref.current) return;

    if (prefersReduced.current) {
      ref.current.textContent = Intl.NumberFormat('en-IN').format(Math.round(value)) + suffix;
      setPrevValue(value);
      return;
    }

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    startTime.current = null;
    const startValue = prevValue;
    const delta = value - startValue;

    const tick = (timestamp: number) => {
      if (!ref.current) return;
      if (startTime.current === null) startTime.current = timestamp;

      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.round(startValue + easeOut(progress) * delta);

      ref.current.textContent = Intl.NumberFormat('en-IN').format(current) + suffix;

      if (progress < 1) {
        rafId.current = requestAnimationFrame(tick);
      } else {
        setPrevValue(value);
      }
    };

    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [isInView, value, duration, suffix, prevValue]);

  return <span ref={ref}>{Intl.NumberFormat('en-IN').format(prevValue)}{suffix}</span>;
}
