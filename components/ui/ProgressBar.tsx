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
  const valueRef = useRef(value);

  // Keep value ref in sync so the observer callback always sees the latest value
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    const fill = fillRef.current;
    const track = trackRef.current;
    if (!fill || !track) return;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Start collapsed
    fill.style.transform = `scaleX(${reduced ? valueRef.current / 100 : 0})`;
    fill.style.transition = 'none';

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;
        observer.disconnect();

        if (reduced) return; // already at full value

        const run = () => {
          fill.style.transition = `transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)`;
          fill.style.transform = `scaleX(${valueRef.current / 100})`;
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
  }, [delay]); // Only re-run if delay changes (unlikely)

  // Handle subsequent dynamic value changes smoothly
  useEffect(() => {
    if (hasAnimated.current && fillRef.current) {
      const reduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
      if (!reduced) {
        fillRef.current.style.transition = `transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)`;
      }
      fillRef.current.style.transform = `scaleX(${value / 100})`;
    }
  }, [value]);

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
