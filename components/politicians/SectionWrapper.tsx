'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

interface Props {
  id: string;
  label: string;
  heading: string;
  description: string;
  children: ReactNode;
  rightElement?: ReactNode;
  labelClassName?: string;
}

export function SectionWrapper({ id, label, heading, description, children, rightElement, labelClassName }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // 1. Dynamic Scroll Margin for native hash linking
    const updateScrollMargin = () => {
      if (!sectionRef.current) return;
      
      const navbar = document.querySelector('header');
      const stickyNav = document.getElementById('sticky-navigator');
      
      const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 80;
      const stickyNavHeight = stickyNav ? stickyNav.getBoundingClientRect().height : 0;
      
      // Add 24px of breathing room
      const totalOffset = navbarHeight + stickyNavHeight + 24;
      
      sectionRef.current.style.scrollMarginTop = `${totalOffset}px`;
    };

    updateScrollMargin();
    window.addEventListener('resize', updateScrollMargin);

    // 2. Intersection Observer for fade-in
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (sectionRef.current) {
              observer.unobserve(sectionRef.current);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -15% 0px',
        threshold: 0,
      }
    );

    const currentRef = sectionRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      window.removeEventListener('resize', updateScrollMargin);
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className="py-24 sm:py-32" // Generous vertical spacing
    >
      <div 
        className={clsx(
          "w-full transition-all duration-500 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        {/* Section Header */}
        <div className="mb-16 flex flex-col sm:flex-row justify-between items-start gap-[24px]">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <span
              className={clsx(
                "text-[11px] font-black uppercase tracking-[0.2em] mb-4",
                labelClassName || "text-white/40"
              )}
            >
              {label}
            </span>
            <h2
              className="text-4xl sm:text-5xl font-black mb-3"
              style={{
                fontFamily: 'var(--font-serif, Georgia)',
                letterSpacing: '-0.02em',
                color: '#ffffff'
              }}
            >
              {heading}
            </h2>
            <p
              className="text-lg sm:text-xl font-medium"
              style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '800px' }}
            >
              {description}
            </p>
          </div>
          {rightElement && (
            <div className="shrink-0 mt-4 sm:mt-0">
              {rightElement}
            </div>
          )}
        </div>

        {/* Section Content */}
        <div className="relative">
          {children}
        </div>
      </div>
    </section>
  );
}
