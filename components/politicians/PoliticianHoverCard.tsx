import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Users } from 'lucide-react';
import { POLITICIANS, PARTIES } from '@/data/politicians';

interface Props {
  politicianId: string;
  children: ReactNode;
}

export function PoliticianHoverCard({ politicianId, children }: Props) {
  const politician = POLITICIANS.find(p => p.id === politicianId);
  
  if (!politician) {
    return <>{children}</>;
  }

  const party = PARTIES.find(pt => pt.id === politician.partyId);
  const initials = politician.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <span className="relative group inline-block">
      {children}
      
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-150 z-50 w-[260px]">
        {/* Pointer triangle */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-8 border-transparent border-t-white/10"></div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[2px] border-[7px] border-transparent border-t-[var(--bg-raised)]"></div>

        <div className="bg-[var(--bg-raised)] border border-white/10 rounded-[var(--radius-md)] shadow-2xl overflow-hidden flex flex-col">
          <div className="p-4 flex items-start gap-4">
            {politician.photoUrl ? (
              <div className="w-[48px] h-[48px] relative rounded-full overflow-hidden flex-shrink-0 border border-white/10 bg-white/5">
                <Image
                  src={politician.photoUrl}
                  alt={politician.name}
                  fill
                  sizes="48px"
                  className="object-cover object-top"
                />
              </div>
            ) : (
              <div className="w-[48px] h-[48px] rounded-full flex-shrink-0 bg-white/10 flex items-center justify-center text-[16px] font-black text-white">
                {initials}
              </div>
            )}
            
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="text-[14px] font-bold text-white truncate leading-tight mb-1">
                {politician.name}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-tertiary)] truncate mb-1">
                {party?.logoUrl ? (
                  <div className="relative w-3 h-3 flex-shrink-0 bg-white rounded-full">
                    <Image src={party.logoUrl} alt={party.abbreviation} fill className="object-contain p-[1px]" sizes="12px" />
                  </div>
                ) : (
                  <Users className="w-3 h-3" />
                )}
                <span className="truncate">{party?.abbreviation || 'IND'} &middot; {politician.state}</span>
              </div>
              <div className="text-[11px] text-white/60 truncate">
                {politician.position}
              </div>
            </div>
          </div>
          
          <div className="bg-white/[0.02] border-t border-white/5 px-4 py-2">
            <Link 
              href={`/politicians/${politician.id}`}
              className="flex items-center justify-between text-[11px] font-bold text-[var(--text-tertiary)] hover:text-white uppercase tracking-wider transition-colors"
            >
              <span>View full profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </span>
  );
}
