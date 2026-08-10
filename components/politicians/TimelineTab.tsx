'use client';

import { Politician, Promise as PromiseType } from '@/lib/types';
import { 
  Download,
  Calendar,
  Briefcase,
  Building2,
  Users,
  MapPin,
  ChevronRight,
  User,
  Crown,
  Info
} from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface Props {
  politician: Politician;
  promises: PromiseType[]; // kept for compatibility but not used in this mock
}



export function TimelineTab({ politician, promises }: Props) {
  
  const timelineEvents = promises
    .flatMap(p => p.timeline.map(t => ({ ...t, promiseTitle: p.title })))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (timelineEvents.length === 0) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 border border-white/10 p-12 text-center rounded-md bg-white/[0.02]">
        <h3 className="text-white font-bold mb-2">No Timeline Data Found</h3>
        <p className="text-[#A1A1AA] text-[13px]">There is no timeline data available for {politician.name}.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-[16px] mb-[32px]">
        <div>
          <h2 className="text-[#22c55e] text-[11px] font-bold uppercase tracking-widest mb-[4px]">Political Journey</h2>
          <h3 className="text-white text-[28px] font-bold mb-[4px]">Timeline</h3>
          <p className="text-[#A1A1AA] text-[13px]">Complete political journey of {politician.name}.</p>
        </div>
        <div className="flex items-center gap-[12px]">
          <button onClick={() => alert('Download starting... (Placeholder)')} className="flex items-center gap-[6px] px-[16px] py-[8px] bg-white/[0.03] hover:bg-white/[0.08] text-white text-[13px] font-medium rounded-lg transition-colors border border-white/5">
            <Download className="w-[14px] h-[14px] text-[#A1A1AA]" /> Download Timeline
          </button>
          <button className="flex items-center gap-[6px] px-[16px] py-[10px] rounded-sm border border-white/10 text-white text-[13px] hover:bg-white/[0.02] transition-colors font-medium">
            <Calendar className="w-[14px] h-[14px] text-[#A1A1AA]" /> Filter by Period <ChevronRight className="w-[14px] h-[14px] text-[#A1A1AA] ml-1 rotate-90" />
          </button>
        </div>
      </div>

      {/* TWO COLUMN MAIN CONTENT */}
      <div className="grid grid-cols-1 gap-[24px]">
        
        {/* LEFT MAIN TIMELINE */}
        <div className="card-elevated p-[32px] overflow-hidden">
          <div className="relative pl-[110px] sm:pl-[140px] pt-[20px]">
             
            {/* The continuous vertical line behind everything */}
            <div className="absolute left-[88px] sm:left-[108px] top-[24px] bottom-0 w-[2px] bg-gradient-to-b from-[#22c55e] via-[#3b82f6] via-[#a855f7] to-[#eab308] opacity-50" />

            {timelineEvents.map((event, i) => (
              <ScrollReveal key={event.id} delay={i * 70} className="relative mb-[40px] group">
                
                {/* Date Labels (Left Side) */}
                <div className="absolute left-[-110px] sm:left-[-140px] top-[14px] w-[90px] sm:w-[120px] text-right">
                   <div className="text-white text-[11px] font-bold tracking-wide">{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </div>

                {/* The Dot & Ring */}
                <div className="absolute left-[-26.5px] sm:left-[-36.5px] top-[14px]">
                   <div className="relative flex items-center justify-center w-[12px] h-[12px]">
                     <div className="absolute inset-0 rounded-full opacity-30 blur-[2px]" style={{ backgroundColor: '#22c55e' }} />
                     <div className="absolute w-[18px] h-[18px] rounded-full border border-current opacity-40 bg-[#111111]" style={{ color: '#22c55e' }} />
                     <div className="w-[8px] h-[8px] rounded-full z-10" style={{ backgroundColor: '#22c55e' }} />
                   </div>
                </div>

                {/* Event Card (Right Side) */}
                <div className="bg-[#111111] border border-white/5 hover:border-white/10 rounded-sm p-[24px] transition-all duration-300 relative group-hover:bg-white/[0.02]">
                   
                   <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-[16px]">
                      
                      <div className="flex gap-[16px]">
                         <div>
                           <h4 className="text-white text-[15px] font-bold mb-[4px]">{event.title}</h4>
                           <div className="text-[#A1A1AA] text-[12px] mb-[12px]">Promise: {event.promiseTitle}</div>
                           <p className="text-[#52525B] text-[12px] leading-relaxed max-w-[400px]">
                             {event.description}
                           </p>
                         </div>
                      </div>

                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start shrink-0 ml-14 sm:ml-0 h-full">
                         {/* Badge */}
                         <div className={clsx("px-[10px] py-[4px] rounded-sm border text-[10px] font-bold tracking-widest uppercase mb-[24px]", 
                           event.type === 'milestone' ? "text-[var(--color-accent-positive)] bg-[var(--color-accent-positive)]/10 border-[var(--color-accent-positive)]/20" :
                           event.type === 'setback' ? "text-red-500 bg-red-500/10 border-red-500/20" :
                           "text-[#3b82f6] bg-[#3b82f6]/10 border-[#3b82f6]/20"
                         )}>
                           {event.type}
                         </div>
                      </div>
                      
                      {/* Chevron Arrow */}
                      {/* Removed right chevron as timeline cards do not expand */}
                    </div>
                  </div>
              </ScrollReveal>
            ))}
            
            {/* Removed View Full Timeline Button */}

          </div>
        </div>



      </div>
      
      {/* Footer Info */}
      <div className="mt-[24px] flex items-center gap-[8px] text-[#52525B] text-[11px]">
        <Info className="w-[14px] h-[14px]" /> Timeline data is compiled from official records including Election Commission, {politician.state} Vidhan Sabha, and Government Gazettes.
      </div>
      
    </div>
  );
}
