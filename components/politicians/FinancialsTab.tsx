'use client';

import { Politician } from '@/lib/types';
import { 
  ChevronDown,
  TrendingUp,
  AlertTriangle,
  Building2,
  ShieldAlert,
  Wallet,
  ArrowUp,
  ArrowDown,
  Info,
  ChevronRight,
  Landmark,
  Coins
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

  // Formatting helper
  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString()}`;
  };

  const latest = declarations[declarations.length - 1];
  const previous = declarations.length > 1 ? declarations[0] : latest;

  const assetGrowth = previous.totalAssets > 0 ? ((latest.totalAssets - previous.totalAssets) / previous.totalAssets) * 100 : 0;
  const cagr = previous.totalAssets > 0 && latest.year > previous.year ? (Math.pow(latest.totalAssets / previous.totalAssets, 1 / (latest.year - previous.year)) - 1) * 100 : 0;
  const netWorth = latest.totalAssets - latest.totalLiabilities;
  const prevNetWorth = previous.totalAssets - previous.totalLiabilities;
  const netWorthGrowth = prevNetWorth > 0 ? ((netWorth - prevNetWorth) / prevNetWorth) * 100 : 0;
  const liabilityGrowth = previous.totalLiabilities > 0 ? ((latest.totalLiabilities - previous.totalLiabilities) / previous.totalLiabilities) * 100 : 0;

  // Custom Line Chart Data Mapping for SVG
  const chartWidth = 800;
  const chartHeight = 260;
  const paddingX = 40;
  const paddingY = 40;
  const innerWidth = chartWidth - paddingX * 2;
  const innerHeight = chartHeight - paddingY * 2;
  
  const maxY = Math.max(...declarations.map(d => d.totalAssets)) * 1.2 || 1;
  
  const getCoordinates = (index: number, val: number) => {
    const x = paddingX + (index * (innerWidth / (declarations.length - 1 || 1)));
    const y = chartHeight - paddingY - ((val / maxY) * innerHeight);
    return { x, y };
  };

  const assetPoints = declarations.map((d, i) => `${getCoordinates(i, d.totalAssets).x},${getCoordinates(i, d.totalAssets).y}`).join(' ');

  // Create path for asset gradient fill
  const assetAreaPath = `M ${getCoordinates(0, declarations[0].totalAssets).x},${chartHeight - paddingY} L ${assetPoints} L ${getCoordinates(declarations.length - 1, declarations[declarations.length - 1].totalAssets).x},${chartHeight - paddingY} Z`;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-[16px] mb-[32px]">
        <div>
          <h2 className="text-[#22c55e] text-[11px] font-bold uppercase tracking-widest mb-[4px]">Financial Overview</h2>
          <h3 className="text-white text-[28px] font-bold mb-[4px]">Assets & Financials</h3>
          <p className="text-[#A1A1AA] text-[13px]">Track declared assets, liabilities, income sources and financial growth over time.</p>
        </div>
        <div className="flex flex-col items-end gap-[16px] w-full md:w-[320px]">
          <div className="w-full flex items-center justify-between md:justify-end gap-[12px]">
            <span className="text-[#A1A1AA] text-[11px] uppercase tracking-wider">Select Election Affidavit</span>
            <button className="flex items-center gap-[4px] px-[12px] py-[6px] rounded-[6px] border border-white/10 text-white text-[12px] hover:bg-white/[0.02] transition-colors bg-[#111111]">
              2024 (Latest) <ChevronDown className="w-[14px] h-[14px] text-[#A1A1AA] ml-2" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-[24px]">
        
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-[24px]">
          
          {/* Top Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-[12px]">
            
            {/* Total Assets */}
            <div className="premium-card p-[16px]">
              <div className="flex items-center gap-[12px] mb-[12px]">
                <div className="w-[32px] h-[32px] rounded-lg bg-[var(--color-accent-positive)]/10 border border-[var(--color-accent-positive)]/20 flex items-center justify-center">
                  <Wallet className="w-[16px] h-[16px] text-[var(--color-accent-positive)]" />
                </div>
                <div className="text-[#A1A1AA] text-[11px] font-medium leading-tight">Total Assets ({latest.year})</div>
              </div>
              <div className="text-white font-bold text-[22px] mb-[8px]">{formatCurrency(latest.totalAssets)}</div>
              {declarations.length > 1 && (
                <div className="flex items-center gap-[4px] text-[11px]">
                  <span className={clsx("font-bold flex items-center", assetGrowth >= 0 ? "text-[var(--color-accent-positive)]" : "text-red-500")}>
                    {assetGrowth >= 0 ? <ArrowUp className="w-[12px] h-[12px] mr-[2px]"/> : <ArrowDown className="w-[12px] h-[12px] mr-[2px]"/>}
                    {Math.abs(assetGrowth).toFixed(1)}%
                  </span>
                  <span className="text-[#52525B]">vs {previous.year} ({formatCurrency(previous.totalAssets)})</span>
                </div>
              )}
            </div>

            {/* Total Liabilities */}
            <div className="premium-card p-[16px]">
              <div className="flex items-center gap-[12px] mb-[12px]">
                <div className="w-[32px] h-[32px] rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <Landmark className="w-[16px] h-[16px] text-red-500" />
                </div>
                <div className="text-[#A1A1AA] text-[11px] font-medium leading-tight">Total Liabilities ({latest.year})</div>
              </div>
              <div className="text-white font-bold text-[22px] mb-[8px]">{formatCurrency(latest.totalLiabilities)}</div>
              {declarations.length > 1 && (
                <div className="flex items-center gap-[4px] text-[11px]">
                  <span className={clsx("font-bold flex items-center", liabilityGrowth >= 0 ? "text-red-500" : "text-[var(--color-accent-positive)]")}>
                    {liabilityGrowth >= 0 ? <ArrowUp className="w-[12px] h-[12px] mr-[2px]"/> : <ArrowDown className="w-[12px] h-[12px] mr-[2px]"/>}
                    {Math.abs(liabilityGrowth).toFixed(1)}%
                  </span>
                  <span className="text-[#52525B]">vs {previous.year} ({formatCurrency(previous.totalLiabilities)})</span>
                </div>
              )}
            </div>

            {/* Net Worth */}
            <div className="premium-card p-[16px]">
              <div className="flex items-center gap-[12px] mb-[12px]">
                <div className="w-[32px] h-[32px] rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Coins className="w-[16px] h-[16px] text-purple-500" />
                </div>
                <div className="text-[#A1A1AA] text-[11px] font-medium leading-tight">Net Worth ({latest.year})</div>
              </div>
              <div className="text-white font-bold text-[22px] mb-[8px]">{formatCurrency(netWorth)}</div>
              {declarations.length > 1 && (
                <div className="flex items-center gap-[4px] text-[11px]">
                  <span className={clsx("font-bold flex items-center", netWorthGrowth >= 0 ? "text-[var(--color-accent-positive)]" : "text-red-500")}>
                    {netWorthGrowth >= 0 ? <ArrowUp className="w-[12px] h-[12px] mr-[2px]"/> : <ArrowDown className="w-[12px] h-[12px] mr-[2px]"/>}
                    {Math.abs(netWorthGrowth).toFixed(1)}%
                  </span>
                  <span className="text-[#52525B]">vs {previous.year} ({formatCurrency(prevNetWorth)})</span>
                </div>
              )}
            </div>

            {/* Asset Growth */}
            <div className="premium-card p-[16px]">
              <div className="flex items-center gap-[12px] mb-[12px]">
                <div className="w-[32px] h-[32px] rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center">
                  <TrendingUp className="w-[16px] h-[16px] text-[#3b82f6]" />
                </div>
                <div className="text-[#A1A1AA] text-[11px] font-medium leading-tight">Asset Growth ({latest.year - previous.year} Yrs)</div>
              </div>
              <div className="text-white font-bold text-[22px] mb-[8px]">{assetGrowth.toFixed(1)}%</div>
              <div className="text-[#52525B] text-[11px]">CAGR: {cagr.toFixed(1)}%</div>
            </div>

          </div>

          {/* MAIN CHART */}
          <div className="premium-card p-[24px]">
            <div className="flex items-start justify-between mb-[32px]">
              <div>
                <h3 className="text-white text-[15px] font-bold flex items-center gap-[6px] mb-[4px]">
                  Asset Growth Over Time <Info className="w-[14px] h-[14px] text-[#A1A1AA]" />
                </h3>
                <p className="text-[#A1A1AA] text-[13px]">Declared assets over the years.</p>
                <div className="flex items-center gap-[24px] mt-[16px]">
                  <div className="flex items-center gap-[8px]">
                    <div className="w-[16px] h-[2px] bg-[#22c55e]" />
                    <span className="text-white text-[11px]">Total Assets (₹)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-[16px]">
                 <div className="flex items-center rounded-[8px] border border-white/10 bg-[#111111] p-[2px]">
                   <button className="px-[12px] py-[6px] rounded-[6px] text-[var(--color-accent-positive)] bg-white/5 text-[12px] font-medium border border-white/5">Graph View</button>
                   <button className="px-[12px] py-[6px] rounded-[6px] text-[#A1A1AA] hover:text-white hover:bg-white/5 text-[12px] font-medium">Table View</button>
                 </div>
                 <button className="flex items-center gap-[6px] px-[12px] py-[6px] rounded-[6px] border border-white/10 text-[#A1A1AA] hover:text-white bg-[#111111] transition-colors text-[12px]">
                   Adjust for Inflation <Info className="w-[14px] h-[14px]" />
                 </button>
              </div>
            </div>

            <div className="w-full overflow-x-auto custom-scrollbar relative">
              <div className="min-w-[700px] h-[260px] relative">
                {/* Y-Axis Labels */}
                <div className="absolute left-0 top-0 bottom-[40px] w-[35px] flex flex-col justify-between text-[#52525B] text-[10px] font-medium z-10 pointer-events-none">
                  <span>{formatCurrency(maxY)}</span>
                  <span>{formatCurrency(maxY * 0.75)}</span>
                  <span>{formatCurrency(maxY * 0.5)}</span>
                  <span>{formatCurrency(maxY * 0.25)}</span>
                  <span>₹0</span>
                </div>
                
                {/* Horizontal Grids */}
                <div className="absolute left-[35px] right-[20px] top-0 bottom-[40px] flex flex-col justify-between pointer-events-none">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-full h-[1px] bg-white/5" />
                  ))}
                </div>

                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full preserve-aspect-ratio-none pointer-events-none relative z-10" style={{ marginLeft: '-5px' }}>
                   {/* Gradient Def */}
                   <defs>
                     <linearGradient id="assetGradient" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
                       <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                     </linearGradient>
                   </defs>

                   {/* Area Fill */}
                   <path d={assetAreaPath} fill="url(#assetGradient)" />
                   
                   {/* Asset Line */}
                   <path d={`M ${assetPoints}`} fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                   
                   {/* Data Points and Value Labels */}
                   {declarations.map((d, i) => {
                     const aPos = getCoordinates(i, d.totalAssets);
                     return (
                       <g key={i}>
                         <circle cx={aPos.x} cy={aPos.y} r="3" fill="#22c55e" />
                         <text x={aPos.x} y={aPos.y - 10} fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">{formatCurrency(d.totalAssets)}</text>
                       </g>
                     )
                   })}
                </svg>

                {/* X-Axis Labels */}
                <div className="absolute left-[35px] right-[20px] bottom-[15px] flex justify-between text-[#A1A1AA] text-[11px]">
                   {declarations.map(d => (
                     <div key={d.year} className="w-[40px] text-center" style={{ marginLeft: '-15px'}}>{d.year}</div>
                   ))}
                </div>
              </div>
            </div>
          </div>

          {/* KEY INSIGHTS */}
          <div className="flex flex-col gap-[16px]">
            <h3 className="text-white text-[15px] font-bold">Key Insights</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-[16px]">
              
              <div className="premium-card p-[16px] flex flex-col gap-[12px] bg-gradient-to-br from-green-500/5 to-transparent border-t-2 border-t-green-500/20">
                <div className="flex items-center gap-[8px]">
                  <TrendingUp className="w-[18px] h-[18px] text-[var(--color-accent-positive)]" />
                  <span className="text-[var(--color-accent-positive)] text-[13px] font-bold">Asset Growth</span>
                </div>
                <p className="text-[#A1A1AA] text-[11px] leading-relaxed">Assets have increased {assetGrowth.toFixed(1)}% over the tracked period.</p>
              </div>

              <div className="premium-card p-[16px] flex flex-col gap-[12px] bg-gradient-to-br from-yellow-500/5 to-transparent border-t-2 border-t-yellow-500/20">
                <div className="flex items-center gap-[8px]">
                  <Building2 className="w-[18px] h-[18px] text-yellow-500" />
                  <span className="text-yellow-500 text-[13px] font-bold">Net Worth Trend</span>
                </div>
                <p className="text-[#A1A1AA] text-[11px] leading-relaxed">Net worth grew by {netWorthGrowth.toFixed(1)}% between {previous.year} and {latest.year}.</p>
              </div>

            </div>
          </div>
          
          <div className="premium-card p-[16px] mt-[8px] flex items-center justify-between group cursor-pointer hover:bg-white/[0.02] transition-colors">
            <div>
              <h4 className="text-white text-[14px] font-bold mb-[2px]">All Affidavit Records</h4>
              <p className="text-[#A1A1AA] text-[12px]">View and compare all election affidavit declarations.</p>
            </div>
            <div className="flex items-center gap-[6px] text-[var(--color-accent-positive)] text-[13px] font-medium group-hover:text-green-400">
              View All Affidavits <ChevronRight className="w-[16px] h-[16px]" />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
