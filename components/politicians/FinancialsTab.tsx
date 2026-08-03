'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Politician, AssetDeclaration, PoliticalOffice, AssetComposition, LiabilityBreakdown, IncomeSource } from '@/lib/types';
import { 
  TrendingUp, 
  Wallet, 
  ArrowUp, 
  ArrowDown, 
  Info, 
  ChevronDown, 
  ChevronRight, 
  Building2,
  Landmark,
  Coins,
  ShieldAlert,
  Calendar,
  Briefcase,
  PieChart,
  BarChart4,
  Activity,
  Award
} from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';

interface Props {
  politician: Politician;
}

export function FinancialsTab({ politician }: Props) {
  const declarations = [...(politician.assetDeclarations || [])].sort((a, b) => a.year - b.year);
  
  if (declarations.length === 0) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 border border-white/10 p-12 text-center rounded-[16px] bg-white/[0.02]">
        <h3 className="text-white font-bold mb-2">No Financial Data</h3>
        <p className="text-[#A1A1AA] text-[13px]">No asset declarations or financial data available.</p>
      </div>
    );
  }

  // --- Helpers ---
  const formatCurrency = (val: number | undefined) => {
    if (val === undefined) return '₹0';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString()}`;
  };

  const getNetWorth = (d: AssetDeclaration) => d.totalAssets - d.totalLiabilities;

  // --- Top Level Calculations ---
  const first = declarations[0];
  const latest = declarations[declarations.length - 1];
  const yearsCovered = latest.year - first.year;
  
  const currentNetWorth = getNetWorth(latest);
  const firstNetWorth = getNetWorth(first);
  const netWorthGrowthPercent = firstNetWorth > 0 ? ((currentNetWorth - firstNetWorth) / firstNetWorth) * 100 : 0;
  
  const totalAssetGrowthPercent = first.totalAssets > 0 ? ((latest.totalAssets - first.totalAssets) / first.totalAssets) * 100 : 0;
  const absoluteAssetIncrease = latest.totalAssets - first.totalAssets;
  
  const cagr = first.totalAssets > 0 && yearsCovered > 0 ? (Math.pow(latest.totalAssets / first.totalAssets, 1 / yearsCovered) - 1) * 100 : 0;

  // Financial Growth Indicator Logic (Neutral Language)
  const getGrowthIndicator = () => {
    if (yearsCovered === 0) return { label: 'Stable', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' };
    if (cagr > 30) return { label: 'High Growth Relative to Timeline', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
    if (cagr > 15) return { label: 'Above Expected Growth', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' };
    if (cagr > 5) return { label: 'Normal Growth', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' };
    return { label: 'Stable or Declining', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' };
  };
  const indicator = getGrowthIndicator();

  // Extract unique offices held
  const timeline = politician.careerTimeline || [];
  const uniqueOffices = Array.from(new Set(timeline.map(t => t.title.split('(')[0].trim()))).join(' • ');

  // State
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-[32px] animate-in fade-in slide-in-from-bottom-4 duration-500 pb-[100px]">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-[16px]">
        <div>
          <h2 className="text-[#22c55e] text-[11px] font-bold uppercase tracking-widest mb-[4px]">Financial Intelligence</h2>
          <h3 className="text-white text-[28px] font-bold mb-[4px]">Financial Growth & Wealth Timeline</h3>
          <p className="text-[#A1A1AA] text-[14px] max-w-[600px] leading-relaxed">
            Track how declared wealth, liabilities and income evolved across election affidavits and compare financial growth with periods of public office.
          </p>
        </div>
      </div>

      {/* HERO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px]">
        <div className="premium-card p-[20px] flex flex-col justify-between">
          <div className="text-[#A1A1AA] text-[12px] font-medium mb-[12px] flex items-center gap-[6px]">
            <Wallet className="w-[14px] h-[14px] text-purple-400" />
            Current Net Worth
          </div>
          <div>
            <div className="text-white text-[28px] font-bold leading-none mb-[8px]">{formatCurrency(currentNetWorth)}</div>
            <div className="text-[12px] text-[#A1A1AA] flex items-center gap-[4px]">
              <span className={clsx("font-semibold flex items-center", netWorthGrowthPercent >= 0 ? "text-[var(--color-accent-positive)]" : "text-red-500")}>
                {netWorthGrowthPercent >= 0 ? <ArrowUp className="w-[12px] h-[12px] mr-[2px]"/> : <ArrowDown className="w-[12px] h-[12px] mr-[2px]"/>}
                {Math.abs(netWorthGrowthPercent).toFixed(1)}%
              </span>
              since {first.year}
            </div>
          </div>
        </div>

        <div className="premium-card p-[20px] flex flex-col justify-between">
          <div className="text-[#A1A1AA] text-[12px] font-medium mb-[12px] flex items-center gap-[6px]">
            <TrendingUp className="w-[14px] h-[14px] text-blue-400" />
            Total Asset Growth
          </div>
          <div>
            <div className="text-white text-[28px] font-bold leading-none mb-[8px]">{formatCurrency(latest.totalAssets)}</div>
            <div className="text-[12px] text-[#A1A1AA] flex items-center gap-[4px]">
              <span className={clsx("font-semibold flex items-center", totalAssetGrowthPercent >= 0 ? "text-[var(--color-accent-positive)]" : "text-red-500")}>
                {totalAssetGrowthPercent >= 0 ? <ArrowUp className="w-[12px] h-[12px] mr-[2px]"/> : <ArrowDown className="w-[12px] h-[12px] mr-[2px]"/>}
                {Math.abs(totalAssetGrowthPercent).toFixed(1)}%
              </span>
              (+{formatCurrency(absoluteAssetIncrease)})
            </div>
          </div>
        </div>

        <div className="premium-card p-[20px] flex flex-col justify-between">
          <div className="text-[#A1A1AA] text-[12px] font-medium mb-[12px] flex items-center gap-[6px]">
            <Award className="w-[14px] h-[14px] text-emerald-400" />
            Years in Public Office
          </div>
          <div>
            <div className="text-white text-[28px] font-bold leading-none mb-[8px]">{politician.yearsInPolitics} Years</div>
            <div className="text-[12px] text-[#A1A1AA] truncate" title={uniqueOffices || 'Various Offices'}>
              {uniqueOffices || 'Various Offices'}
            </div>
          </div>
        </div>

        <div className="premium-card p-[20px] flex flex-col justify-between">
          <div className="text-[#A1A1AA] text-[12px] font-medium mb-[12px] flex items-center justify-between">
            <span className="flex items-center gap-[6px]">
              <Activity className="w-[14px] h-[14px] text-amber-400" />
              Financial Growth Indicator
            </span>
            <div className="group relative cursor-help">
              <Info className="w-[14px] h-[14px] text-[#A1A1AA] hover:text-white" />
              <div className="absolute right-0 top-[24px] w-[240px] p-[12px] rounded-[8px] bg-[#1A1A1A] border border-white/10 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 text-[11px] text-[#A1A1AA] font-normal leading-relaxed">
                Methodology: Combines CAGR, absolute growth, asset concentration, and time covered to provide a neutral, evidence-based indicator of wealth trajectory. This is not an accusation of illegality.
              </div>
            </div>
          </div>
          <div>
            <div className={clsx("inline-flex items-center px-[10px] py-[4px] rounded-[6px] border text-[13px] font-bold mb-[8px]", indicator.bg, indicator.border, indicator.color)}>
              {indicator.label}
            </div>
            <div className="text-[12px] text-[#A1A1AA]">
              CAGR: {cagr.toFixed(1)}% over {yearsCovered} years
            </div>
          </div>
        </div>
      </div>

      {declarations.length > 1 ? (
        <TimelineOverlay declarations={declarations} timeline={timeline} hoveredYear={hoveredYear} setHoveredYear={setHoveredYear} formatCurrency={formatCurrency} />
      ) : (
        <div className="premium-card p-[24px] flex items-center gap-[16px]">
          <Info className="w-[20px] h-[20px] text-[#3B82F6]" />
          <div>
            <h4 className="text-white font-medium text-[14px]">Only one affidavit is available.</h4>
            <p className="text-[#A1A1AA] text-[13px]">Financial growth trends will appear as additional affidavits become available.</p>
          </div>
        </div>
      )}

      {/* ELECTION COMPARISON */}
      <div>
        <h3 className="text-white text-[18px] font-bold mb-[16px] flex items-center gap-[8px]">
          <Calendar className="w-[18px] h-[18px] text-[#A1A1AA]" />
          Affidavit Details & Election Comparison
        </h3>
        <div className="flex flex-col gap-[12px]">
          {declarations.map((dec, idx) => {
            const isExpanded = expandedCard === idx;
            const nw = dec.totalAssets - dec.totalLiabilities;
            return (
              <div key={dec.year} className="premium-card overflow-hidden transition-all duration-300">
                <div 
                  className="p-[20px] cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-[16px] hover:bg-white/[0.02]"
                  onClick={() => setExpandedCard(isExpanded ? null : idx)}
                >
                  <div className="flex items-center gap-[24px]">
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-[20px]">{dec.year}</span>
                      <span className="text-[#A1A1AA] text-[12px]">{dec.electionType || 'Election'}</span>
                    </div>
                    <div className="w-[1px] h-[30px] bg-white/10 hidden md:block"></div>
                    <div className="flex flex-col">
                      <span className="text-[#A1A1AA] text-[11px] uppercase tracking-wider mb-[2px]">Net Worth</span>
                      <span className="text-white font-semibold text-[16px]">{formatCurrency(nw)}</span>
                    </div>
                    <div className="w-[1px] h-[30px] bg-white/10 hidden md:block"></div>
                    <div className="flex flex-col">
                      <span className="text-[#A1A1AA] text-[11px] uppercase tracking-wider mb-[2px]">Growth</span>
                      <span className={clsx("font-semibold text-[14px]", dec.growthPercent && dec.growthPercent > 0 ? 'text-[var(--color-accent-positive)]' : 'text-[#A1A1AA]')}>
                        {dec.growthPercent ? `+${dec.growthPercent}%` : '---'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-[16px]">
                    <div className="flex flex-col items-end hidden md:flex">
                      <span className="text-white text-[13px] font-medium">{dec.party || politician.partyId.toUpperCase()}</span>
                      <span className="text-[#A1A1AA] text-[12px]">{dec.constituency || politician.constituency}</span>
                    </div>
                    <ChevronDown className={clsx("w-[20px] h-[20px] text-[#A1A1AA] transition-transform duration-300", isExpanded && "rotate-180")} />
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/5 bg-white/[0.01]"
                    >
                      <div className="p-[20px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px]">
                        <div>
                          <div className="text-[#A1A1AA] text-[11px] uppercase tracking-wider mb-[8px]">Assets</div>
                          <div className="flex justify-between items-center mb-[4px]">
                            <span className="text-[#A1A1AA] text-[13px]">Movable</span>
                            <span className="text-white text-[13px] font-medium">{formatCurrency(dec.movableAssets)}</span>
                          </div>
                          <div className="flex justify-between items-center mb-[4px]">
                            <span className="text-[#A1A1AA] text-[13px]">Immovable</span>
                            <span className="text-white text-[13px] font-medium">{formatCurrency(dec.immovableAssets)}</span>
                          </div>
                          <div className="flex justify-between items-center pt-[4px] border-t border-white/10 mt-[4px]">
                            <span className="text-[#A1A1AA] text-[13px]">Total Assets</span>
                            <span className="text-[#22c55e] text-[13px] font-bold">{formatCurrency(dec.totalAssets)}</span>
                          </div>
                        </div>

                        <div>
                          <div className="text-[#A1A1AA] text-[11px] uppercase tracking-wider mb-[8px]">Liabilities & Income</div>
                          <div className="flex justify-between items-center mb-[4px]">
                            <span className="text-[#A1A1AA] text-[13px]">Total Liabilities</span>
                            <span className="text-red-400 text-[13px] font-medium">{formatCurrency(dec.totalLiabilities)}</span>
                          </div>
                          {dec.declaredIncome !== undefined && (
                            <div className="flex justify-between items-center mb-[4px]">
                              <span className="text-[#A1A1AA] text-[13px]">Declared Income</span>
                              <span className="text-white text-[13px] font-medium">{formatCurrency(dec.declaredIncome)}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center pt-[4px] border-t border-white/10 mt-[4px]">
                            <span className="text-[#A1A1AA] text-[13px]">Net Worth</span>
                            <span className="text-purple-400 text-[13px] font-bold">{formatCurrency(nw)}</span>
                          </div>
                        </div>
                        
                        {dec.winner !== undefined && (
                          <div className="lg:col-span-2">
                            <div className="text-[#A1A1AA] text-[11px] uppercase tracking-wider mb-[8px]">Election Result</div>
                            <div className="flex flex-col gap-[4px] bg-[#111] p-[12px] rounded-[8px] border border-white/5">
                              <div className="flex items-center justify-between">
                                <span className="text-white text-[13px] font-medium flex items-center gap-[6px]">
                                  {dec.winner ? <span className="w-[8px] h-[8px] rounded-full bg-green-500"></span> : <span className="w-[8px] h-[8px] rounded-full bg-red-500"></span>}
                                  {dec.winner ? 'Won Election' : 'Lost Election'}
                                </span>
                                {dec.margin && <span className="text-[#A1A1AA] text-[12px]">Margin: {dec.margin.toLocaleString()} votes</span>}
                              </div>
                              {dec.runnerUp && (
                                <div className="text-[#A1A1AA] text-[12px] mt-[4px]">
                                  Opponent: {dec.runnerUp}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAILED BREAKDOWNS */}
      {latest.assetComposition || latest.liabilityBreakdown || latest.incomeSources ? (
        <div>
          <h3 className="text-white text-[18px] font-bold mb-[16px] flex items-center gap-[8px]">
            <PieChart className="w-[18px] h-[18px] text-[#A1A1AA]" />
            Latest Composition ({latest.year})
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
            {latest.assetComposition && <AssetCompositionCard comp={latest.assetComposition} total={latest.totalAssets} format={formatCurrency} />}
            {latest.liabilityBreakdown && <LiabilityBreakdownCard comp={latest.liabilityBreakdown} total={latest.totalLiabilities} format={formatCurrency} />}
            {latest.incomeSources && <IncomeSourcesCard comp={latest.incomeSources} format={formatCurrency} />}
          </div>
        </div>
      ) : null}

      {/* AI INSIGHTS */}
      <div className="premium-card p-[24px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-blue-500/10 blur-[60px] pointer-events-none rounded-full" />
        <h3 className="text-white text-[16px] font-bold mb-[16px] flex items-center gap-[8px]">
          <BarChart4 className="w-[16px] h-[16px] text-blue-400" />
          Financial Insights
        </h3>
        <ul className="flex flex-col gap-[12px]">
          {yearsCovered > 0 && (
            <li className="flex items-start gap-[12px]">
              <div className="w-[6px] h-[6px] rounded-full bg-blue-400 mt-[6px] shrink-0" />
              <p className="text-[#A1A1AA] text-[14px] leading-relaxed">
                Net worth increased by <span className="text-white font-semibold">{netWorthGrowthPercent.toFixed(1)}%</span> from {first.year} to {latest.year}, reflecting a CAGR of <span className="text-white font-semibold">{cagr.toFixed(1)}%</span>.
              </p>
            </li>
          )}
          {declarations.length > 2 && (
             <li className="flex items-start gap-[12px]">
               <div className="w-[6px] h-[6px] rounded-full bg-blue-400 mt-[6px] shrink-0" />
               <p className="text-[#A1A1AA] text-[14px] leading-relaxed">
                 The largest percentage increase in total assets occurred during the <span className="text-white font-semibold">{
                   declarations.reduce((prev, current) => (prev.growthPercent || 0) > (current.growthPercent || 0) ? prev : current).year
                 }</span> affidavit.
               </p>
             </li>
          )}
          <li className="flex items-start gap-[12px]">
            <div className="w-[6px] h-[6px] rounded-full bg-blue-400 mt-[6px] shrink-0" />
            <p className="text-[#A1A1AA] text-[14px] leading-relaxed">
              Liabilities currently represent <span className="text-white font-semibold">{((latest.totalLiabilities / (latest.totalAssets || 1)) * 100).toFixed(1)}%</span> of declared total assets.
            </p>
          </li>
          <li className="flex items-start gap-[12px]">
            <div className="w-[6px] h-[6px] rounded-full bg-blue-400 mt-[6px] shrink-0" />
            <p className="text-[#A1A1AA] text-[14px] leading-relaxed">
              Most wealth is historically held in <span className="text-white font-semibold">{latest.immovableAssets > latest.movableAssets ? 'immovable' : 'movable'} assets</span>, constituting {((Math.max(latest.immovableAssets, latest.movableAssets) / (latest.totalAssets || 1)) * 100).toFixed(1)}% of the total portfolio.
            </p>
          </li>
        </ul>
      </div>

    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function TimelineOverlay({ declarations, timeline, hoveredYear, setHoveredYear, formatCurrency }: any) {
  // We need to map declarations and timeline to a common visual x-axis.
  // We'll use the year as the primary axis.
  const minYear = Math.min(...declarations.map((d: any) => d.year), ...(timeline.map((t: any) => t.startYear) || []));
  const maxYear = new Date().getFullYear();
  const yearRange = maxYear - minYear;

  const getX = (year: number) => {
    if (yearRange === 0) return 50;
    return ((year - minYear) / yearRange) * 100;
  };

  // Find max asset for Y scale in the sparkline
  const maxAsset = Math.max(...declarations.map((d: any) => d.totalAssets));

  return (
    <div className="premium-card p-[24px] pt-[32px] overflow-hidden relative">
       <h3 className="text-white text-[16px] font-bold mb-[40px] flex items-center gap-[8px]">
         <TrendingUp className="w-[16px] h-[16px] text-emerald-400" />
         Wealth vs Public Office Timeline
       </h3>
       
       <div className="relative w-full h-[220px] mb-[20px]" onMouseLeave={() => setHoveredYear(null)}>
         
         {/* Financial Line Chart */}
         <div className="absolute inset-0 bottom-[60px]">
           <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
             {declarations.map((d: any, i: number) => {
               if (i === 0) return null;
               const prev = declarations[i - 1];
               const x1 = getX(prev.year);
               const x2 = getX(d.year);
               const y1 = 100 - (prev.totalAssets / maxAsset) * 100;
               const y2 = 100 - (d.totalAssets / maxAsset) * 100;
               
               return (
                 <motion.line 
                   key={i}
                   x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`}
                   stroke="#22c55e" strokeWidth="2"
                   initial={{ pathLength: 0 }}
                   animate={{ pathLength: 1 }}
                   transition={{ duration: 1.5, ease: "easeOut", delay: i * 0.2 }}
                 />
               );
             })}
           </svg>
           
           {/* Data Points */}
           {declarations.map((d: any) => {
             const x = getX(d.year);
             const y = 100 - (d.totalAssets / maxAsset) * 100;
             const isHovered = hoveredYear === d.year;
             
             return (
               <div 
                 key={d.year} 
                 className="absolute w-[12px] h-[12px] bg-[#111] border-2 border-emerald-500 rounded-full cursor-pointer z-20 transition-transform hover:scale-150"
                 style={{ left: `calc(${x}% - 6px)`, top: `calc(${y}% - 6px)` }}
                 onMouseEnter={() => setHoveredYear(d.year)}
               >
                 {isHovered && (
                   <div className="absolute bottom-[20px] left-1/2 -translate-x-1/2 bg-[#222] border border-white/10 rounded-[8px] p-[12px] min-w-[160px] shadow-2xl z-30 pointer-events-none">
                     <div className="text-white font-bold text-[14px] mb-[4px]">{d.year} Affidavit</div>
                     <div className="text-emerald-400 font-semibold text-[16px] mb-[4px]">{formatCurrency(d.totalAssets)}</div>
                     <div className="text-[#A1A1AA] text-[11px]">Net Worth: {formatCurrency(d.totalAssets - d.totalLiabilities)}</div>
                   </div>
                 )}
               </div>
             );
           })}
         </div>

         {/* Political Career Gantt Chart */}
         <div className="absolute bottom-0 left-0 right-0 h-[40px] bg-white/[0.02] rounded-[8px] border border-white/5 relative overflow-hidden">
           {timeline.map((t: any, i: number) => {
             const endY = t.endYear === 'Present' ? maxYear : t.endYear;
             const startX = getX(t.startYear);
             const endX = getX(endY);
             const width = endX - startX;
             
             return (
               <motion.div
                 key={i}
                 initial={{ width: 0, opacity: 0 }}
                 animate={{ width: `${width}%`, opacity: 1 }}
                 transition={{ duration: 1, delay: 0.5 + (i * 0.2) }}
                 className="absolute top-[4px] bottom-[4px] bg-blue-500/20 border border-blue-500/40 rounded-[4px] flex items-center justify-center overflow-hidden group cursor-default"
                 style={{ left: `${startX}%` }}
               >
                 <span className="text-blue-300 text-[10px] font-medium px-[4px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                   {t.title}
                 </span>
               </motion.div>
             );
           })}
         </div>
       </div>

       {/* X-Axis Labels */}
       <div className="relative w-full h-[20px]">
         {declarations.map((d: any) => (
           <div 
             key={d.year} 
             className="absolute text-[#A1A1AA] text-[11px] font-medium -translate-x-1/2"
             style={{ left: `${getX(d.year)}%` }}
           >
             {d.year}
           </div>
         ))}
       </div>
    </div>
  );
}

