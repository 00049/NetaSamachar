'use client';

import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { LayoutDashboard, Activity, Target, Lock, History, IndianRupee, Gavel, FileText } from 'lucide-react';

const PAGE_SECTIONS = [
  { id: 'overview', label: 'Overview', subtitle: 'Executive Brief', icon: LayoutDashboard },
  { id: 'performance', label: 'Performance', subtitle: 'Work & Attendance', icon: Activity },
  { id: 'promises', label: 'Promises', subtitle: 'What was promised', icon: Target },
  { id: 'legislation', label: 'Laws & Bills', subtitle: 'Legislative Work', icon: Lock },
  { id: 'timeline', label: 'Timeline', subtitle: 'Political Journey', icon: History },
  { id: 'financials', label: 'Financials', subtitle: 'Assets & Liabilities', icon: IndianRupee },
  { id: 'cases', label: 'Cases', subtitle: 'Legal Proceedings', icon: Gavel },
  { id: 'sources', label: 'Sources', subtitle: 'Evidence & Docs', icon: FileText },
];

export function StickyNavigator() {
  const [activeSection, setActiveSection] = useState<string>(PAGE_SECTIONS[0]?.id || '');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '-100px 0px -60% 0px',
      threshold: 0,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      const intersecting = entries.find((entry) => entry.isIntersecting);
      if (intersecting) {
        setActiveSection(intersecting.target.id);
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersect, options);

    PAGE_SECTIONS.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div
      className="sticky top-0 z-50 w-full transition-all duration-[220ms] ease-[cubic-bezier(.22,1,.36,1)] border-y border-white/5 bg-[var(--color-panel)]/95 backdrop-blur-[20px]"
    >
      <div className="w-full px-6 lg:px-10">
        <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar" aria-label="Section Navigation">
          {PAGE_SECTIONS.map((section) => {
            const isActive = activeSection === section.id;
            const Icon = section.icon;
            
            return (
              <button
                key={section.id}
                onClick={() => handleScrollTo(section.id)}
                className={clsx(
                  "relative py-[16px] px-[16px] transition-all duration-[220ms] ease-[cubic-bezier(.22,1,.36,1)] outline-none flex-shrink-0 flex items-center gap-[16px] min-w-[160px] hover:bg-white/5",
                  isActive ? "bg-white/5" : ""
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={clsx(
                  "w-[24px] h-[24px]",
                  isActive ? "text-[var(--color-accent-positive)]" : "text-[var(--color-text-secondary)]"
                )} />
                <div className="text-left">
                  <div className={clsx(
                    "apple-body font-bold",
                    isActive ? "text-white" : "text-[var(--color-text-secondary)]"
                  )}>
                    {section.label}
                  </div>
                  <div className="apple-meta mt-[4px]">
                    {section.subtitle}
                  </div>
                </div>
                
                {/* Active Indicator Underline */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[var(--color-accent-positive)] shadow-[0_-2px_10px_rgba(34,197,94,0.4)]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
