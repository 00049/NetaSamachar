'use client';

import { useEffect, useRef, createContext, useContext, ReactNode } from 'react';

/**
 * ScrollReveal — viewport-triggered fade+translateY animation.
 *
 * Uses IntersectionObserver (never scroll event listeners) and
 * requestAnimationFrame for the stagger scheduling.
 * Respects prefers-reduced-motion.
 *
 * Usage (individual):
 *   <ScrollReveal><YourCard /></ScrollReveal>
 *
 * Usage (staggered grid — preferred for 12+ item grids):
 *   <StaggeredRevealGrid>
 *     {items.map((item, i) => <ScrollReveal key={i}><Card /></ScrollReveal>)}
 *   </StaggeredRevealGrid>
 *
 * Within StaggeredRevealGrid, items are automatically given staggered delays
 * (70ms apart) and all fire together via a shared IntersectionObserver on
 * the parent container, so only one observer is needed per grid.
 */

// ── Staggered grid context ──────────────────────────────────────────────────
interface StaggerCtx { parentRef: React.RefObject<HTMLElement | null>; }
const StaggerContext = createContext<StaggerCtx | null>(null);

export function StaggeredRevealGrid({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <StaggerContext.Provider value={{ parentRef: ref }}>
      <div ref={ref} className={className}>
        {children}
      </div>
    </StaggerContext.Provider>
  );
}

// ── Individual reveal item ──────────────────────────────────────────────────
interface ScrollRevealProps {
  children: ReactNode;
  /** Manual delay override — overridden by stagger index within StaggeredRevealGrid */
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  /** Index within a staggered grid (auto-set by parent) */
  staggerIndex?: number;
}

export function ScrollReveal({
  children,
  delay,
  className = '',
  style,
  staggerIndex,
}: ScrollRevealProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const ctx = useContext(StaggerContext);

  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      // No animation — render at final state immediately
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      return;
    }

    // Initial hidden state — only transform + opacity (no layout props)
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'none';
    el.style.willChange = 'transform, opacity';

    const staggerDelay =
      delay !== undefined
        ? delay
        : staggerIndex !== undefined
        ? staggerIndex * 70
        : 0;

    // Use IntersectionObserver on the parent (if in stagger ctx) or self
    const target = ctx?.parentRef.current ?? el;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const run = () => {
          el.style.transition = 'opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';

          // Remove will-change after the animation completes to free GPU memory
          setTimeout(() => {
            if (el) el.style.willChange = 'auto';
          }, 600);
        };

        if (staggerDelay > 0) {
          setTimeout(run, staggerDelay);
        } else {
          requestAnimationFrame(run);
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [delay, staggerIndex, ctx]);

  return (
    <div ref={itemRef} className={className} style={style}>
      {children}
    </div>
  );
}
