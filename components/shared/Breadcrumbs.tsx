'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import React from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: Props) {
  return (
    <nav className="flex items-center text-[13px] text-[#A1A1AA] mb-[24px] overflow-x-auto no-scrollbar whitespace-nowrap" aria-label="Breadcrumb">
      <ol className="flex items-center gap-[8px]">
        <li>
          <Link href="/" className="hover:text-white transition-colors flex items-center justify-center p-1 rounded-md hover:bg-white/5">
            <Home className="w-[14px] h-[14px]" />
          </Link>
        </li>
        
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <React.Fragment key={index}>
              <ChevronRight className="w-[14px] h-[14px] text-white/20 shrink-0" />
              <li>
                {isLast || !item.href ? (
                  <span className="text-white font-medium px-1" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link 
                    href={item.href} 
                    className="hover:text-white transition-colors px-1 py-0.5 rounded-md hover:bg-white/5"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
