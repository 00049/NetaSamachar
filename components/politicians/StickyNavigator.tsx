'use client';

import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { 
  Activity, Gauge, Target, Lock, History, IndianRupee, Gavel, FileText, 
  LayoutGrid, ShieldCheck, Database, RefreshCw,
  Shield
} from 'lucide-react';

const PAGE_SECTIONS = [
  { id: 'overview', label: 'Overview', subtitle: 'Executive Brief', icon: Activity },
  { id: 'performance', label: 'Performance', subtitle: 'Work & Attendance', icon: Gauge },
  { id: 'promises', label: 'Promises', subtitle: 'What was promised', icon: Target },
  { id: 'legislation', label: 'Laws & Bills', subtitle: 'Legislative Work', icon: Lock },
  { id: 'timeline', label: 'Timeline', subtitle: 'Political Journey', icon: History },
  { id: 'financials', label: 'Financials', subtitle: 'Assets & Liabilities', icon: IndianRupee },
  { id: 'cases', label: 'Cases', subtitle: 'Legal Proceedings', icon: Gavel },
  { id: 'sources', label: 'Sources', subtitle: 'Evidence & Docs', icon: FileText },
];

export function StickyNavigator({ lastUpdated }: { lastUpdated?: string }) {
  const [activeSection, setActiveSection] = useState<string>(PAGE_SECTIONS[0]?.id || '');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Dynamically calculate the combined sticky height for the intersection observer
    const navbar = document.querySelector('header');
    const stickyNav = document.getElementById('sticky-navigator');
    const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 80;
    // Default to 220px if not yet rendered to prevent layout thrashing
    const stickyNavHeight = stickyNav ? stickyNav.getBoundingClientRect().height : 220; 
    const totalOffset = navbarHeight + stickyNavHeight;

    const options = {
      root: null,
      // The top margin must account for the sticky headers so it triggers when visible below them
      rootMargin: `-${totalOffset + 40}px 0px -40% 0px`,
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
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="sticky-navigator" className="sticky top-[80px] z-40 w-full px-[40px] mb-12 transition-all duration-[220ms]">
      <div className="bg-[var(--color-panel)]/95 backdrop-blur-xl border border-white/10 rounded-md shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col">
        
        {/* Navigation Tabs */}
        <div className="relative">
          <div className="flex overflow-x-auto no-scrollbar relative">
            {PAGE_SECTIONS.map((section, index) => {
              const isActive = activeSection === section.id;
              const Icon = section.icon;
              
              return (
                <button
                  key={section.id}
                  onClick={() => handleScrollTo(section.id)}
                  className={clsx(
                    "relative flex flex-col items-center justify-center flex-1 py-3 px-3 min-w-[120px] transition-all group",
                    isActive ? "bg-gradient-to-b from-[#22C55E]/10 to-transparent" : "hover:bg-white/[0.02]",
                    index !== PAGE_SECTIONS.length - 1 ? "border-r border-white/5" : ""
                  )}
                >
                  {/* Active Top Border Glow */}
                  {isActive && (
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#22C55E] shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
                  )}
                  
                  <Icon className={clsx(
                    "w-5 h-5 mb-1.5 transition-colors",
                    isActive ? "text-[#22C55E]" : "text-gray-400 group-hover:text-gray-200"
                  )} />
                  <span className={clsx(
                    "font-bold text-[13px] md:text-[14px] tracking-tight whitespace-nowrap transition-colors",
                    isActive ? "text-[#22C55E]" : "text-white"
                  )}>
                    {section.label}
                  </span>
                </button>
              );
            })}
          </div>
          {/* Fade hint for horizontal scroll on smaller screens */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[var(--color-panel)] to-transparent pointer-events-none xl:hidden" />
        </div>

      </div>
    </div>
  );
}
