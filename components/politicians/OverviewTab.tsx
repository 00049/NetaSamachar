import { formatCurrency } from '@/lib/utils';
import clsx from 'clsx';
import { Politician } from '@/lib/types';
import { ExecutiveBriefArticle } from './ExecutiveBriefArticle';

export function OverviewTab({ politician }: { politician: Politician }) {
  return (
    <div className="duration-700">
      {/* ===== EXECUTIVE BRIEF ARTICLE ===== */}
      <div className="mb-24">
        <ExecutiveBriefArticle />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
        {/* ===== CRIMINAL CASES ===== */}
        <div>
          <h2 className={clsx(
            "text-xs font-bold uppercase tracking-widest mb-6",
            politician.criminalCases.length > 0 ? "text-[var(--accent-negative)]" : "text-white"
          )}>
            Criminal Disclosures
          </h2>
          
          {politician.criminalCases.length === 0 ? (
            <div className="border border-[var(--border-subtle)] p-6">
              <div className="text-white font-bold mb-1">No Criminal Cases Declared</div>
              <div className="text-gray-500 text-sm">As per the most recent electoral affidavit (Form 26).</div>
            </div>
          ) : (
            <div className="space-y-6 border-t-2 border-[var(--accent-negative)] pt-6">
              {politician.criminalCases.map((c, i) => (
                <div key={i} className="border-b border-[var(--border-subtle)] pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={clsx(
                      "text-[10px] font-bold uppercase tracking-widest px-2 py-1",
                      c.severity === 'heinous' ? "bg-[var(--accent-negative)] text-[var(--bg-base)]" : "border border-[var(--accent-warning)] text-[var(--accent-warning)]"
                    )}>
                      {c.severity} Severity
                    </span>
                    <span className="text-gray-500 text-xs font-bold">{c.year}</span>
                  </div>
                  <div className="text-white font-serif font-bold text-lg mb-2">{c.section}</div>
                  <div className="text-gray-500 text-sm mb-3">{c.chargeDescription}</div>
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <span>{c.court}</span>
                    <span className={clsx(
                      c.status === 'pending' ? 'text-[var(--accent-warning)]' :
                      c.status === 'convicted' ? 'text-[var(--accent-negative)]' : 'text-[var(--accent-positive)]'
                    )}>
                      Status: {c.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== ASSET DECLARATIONS ===== */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-white mb-6">
            Financial Disclosures
          </h2>
          {politician.assetDeclarations.length === 0 ? (
            <div className="border border-[var(--border-subtle)] p-6">
              <div className="text-white font-bold mb-1">No Financial Declarations Filed</div>
              <div className="text-gray-500 text-sm">No affidavit data is currently available for this politician.</div>
            </div>
          ) : (
          <div className="space-y-8">
            {politician.assetDeclarations.map((decl, i) => (
              <div key={i} className="border border-[var(--border-subtle)] p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-subtle)]">
                  <span className="font-bold text-white text-sm uppercase tracking-widest">{decl.year} Affidavit</span>
                  {decl.growthPercent !== undefined && decl.growthPercent > 0 && (
                    <span className="text-xs font-bold text-[var(--accent-warning)]">
                      ↑ {decl.growthPercent}% Growth
                    </span>
                  )}
                </div>
                <table className="data-table w-full">
                  <tbody>
                    <tr>
                      <td className="text-gray-500 text-xs font-semibold uppercase pb-2">Total Assets</td>
                      <td className="text-right font-bold text-white pb-2">{formatCurrency(decl.totalAssets)}</td>
                    </tr>
                    <tr>
                      <td className="text-gray-500 text-xs font-semibold uppercase pb-4">Total Liabilities</td>
                      <td className="text-right font-bold text-[var(--accent-negative)] pb-4">{formatCurrency(decl.totalLiabilities)}</td>
                    </tr>
                    <tr>
                      <td className="text-gray-500 text-xs font-semibold uppercase pt-4 border-t border-[var(--border-subtle)]">Net Worth</td>
                      <td className="text-right font-serif font-black text-xl pt-4 border-t border-[var(--border-subtle)]">{formatCurrency(decl.totalAssets - decl.totalLiabilities)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>

    </div>
  );
}
