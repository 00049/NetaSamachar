import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { POLITICIANS } from '@/data/politicians';
import { getPoliticianDossier } from '@/lib/api';
import { PromiseCard } from '@/components/promises/PromiseCard';
import { formatCurrency, getPromiseFulfillmentRate } from '@/lib/utils';
import clsx from 'clsx';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const politician = POLITICIANS.find(p => p.id === id);
  if (!politician) return { title: 'Politician Not Found' };
  return {
    title: `${politician.name} — Legislative Dossier | Neta Samachar`,
    description: `Complete accountability profile for ${politician.name}. Track promises, criminal cases, financial declarations, and legislative activity.`,
  };
}

export function generateStaticParams() {
  return POLITICIANS.map(p => ({ id: p.id }));
}

export default async function PoliticianProfilePage({ params }: Props) {
  const { id } = await params;
  
  // Use the simulated unified database query
  const dossier = await getPoliticianDossier(id);
  if (!dossier) notFound();

  const { politician, party, promises: politicianPromises } = dossier;
  const fulfillmentRate = getPromiseFulfillmentRate(politician.promisesFulfilled, politician.promisesTotal);
  const heinousCases = politician.criminalCases.filter(c => c.severity === 'heinous').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-12">
        <Link href="/politicians" className="hover:text-[var(--text-primary)] transition-colors">Directory</Link>
        <span>/</span>
        <span className="text-[var(--text-primary)]">{politician.name}</span>
      </div>

      {/* ===== PROFILE HEADER ===== */}
      <div className="border-b border-[var(--border-subtle)] pb-16 mb-16">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Avatar Area */}
          <div className="w-32 h-32 flex-shrink-0 flex items-center justify-center border border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-primary)] font-serif font-black text-5xl">
            {politician.name.charAt(0)}
          </div>
          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="font-serif text-4xl sm:text-5xl font-black text-[var(--text-primary)]">
                {politician.name}
              </h1>
              {politician.verified && (
                <span className="px-2 py-1 border border-[var(--accent-positive)] text-[var(--accent-positive)] text-[10px] font-bold uppercase tracking-widest">
                  Verified Identity
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="font-bold text-[var(--text-primary)] text-sm uppercase tracking-widest">
                {party?.name} ({party?.abbreviation})
              </span>
              <span className="text-[var(--border-subtle)]">|</span>
              <span className="text-[var(--text-tertiary)] text-sm font-semibold uppercase tracking-widest">
                {politician.position}
              </span>
              <span className="text-[var(--border-subtle)]">|</span>
              <span className="text-[var(--text-tertiary)] text-sm font-semibold uppercase tracking-widest">
                {politician.constituency}, {politician.state}
              </span>
            </div>

            <p className="text-[var(--text-primary)] text-base leading-relaxed max-w-3xl mb-8">
              {politician.bio}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-[var(--border-subtle)]">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-1">Education</div>
                <div className="text-xs font-semibold text-[var(--text-primary)]">{politician.education}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-1">Age</div>
                <div className="text-xs font-semibold text-[var(--text-primary)]">{politician.age}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-1">Terms Served</div>
                <div className="text-xs font-semibold text-[var(--text-primary)]">{politician.termsSince}</div>
              </div>
              {politician.officialEmail && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-1">Contact</div>
                  <a href={`mailto:${politician.officialEmail}`} className="text-xs font-semibold text-[var(--accent-info)] hover-underline">
                    {politician.officialEmail}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== PERFORMANCE METRICS ===== */}
      <div className="mb-24">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] mb-6">
          Legislative Performance & Track Record
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            {
              label: 'Fulfillment Rate',
              value: `${fulfillmentRate}%`,
              sub: `${politician.promisesFulfilled} / ${politician.promisesTotal} completed`,
            },
            {
              label: 'Attendance',
              value: `${politician.attendancePercent}%`,
              sub: `Parliamentary sessions`,
            },
            {
              label: 'Questions Raised',
              value: politician.questionsRaised.toLocaleString(),
              sub: 'In Parliament',
            },
            {
              label: 'Bills Introduced',
              value: politician.billsIntroduced || 0,
              sub: 'Private member bills',
            },
          ].map((metric, i) => (
            <div key={i} className="pt-4 border-t border-[var(--border-subtle)]">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-2">{metric.label}</div>
              <div className="font-serif text-4xl font-black text-[var(--text-primary)] mb-1">{metric.value}</div>
              <div className="text-[var(--text-tertiary)] text-xs">{metric.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
        {/* ===== CRIMINAL CASES ===== */}
        <div>
          <h2 className={clsx(
            "text-xs font-bold uppercase tracking-widest mb-6",
            politician.criminalCases.length > 0 ? "text-[var(--accent-negative)]" : "text-[var(--text-primary)]"
          )}>
            Criminal Disclosures
          </h2>
          
          {politician.criminalCases.length === 0 ? (
            <div className="border border-[var(--border-subtle)] p-6">
              <div className="text-[var(--text-primary)] font-bold mb-1">No Criminal Cases Declared</div>
              <div className="text-[var(--text-tertiary)] text-sm">As per the most recent electoral affidavit (Form 26).</div>
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
                    <span className="text-[var(--text-tertiary)] text-xs font-bold">{c.year}</span>
                  </div>
                  <div className="text-[var(--text-primary)] font-serif font-bold text-lg mb-2">{c.section}</div>
                  <div className="text-[var(--text-tertiary)] text-sm mb-3">{c.chargeDescription}</div>
                  <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
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
          <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] mb-6">
            Financial Disclosures
          </h2>
          <div className="space-y-8">
            {politician.assetDeclarations.map((decl, i) => (
              <div key={i} className="border border-[var(--border-subtle)] p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-subtle)]">
                  <span className="font-bold text-[var(--text-primary)] text-sm uppercase tracking-widest">{decl.year} Affidavit</span>
                  {decl.growthPercent !== undefined && decl.growthPercent > 0 && (
                    <span className="text-xs font-bold text-[var(--accent-warning)]">
                      ↑ {decl.growthPercent}% Growth
                    </span>
                  )}
                </div>
                <table className="data-table">
                  <tbody>
                    <tr>
                      <td className="text-[var(--text-tertiary)] text-xs font-semibold uppercase">Total Assets</td>
                      <td className="text-right font-bold text-[var(--text-primary)]">{formatCurrency(decl.totalAssets)}</td>
                    </tr>
                    <tr>
                      <td className="text-[var(--text-tertiary)] text-xs font-semibold uppercase">Total Liabilities</td>
                      <td className="text-right font-bold text-[var(--accent-negative)]">{formatCurrency(decl.totalLiabilities)}</td>
                    </tr>
                    <tr>
                      <td className="text-[var(--text-tertiary)] text-xs font-semibold uppercase pt-4">Net Worth</td>
                      <td className="text-right font-serif font-black text-xl pt-4 border-t border-[var(--border-subtle)]">{formatCurrency(decl.totalAssets - decl.totalLiabilities)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== PROMISES ===== */}
      {politicianPromises.length > 0 && (
        <div className="pt-16 border-t-4 border-[var(--text-primary)]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)]">
              Tracked Promises
            </h2>
            <span className="text-[var(--text-tertiary)] text-xs font-bold">
              {politicianPromises.length} RECORDS
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {politicianPromises.map(promise => (
              <PromiseCard key={promise.id} promise={promise} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
