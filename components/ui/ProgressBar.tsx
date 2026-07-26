'use client';

import { useEffect, useRef } from 'react';

interface ProgressBarProps {
  /** 0–100 */
  value: number;
  color?: string;
  height?: string;
  className?: string;
  /** Delay before the animation fires (ms) — used for staggered reveals */
  delay?: number;
}

/**
 * ProgressBar — GPU-composited fill animation.
 *
 * ⚠ NEVER animate `width`. Instead:
 * - The track is `overflow: hidden; width: 100%`
 * - The inner fill div is always `width: 100%`
 * - We animate `transform: scaleX(value/100)` with `transform-origin: left`
 *
 * This keeps the animation on the compositor thread (no layout recalculations
 * per frame), so it runs at 60 fps even on lower-end mobile devices.
 *
 * Respects `prefers-reduced-motion` — renders at full width immediately.
 * Uses IntersectionObserver to fire only when the bar enters the viewport.
 */
export function ProgressBar({
  value,
  color = 'white',
  height = '4px',
  className = '',
  delay = 0,
}: ProgressBarProps) {
  const fillRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const fill = fillRef.current;
    const track = trackRef.current;
    if (!fill || !track) return;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Start collapsed
    fill.style.transform = `scaleX(${reduced ? value / 100 : 0})`;
    fill.style.transition = 'none';

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;
        observer.disconnect();

        if (reduced) return; // already at full value

        const run = () => {
          fill.style.transition = `transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)`;
          fill.style.transform = `scaleX(${value / 100})`;
        };

        if (delay > 0) {
          setTimeout(run, delay);
        } else {
          // One rAF to ensure the initial scaleX(0) is painted before we transition
          requestAnimationFrame(() => requestAnimationFrame(run));
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(track);
    return () => observer.disconnect();
  }, [value, delay]);

  return (
    <div
      ref={trackRef}
      className={`relative overflow-hidden rounded-[3px] bg-white/10 ${className}`}
      style={{ height }}
    >
      <div
        ref={fillRef}
        className="absolute inset-0 rounded-[3px]"
        style={{
          backgroundColor: color,
          transformOrigin: 'left',
          transform: 'scaleX(0)',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
