'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SelectionContextType {
  selectedIds: string[];
  type: 'politician' | 'party' | 'state' | 'constituency';
  toggleSelection: (id: string) => void;
  clearSelection: () => void;
  isSelected: (id: string) => boolean;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export function CheckboxSelectionProvider({ 
  children, 
  type 
}: { 
  children: ReactNode;
  type: 'politician' | 'party' | 'state' | 'constituency';
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      } else {
        if (prev.length >= 3) {
          alert("Compare up to 3 at a time");
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const clearSelection = () => setSelectedIds([]);
  const isSelected = (id: string) => selectedIds.includes(id);

  return (
    <SelectionContext.Provider value={{ selectedIds, type, toggleSelection, clearSelection, isSelected }}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  return useContext(SelectionContext);
}
