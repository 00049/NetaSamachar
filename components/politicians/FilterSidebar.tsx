import clsx from 'clsx';
import { FilterControls } from '@/components/politicians/FilterControls';

export function FilterSidebar(props: any) {
  const { sidebarWidth, isResizing } = props;
  
  return (
    <aside 
      className="relative shrink-0 border-r border-white/20 bg-[var(--bg-base)] hidden lg:flex flex-col"
      style={{ width: sidebarWidth }}
    >
      <div className="p-6 flex-1 overflow-y-auto hide-scrollbar">
        <FilterControls {...props} />
      </div>
      
      {/* Drag Handle */}
      <div 
        className="absolute top-0 right-[-3px] w-2 h-full cursor-col-resize group/drag z-10 flex items-center justify-center"
        onMouseDown={() => {
          isResizing.current = true;
          document.body.style.cursor = 'col-resize';
          document.body.style.userSelect = 'none';
        }}
      >
        <div className="w-[3px] h-[32px] rounded-full bg-white/10 group-hover/drag:bg-white/40 transition-colors" />
      </div>
    </aside>
  );
}