function AssetCompositionCard({ comp, total, format }: any) {
  const bars = [
    { label: 'Agricultural Land', val: comp.agriculturalLand, color: 'bg-emerald-500' },
    { label: 'Residential', val: comp.residentialProperty, color: 'bg-emerald-400' },
    { label: 'Commercial', val: comp.commercialProperty, color: 'bg-emerald-300' },
    { label: 'Jewellery/Gold', val: (comp.jewellery || 0) + (comp.gold || 0), color: 'bg-yellow-500' },
    { label: 'Vehicles', val: comp.vehicles, color: 'bg-blue-400' },
    { label: 'Cash & Bank', val: (comp.cash || 0) + (comp.bankDeposits || 0), color: 'bg-purple-400' },
  ].filter(b => b.val > 0).sort((a, b) => b.val - a.val);

  return (
    <div className="premium-card p-[20px] flex flex-col">
      <h4 className="text-[#A1A1AA] text-[12px] font-medium uppercase tracking-wider mb-[16px]">Asset Composition</h4>
      <div className="flex-1 flex flex-col justify-center gap-[12px]">
        {bars.map(b => (
          <div key={b.label}>
            <div className="flex justify-between text-[12px] mb-[4px]">
              <span className="text-[#D4D4D8]">{b.label}</span>
              <span className="text-white font-medium">{format(b.val)}</span>
            </div>
            <div className="w-full h-[6px] bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${(b.val / total) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={clsx("h-full rounded-full", b.color)} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LiabilityBreakdownCard({ comp, total, format }: any) {
  const bars = [
    { label: 'Housing Loan', val: comp.housingLoan, color: 'bg-red-400' },
    { label: 'Vehicle Loan', val: comp.vehicleLoan, color: 'bg-orange-400' },
    { label: 'Business Loan', val: comp.businessLoan, color: 'bg-amber-500' },
    { label: 'Tax Dues', val: comp.taxDues, color: 'bg-rose-500' },
    { label: 'Other Liabilities', val: comp.otherLiabilities, color: 'bg-red-300' },
  ].filter(b => b.val > 0).sort((a, b) => b.val - a.val);

  return (
    <div className="premium-card p-[20px] flex flex-col">
      <h4 className="text-[#A1A1AA] text-[12px] font-medium uppercase tracking-wider mb-[16px]">Liability Breakdown</h4>
      <div className="flex-1 flex flex-col justify-center gap-[12px]">
        {bars.map(b => (
          <div key={b.label}>
            <div className="flex justify-between text-[12px] mb-[4px]">
              <span className="text-[#D4D4D8]">{b.label}</span>
              <span className="text-white font-medium">{format(b.val)}</span>
            </div>
            <div className="w-full h-[6px] bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${(b.val / total) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={clsx("h-full rounded-full", b.color)} 
              />
            </div>
          </div>
        ))}
        {bars.length === 0 && <div className="text-[#A1A1AA] text-[12px]">No detailed liability breakdown.</div>}
      </div>
    </div>
  );
}

function IncomeSourcesCard({ comp, format }: any) {
  const total = Object.values(comp).reduce((a: any, b: any) => a + (b || 0), 0) as number;
  const bars = [
    { label: 'Salary', val: comp.salary, color: 'bg-emerald-400' },
    { label: 'Agriculture', val: comp.agriculture, color: 'bg-lime-400' },
    { label: 'Business', val: comp.business, color: 'bg-blue-400' },
    { label: 'Other', val: comp.otherSources, color: 'bg-purple-400' },
  ].filter(b => b.val > 0).sort((a, b) => b.val - a.val);

  return (
    <div className="premium-card p-[20px] flex flex-col">
      <h4 className="text-[#A1A1AA] text-[12px] font-medium uppercase tracking-wider mb-[16px]">Income Sources</h4>
      <div className="flex-1 flex flex-col justify-center gap-[12px]">
        {bars.map(b => (
          <div key={b.label}>
            <div className="flex justify-between text-[12px] mb-[4px]">
              <span className="text-[#D4D4D8]">{b.label}</span>
              <span className="text-white font-medium">{format(b.val)}</span>
            </div>
            <div className="w-full h-[6px] bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${(b.val / total) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={clsx("h-full rounded-full", b.color)} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
