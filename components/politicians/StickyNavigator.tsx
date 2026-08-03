'use client';

import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { 
  Activity, Gauge, Target, Lock, History, IndianRupee, Gavel, FileText, 
  LayoutGrid, ShieldCheck, ChevronRight, Database, RefreshCw,
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
      const offset = 120; // Increased offset for the taller navigator
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="sticky top-4 z-50 w-full px-[40px] mb-12 transition-all duration-[220ms]">
      <div className="bg-[#11131A]/95 backdrop-blur-xl border border-white/10 rounded-[20px] shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col">
        
        {/* ROW 1: Header */}
        <div className="flex items-center justify-between p-5 md:p-6 border-b border-white/5">
          {/* Left Side */}
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-[14px] bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-inner">
              <LayoutGrid className="w-6 h-6 text-[#22C55E]" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg md:text-xl tracking-tight">Executive Brief</h2>
              <p className="text-[#22C55E] text-xs md:text-sm font-medium mt-0.5">Last Updated: 03 Aug 2026</p>
            </div>
            <div className="ml-2 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20">
              <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-[#22C55E] text-xs font-semibold uppercase tracking-wider">Live</span>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#22C55E]" />
              <div>
                <p className="text-white font-bold text-sm tracking-tight">Data Verified</p>
                <p className="text-gray-400 text-xs">Updated regularly</p>
              </div>
            </div>
            <button className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
              Learn More <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ROW 2: Navigation Tabs */}
        <div className="flex border-b border-white/5 overflow-x-auto no-scrollbar relative">
          {PAGE_SECTIONS.map((section, index) => {
            const isActive = activeSection === section.id;
            const Icon = section.icon;
            
            return (
              <button
                key={section.id}
                onClick={() => handleScrollTo(section.id)}
                className={clsx(
                  "relative flex flex-col items-center justify-center flex-1 py-5 px-4 min-w-[140px] transition-all group",
                  isActive ? "bg-gradient-to-b from-[#22C55E]/10 to-transparent" : "hover:bg-white/[0.02]",
                  index !== PAGE_SECTIONS.length - 1 ? "border-r border-white/5" : ""
                )}
              >
                {/* Active Top Border Glow */}
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#22C55E] shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
                )}
                
                <Icon className={clsx(
                  "w-6 h-6 mb-3 transition-colors",
                  isActive ? "text-[#22C55E]" : "text-gray-400 group-hover:text-gray-200"
                )} />
                <span className={clsx(
                  "font-bold text-[14px] md:text-[15px] mb-1 tracking-tight whitespace-nowrap transition-colors",
                  isActive ? "text-[#22C55E]" : "text-white"
                )}>
                  {section.label}
                </span>
                <span className={clsx(
                  "text-[11px] md:text-[12px] font-medium whitespace-nowrap transition-colors",
                  isActive ? "text-[#22C55E]/80" : "text-gray-500 group-hover:text-gray-400"
                )}>
                  {section.subtitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* ROW 3: Footer */}
        <div className="bg-white/[0.02] p-4 md:p-5 relative overflow-hidden">
          {/* Subtle wave/gradient background effect */}
          <div className="absolute top-0 right-0 bottom-0 w-1/2 bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 relative z-10">
            {/* Col 1 */}
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-indigo-400 shrink-0" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider whitespace-nowrap">Data Sources:</span>
                <span className="text-gray-400 text-xs">ECI, Parliament, Govt. Websites, Court Records, Affidavits & more</span>
              </div>
            </div>

            {/* Col 2 */}
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-blue-400 shrink-0" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-blue-400 text-xs font-bold uppercase tracking-wider whitespace-nowrap">Our Commitment</span>
                <span className="text-gray-400 text-xs">Our data is verified and updated regularly</span>
              </div>
            </div>

            {/* Col 3 */}
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-purple-400 shrink-0" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-purple-400 text-xs font-bold uppercase tracking-wider whitespace-nowrap">Update Frequency</span>
                <span className="text-gray-400 text-xs">Real-time checks & scheduled updates</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
