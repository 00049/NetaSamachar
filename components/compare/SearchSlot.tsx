'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { POLITICIANS, PARTIES } from '@/data/politicians';
import { Search, X } from 'lucide-react';

interface SearchSlotProps {
  type: 'party' | 'state' | 'constituency' | 'politician';
  value: string | null;
  selectedIds: string[];
  onChange: (value: string | null) => void;
}

export function SearchSlot({ type, value, selectedIds, onChange }: SearchSlotProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const options = useMemo(() => {
    switch (type) {
      case 'party':
        return PARTIES.map(p => ({ id: p.id, title: p.name, subtitle: p.abbreviation }));
      case 'state': {
        const states = Array.from(new Set(POLITICIANS.map(p => p.state)));
        return states.map(s => ({ id: s.toLowerCase().replace(/\s+/g, '-'), title: s, subtitle: 'State' }));
      }
      case 'constituency': {
        const consts = Array.from(new Set(POLITICIANS.map(p => p.constituency)));
        return consts.map(c => ({ id: c.toLowerCase().replace(/\s+/g, '-'), title: c, subtitle: 'Constituency' }));
      }
      case 'politician':
        return POLITICIANS.map(p => {
          const party = PARTIES.find(pt => pt.id === p.partyId);
          return { id: p.id, title: p.name, subtitle: `${party?.abbreviation || p.partyId} • ${p.constituency}` };
        });
    }
  }, [type]);

  const selectedOption = useMemo(() => options.find(o => o.id === value), [options, value]);

  const filteredOptions = useMemo(() => {
    let available = options.filter(o => !selectedIds.includes(o.id) || o.id === value);
    if (!query) return available;
    const q = query.toLowerCase();
    return available.filter(o => o.title.toLowerCase().includes(q) || o.subtitle?.toLowerCase().includes(q));
  }, [options, query, selectedIds, value]);

  if (selectedOption) {
    return (
      <div className="h-[60px] bg-white/[0.04] border border-white/[0.15] rounded-lg p-4 flex items-center justify-between">
        <div className="flex flex-col truncate pr-4">
          <span className="text-white font-semibold truncate">{selectedOption.title}</span>
          <span className="text-[#A1A1AA] text-xs truncate">{selectedOption.subtitle}</span>
        </div>
        <button 
          onClick={() => onChange(null)}
          className="p-1 hover:bg-white/[0.1] rounded-full text-[#A1A1AA] hover:text-white transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-[60px]" ref={containerRef}>
      <div className="absolute inset-0 bg-white/[0.02] border border-white/[0.08] focus-within:border-white/[0.3] rounded-lg flex items-center px-4 transition-colors">
        <Search className="w-5 h-5 text-[#71717A] mr-3 shrink-0" />
        <input 
          type="text"
          className="bg-transparent border-none outline-none w-full text-white placeholder-[#71717A]"
          placeholder={`Search ${type}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 max-h-[300px] overflow-y-auto bg-[#18181B] border border-white/[0.1] rounded-lg shadow-2xl z-50">
          {filteredOptions.length === 0 ? (
            <div className="p-4 text-[#71717A] text-sm text-center">No matches found.</div>
          ) : (
            filteredOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  onChange(opt.id);
                  setIsOpen(false);
                  setQuery('');
                }}
                className="w-full text-left px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.04] transition-colors last:border-b-0 flex flex-col"
              >
                <span className="text-white font-medium">{opt.title}</span>
                <span className="text-[#71717A] text-xs mt-0.5">{opt.subtitle}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
