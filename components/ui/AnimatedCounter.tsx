'use client';

import { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

interface Props {
  value: number;
  duration?: number;
  suffix?: string;
}

/**
 * AnimatedCounter — counts up from 0 to `value` using requestAnimationFrame
 * with an easeOut curve, respecting prefers-reduced-motion.
 *
 * When the user has reduced-motion enabled, the final value is rendered
 * immediately with no animation — no invisible intermediate states.
 *
 * Uses IntersectionObserver (via framer-motion's useInView) not a scroll
 * listener, so there is no scroll jank from manual position math.
 */
export function AnimatedCounter({ value, duration = 1200, suffix = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const rafId = useRef<number>(0);
  const startTime = useRef<number | null>(null);
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (!isInView || !ref.current) return;

    // Respect prefers-reduced-motion: render final value instantly
    if (prefersReduced.current) {
      ref.current.textContent =
        Intl.NumberFormat('en-IN').format(Math.round(value)) + suffix;
      return;
    }

    // easeOut cubic: t = 1 - (1-x)^3
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    startTime.current = null;

    const tick = (timestamp: number) => {
      if (!ref.current) return;
      if (startTime.current === null) startTime.current = timestamp;

      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.round(easeOut(progress) * value);

      ref.current.textContent = Intl.NumberFormat('en-IN').format(current) + suffix;

      if (progress < 1) {
        rafId.current = requestAnimationFrame(tick);
      }
    };

    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [isInView, value, duration, suffix]);

  // Render 0 before animation starts to show the count-up effect clearly
  return <span ref={ref}>0{suffix}</span>;
}
