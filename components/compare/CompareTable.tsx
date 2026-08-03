'use client';

import { useMemo, useState } from 'react';
import { POLITICIANS, PARTIES } from '@/data/politicians';
import { PROMISES } from '@/data/promises';
import { aggregateStats } from '@/lib/aggregation';
import { CompareType } from './CompareBuilder';
import { useSearchCache } from '@/lib/useSearchCache';

interface CompareTableProps {
  type: CompareType;
  entityIds: string[];
}

const COLORS = ['#C9A24B','#6C8FD1','#3FA76A','#B98A6B'];

export function CompareTable({ type, entityIds }: CompareTableProps) {
  const [currentView, setCurrentView] = useState<'executive'|'detailed'>('executive');
  
  const hasDuplicates = new Set(entityIds).size !== entityIds.length;
  const cache = useSearchCache<any>('aggregateStats');

  const columnsData = useMemo(() => {
    if (hasDuplicates) return [];
    return entityIds.map((id, index) => {
      const cacheKey = `${type}:${id}`;
      const cached = cache.get(cacheKey);
      if (cached) return { ...cached, color: COLORS[index] };

      let matchedPoliticians: typeof POLITICIANS = [];
      let matchedPromises: typeof PROMISES = [];
      let name = '';
      let shortName = '';
      
      if (type === 'party') {
        const party = PARTIES.find(p => p.id === id);
        name = party?.name || id;
        shortName = party?.abbreviation || id;
        matchedPoliticians = POLITICIANS.filter(p => p.partyId === id);
        matchedPromises = PROMISES.filter(p => p.partyId === id);
      } else if (type === 'state') {
        const stateName = Array.from(new Set(POLITICIANS.map(p => p.state))).find(s => s.toLowerCase().replace(/\s+/g, '-') === id);
        name = stateName || id;
        shortName = name;
        matchedPoliticians = POLITICIANS.filter(p => p.state === stateName);
        matchedPromises = PROMISES.filter(p => p.state === stateName);
      } else if (type === 'constituency') {
        const constName = Array.from(new Set(POLITICIANS.map(p => p.constituency))).find(c => c.toLowerCase().replace(/\s+/g, '-') === id);
        name = constName || id;
        shortName = name;
        matchedPoliticians = POLITICIANS.filter(p => p.constituency === constName);
        const polIds = new Set(matchedPoliticians.map(p => p.id));
        matchedPromises = PROMISES.filter(p => polIds.has(p.politicianId));
      } else if (type === 'politician') {
        const pol = POLITICIANS.find(p => p.id === id);
        name = pol?.name || id;
        shortName = name.split(' ').slice(-1)[0];
        if (pol) matchedPoliticians = [pol];
        matchedPromises = PROMISES.filter(p => p.politicianId === id);
      }

      const result = {
        id,
        name,
        shortName,
        stats: aggregateStats(matchedPoliticians, matchedPromises),
        color: COLORS[index]
      };
      cache.set(cacheKey, result);
      return result;
    });
  }, [type, entityIds, cache, hasDuplicates]);

  if (hasDuplicates) {
    return (
      <section className="block" id="resultsGate">
        <div className="wrap">
          <div className="gate-empty">You've selected the same {type} twice — choose a different one to see a comparison.</div>
        </div>
      </section>
    );
  }

  if (columnsData.length < 2) return null;

  const metrics = type === 'politician' ? [
    { label: 'Promises Tracked', key: 'totalPromises', isPercentage: false, invertColor: false },
    { label: 'Fulfillment', key: 'avgFulfillment', isPercentage: true, invertColor: false },
    { label: 'Attendance', key: 'avgAttendance', isPercentage: true, invertColor: false },
    { label: 'Net Assets', key: 'avgNetAssets', isPercentage: false, invertColor: false, format: (v: number) => `₹${(v / 10000000).toFixed(1)} Cr` },
    { label: 'Legal Cases', key: 'totalCases', isPercentage: false, invertColor: true },
  ] : [
    { label: 'Promises Tracked', key: 'totalPromises', isPercentage: false, invertColor: false },
    { label: 'Avg Fulfillment', key: 'avgFulfillment', isPercentage: true, invertColor: false },
    { label: 'Avg Attendance', key: 'avgAttendance', isPercentage: true, invertColor: false },
    { label: 'Total Cases', key: 'totalCases', isPercentage: false, invertColor: true },
    { label: 'Avg Net Assets', key: 'avgNetAssets', isPercentage: false, invertColor: false, format: (v: number) => `₹${(v / 10000000).toFixed(1)} Cr` },
  ];

  const briefMetrics = metrics.filter(m => m.key !== 'totalPromises' && m.key !== 'totalCases');

  return (
    <div className="workspace" id="workspace">
      <div className="cmp-toolbar">
        <div className="wrap toolbar-inner">
          <div className="toolbar-group">
            <span className="toolbar-label">Comparison View</span>
            <div className="seg-group" id="viewToggle">
              <button className={`seg-btn ${currentView === 'executive' ? 'active' : ''}`} onClick={() => setCurrentView('executive')}>Executive</button>
              <button className={`seg-btn ${currentView === 'detailed' ? 'active' : ''}`} onClick={() => setCurrentView('detailed')}>Detailed</button>
            </div>
          </div>
          
          <div className="toolbar-spacer"></div>
          
          <div className="toolbar-group">
            <span className="toolbar-label">Export</span>
            <div className="seg-group">
              <button className="seg-btn" onClick={() => window.print()}>PDF</button>
              <button className="seg-btn">Share</button>
            </div>
          </div>
        </div>
      </div>

      <div className={`view-panel ${currentView === 'executive' ? 'active' : ''}`}>
        <section className="block">
          <div className="wrap">
            <div className="block-head">
              <div>
                <div className="eyebrow" style={{marginBottom:'8px'}}>Section 01</div>
                <h2 className="block-title">Executive Summary</h2>
                <p className="block-sub">Who is performing better — at a glance.</p>
              </div>
            </div>
            
            <div className="brief-grid">
              {briefMetrics.map(metric => {
                const sorted = [...columnsData].sort((a,b) => {
                  const valA = a.stats[metric.key as keyof typeof a.stats] as number;
                  const valB = b.stats[metric.key as keyof typeof b.stats] as number;
                  return metric.invertColor ? valA - valB : valB - valA;
                });
                const hi = sorted[0];
                const lo = sorted[sorted.length-1];
                const valHi = hi.stats[metric.key as keyof typeof hi.stats] as number;
                const valLo = lo.stats[metric.key as keyof typeof lo.stats] as number;
                const diff = Math.abs(valHi - valLo);
                const format = metric.format || ((v: number) => metric.isPercentage ? `${v}%` : v);
                
                return (
                  <div key={metric.key} className="brief-card">
                    <div className="brief-kicker">{metric.label}</div>
                    <div className="brief-row">
                      <span className="lbl">Highest</span>
                      <span className="val hi">{hi.shortName} · {format(valHi)}</span>
                    </div>
                    <div className="brief-row">
                      <span className="lbl">Lowest</span>
                      <span className="val lo">{lo.shortName} · {format(valLo)}</span>
                    </div>
                    <div className="brief-diff">Difference — {format(diff)}</div>
                    <div className="brief-ai">{hi.shortName} leads by {format(diff)} in {metric.label.toLowerCase()}.</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="block">
          <div className="wrap">
            <div className="block-head">
              <div>
                <div className="eyebrow" style={{marginBottom:'8px'}}>Section 02</div>
                <h2 className="block-title">Quick Comparison Matrix</h2>
                <p className="block-sub">The first table any journalist should read.</p>
              </div>
            </div>
            
            <div className="legend-row">
              {columnsData.map(col => (
                <div key={col.id} className="legend-chip">
                  <span className="legend-dot" style={{background: col.color}}></span>{col.name}
                </div>
              ))}
            </div>
            
            <div className="matrix-scroll">
              <table className="matrix">
                <thead>
                  <tr>
                    <th>Metric</th>
                    {columnsData.map(col => (
                      <th key={col.id} style={{color: col.color}}>{col.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {metrics.map(metric => {
                    const vals = columnsData.map(c => c.stats[metric.key as keyof typeof c.stats] as number || 0);
                    const max = Math.max(...vals);
                    const min = Math.min(...vals);
                    const avg = vals.reduce((a,b)=>a+b,0) / vals.length;
                    
                    return (
                      <tr key={metric.key}>
                        <td className="metric-cell">{metric.label}</td>
                        {columnsData.map((col, idx) => {
                          const val = col.stats[metric.key as keyof typeof col.stats] as number || 0;
                          const format = metric.format || ((v: number) => metric.isPercentage ? `${v}%` : v);
                          
                          let cls = 'v-above';
                          let isHi = false, isLo = false;
                          
                          if (metric.invertColor) {
                            if (val === min && max !== min) { cls = 'v-hi'; isHi = true; }
                            else if (val === max && max !== min) { cls = 'v-lo'; isLo = true; }
                            else if (val <= avg) cls = 'v-above'; else cls = 'v-below';
                          } else {
                            if (val === max && max !== min) { cls = 'v-hi'; isHi = true; }
                            else if (val === min && max !== min) { cls = 'v-lo'; isLo = true; }
                            else if (val >= avg) cls = 'v-above'; else cls = 'v-below';
                          }
                          
                          return (
                            <td key={idx} className={cls}>
                              {format(val)}
                              {isHi && <span className="cell-flag" style={{color:'var(--verified)'}}>HIGH</span>}
                              {isLo && <span className="cell-flag" style={{color:'var(--red)'}}>LOW</span>}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="matrix-note"><b>Legend —</b> <span style={{color:'var(--verified)'}}>green</span> highest · <span style={{color:'var(--red)'}}>red</span> lowest · <span style={{color:'var(--ink)'}}>bright</span> above average · <span style={{color:'var(--ink-faint)'}}>dim</span> below average</p>
          </div>
        </section>

        {/* Mocked Timeline Section to show off the design */}
        <section className="block">
          <div className="wrap">
            <div className="block-head">
              <div>
                <div className="eyebrow" style={{marginBottom:'8px'}}>Section 03</div>
                <h2 className="block-title">Shared Political Timeline</h2>
                <p className="block-sub">Election wins, party changes, ministerial & CM positions, major bills — one combined timeline.</p>
              </div>
            </div>
            <div className="timeline-wrap">
              <div style={{position:'relative', height:'18px', margin:'0 0 12px 164px', minWidth:'700px'}}>
                <div style={{position:'absolute', left:'0%', top:0, fontFamily:'var(--mono)', fontSize:'9.5px', color:'var(--ink-faint)'}}>2005</div>
                <div style={{position:'absolute', left:'25%', top:0, fontFamily:'var(--mono)', fontSize:'9.5px', color:'var(--ink-faint)'}}>2010</div>
                <div style={{position:'absolute', left:'50%', top:0, fontFamily:'var(--mono)', fontSize:'9.5px', color:'var(--ink-faint)'}}>2015</div>
                <div style={{position:'absolute', left:'75%', top:0, fontFamily:'var(--mono)', fontSize:'9.5px', color:'var(--ink-faint)'}}>2020</div>
                <div style={{position:'absolute', left:'100%', top:0, fontFamily:'var(--mono)', fontSize:'9.5px', color:'var(--ink-faint)'}}>2025</div>
              </div>
              
              {columnsData.map(col => (
                <div key={col.id} className="lane-row">
                  <div className="lane-label"><span className="legend-dot" style={{background: col.color}}></span>{col.shortName}</div>
                  <div style={{position:'relative', height:'14px', flex:1, minWidth:'700px', borderBottom:'1px solid var(--border-soft)'}}>
                    <div style={{position:'absolute', left:`${20 + Math.random()*20}%`, top:'2px', width:'10px', height:'10px', borderRadius:'50%', background: col.color, border:'2px solid var(--bg-secondary)'}}></div>
                    <div style={{position:'absolute', left:`${45 + Math.random()*20}%`, top:'2px', width:'10px', height:'10px', borderRadius:'50%', background: col.color, border:'2px solid var(--bg-secondary)'}}></div>
                    <div style={{position:'absolute', left:`${70 + Math.random()*25}%`, top:'2px', width:'10px', height:'10px', borderRadius:'50%', background: col.color, border:'2px solid var(--bg-secondary)'}}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mocked AI Notes */}
        <section className="block" style={{borderBottom:'none'}}>
          <div className="wrap">
            <div className="block-head">
              <div>
                <div className="eyebrow" style={{marginBottom:'8px'}}>Section 04</div>
                <h2 className="block-title">AI Research Notes</h2>
                <p className="block-sub">Editorial observations drawn from the comparison above.</p>
              </div>
            </div>
            <div className="notes-list">
              <div className="note-card">
                <div className="note-byline">Editorial · Comparison Desk</div>
                <div className="note-text">
                  {columnsData[0]?.shortName} leads the comparison in Promise Fulfillment, but trailing slightly in Attendance compared to the average.
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
      
      {/* Detailed View */}
      <div className={`view-panel ${currentView === 'detailed' ? 'active' : ''}`}>
        <section className="block">
          <div className="wrap">
            <div className="block-head">
              <div>
                <h2 className="block-title">Detailed Research Table</h2>
                <p className="block-sub">Every statistic below is sourced.</p>
              </div>
            </div>
            <div className="detail-scroll">
              <table className="detail">
                <thead>
                  <tr>
                    <th>Metric</th>
                    {columnsData.map(col => (
                      <th key={col.id} style={{color: col.color}}>{col.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="cat-row"><td colSpan={columnsData.length+1}>Overview</td></tr>
                  {metrics.map(metric => (
                    <tr key={metric.key}>
                      <td>{metric.label}</td>
                      {columnsData.map((col, idx) => {
                        const val = col.stats[metric.key as keyof typeof col.stats] as number || 0;
                        const format = metric.format || ((v: number) => metric.isPercentage ? `${v}%` : v);
                        return <td key={idx}>{format(val)}</td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
