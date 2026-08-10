import React from 'react';
import { ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Simple pagination logic for now (shows up to 5 pages around the current page)
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);

  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <div className="flex items-center gap-[8px]">
      <button 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-[32px] h-[32px] flex items-center justify-center rounded-lg border border-white/5 text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-50 transition-colors"
      >
        <ChevronRight className="w-[14px] h-[14px] rotate-180" />
      </button>
      
      {startPage > 1 && (
        <>
          <button 
            onClick={() => onPageChange(1)}
            className="w-[32px] h-[32px] flex items-center justify-center rounded-lg border border-white/10 text-white hover:bg-white/[0.05] transition-colors"
          >
            1
          </button>
          {startPage > 2 && <span className="text-[#A1A1AA] px-1">...</span>}
        </>
      )}

      {pages.map(page => (
        <button 
          key={page}
          onClick={() => onPageChange(page)}
          className={clsx(
            "w-[32px] h-[32px] flex items-center justify-center rounded-lg border font-semibold text-[13px] transition-colors",
            currentPage === page 
              ? "border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981]" 
              : "border-white/10 text-white hover:bg-white/[0.05]"
          )}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="text-[#A1A1AA] px-1">...</span>}
          <button 
            onClick={() => onPageChange(totalPages)}
            className="w-[32px] h-[32px] flex items-center justify-center rounded-lg border border-white/10 text-white hover:bg-white/[0.05] transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      <button 
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-[32px] h-[32px] flex items-center justify-center rounded-lg border border-white/5 text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-50 transition-colors"
      >
        <ChevronRight className="w-[14px] h-[14px]" />
      </button>
    </div>
  );
}
