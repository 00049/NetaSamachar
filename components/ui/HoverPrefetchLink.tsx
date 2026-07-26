'use client';

import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, ReactNode, AnchorHTMLAttributes } from 'react';

type HoverPrefetchLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children: ReactNode;
    /** Duration in ms to wait before triggering a full prefetch (default 150) */
    prefetchDelay?: number;
  };

/**
 * HoverPrefetchLink
 * 
 * Delays Next.js route prefetching until the user explicitly hovers for >150ms.
 * This saves bandwidth compared to viewport prefetching or instant-hover prefetching,
 * while still guaranteeing an instant page transition for deliberate clicks.
 */
export function HoverPrefetchLink({
  href,
  children,
  prefetchDelay = 150,
  onMouseEnter,
  onMouseLeave,
  ...props
}: HoverPrefetchLinkProps) {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Start the intent timer
    timeoutRef.current = setTimeout(() => {
      // Perform a full route prefetch
      router.prefetch(href.toString());
    }, prefetchDelay);

    // Pass through any consumer handlers
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Clear the timer if the user leaves before the threshold
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    onMouseLeave?.(e);
  };

  return (
    <Link
      href={href}
      // Disable default viewport prefetching. Next.js will still do a partial 
      // layout prefetch on immediate hover, but our manual router.prefetch() 
      // after the delay will pull the full page data.
      prefetch={false}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </Link>
  );
}
