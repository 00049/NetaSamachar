'use client';

import { useMemo } from 'react';
import { POLITICIANS, PARTIES } from '@/data/politicians';
import { PROMISES } from '@/data/promises';
import { ArrowRight, FileText, AlertTriangle, Scale, BarChart2, TrendingUp, Search } from 'lucide-react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';

// ── ACCOUNTABILITY DOSSIERS ───────────────────────────────
// Each dossier is a curated view of data that already exists in the platform.
// Stats are computed live from real data — never hardcoded.

interface Dossier {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  dataSources: string[];
  stat: { value: string | number; label: string };
  link: string;
  icon: React.ElementType;
  accentColor: string;
}

export default function InvestigationsPage() {

  const dossiers: Dossier[] = useMemo(() => {
    // — Compute live stats from real data —
    const biharPromises   = PROMISES.filter(p => p.state === 'Bihar');
    const hpPromises      = PROMISES.filter(p => p.state === 'Himachal Pradesh');

    const delayedOrUnverified = biharPromises.filter(p =>
      ['delayed', 'no_verified_progress', 'cancelled'].includes(p.status)
    );

    const unableToVerify = PROMISES.filter(p => p.status === 'unable_to_verify');

    const politiciansWithCases = POLITICIANS.filter(
      p => p.criminalCases && p.criminalCases.length > 0
    );

    const hpInProgress = hpPromises.filter(p =>
      ['implementation_started', 'planning', 'tender_issued'].includes(p.status)
    );

    // Promise fulfillment by party
    const bjpPoliticians = POLITICIANS.filter(p => p.partyId === 'bjp');
    const incPoliticians = POLITICIANS.filter(p => p.partyId === 'inc');
    const bjpFulfillment = bjpPoliticians.length > 0
      ? Math.round(bjpPoliticians.reduce((s, p) => s + (p.promisesFulfilled / Math.max(p.promisesTotal, 1)), 0) / bjpPoliticians.length * 100)
      : 0;
    const incFulfillment = incPoliticians.length > 0
      ? Math.round(incPoliticians.reduce((s, p) => s + (p.promisesFulfilled / Math.max(p.promisesTotal, 1)), 0) / incPoliticians.length * 100)
      : 0;

    const totalNetWorth = POLITICIANS.reduce((s, p) => s + (p.latestNetWorth || 0), 0);
    const avgNetWorth   = POLITICIANS.length > 0 ? Math.round(totalNetWorth / POLITICIANS.length) : 0;

    return [
      {
        id: 'bihar-delayed-promises',
        eyebrow: 'Accountability Dossier · Bihar',
        title: 'Delayed & Unverified Promises — Bihar 2022–2026',
        description:
          'Cross-referencing election manifestos against documented on-ground progress. ' +
          `${delayedOrUnverified.length} of ${biharPromises.length} tracked Bihar promises ` +
          'are delayed, cancelled, or show no verified progress as of the last update.',
        dataSources: ['Election affidavits', 'MyNeta / ECI', 'State government records'],
        stat: { value: delayedOrUnverified.length, label: 'Promises delayed or unverified' },
        link: '/promises?state=Bihar',
        icon: AlertTriangle,
        accentColor: '#EF4444',
      },
      {
        id: 'hp-infrastructure-gap',
        eyebrow: 'Accountability Dossier · Himachal Pradesh',
        title: 'Infrastructure Promises Still In Progress — Himachal Pradesh',
        description:
          `${hpInProgress.length} of ${hpPromises.length} tracked infrastructure and governance ` +
          'promises in Himachal Pradesh remain in the planning or implementation phase — ' +
          'with no completion certificates or gazette notifications on record.',
        dataSources: ['CAG reports', 'Tender documents', 'Parliamentary debates'],
        stat: { value: hpInProgress.length, label: 'Promises in progress — no completion record' },
        link: '/promises?state=Himachal+Pradesh',
        icon: TrendingUp,
        accentColor: '#F59E0B',
      },
      {
        id: 'criminal-cases-national',
        eyebrow: 'Accountability Dossier · National',
        title: 'Pending Criminal Cases — Active Politicians',
        description:
          `${politiciansWithCases.length} politicians in the current dataset have declared ` +
          'criminal cases in their ECI affidavits. Cases range from cognizable offences under ' +
          'IPC to protests and civil disobedience charges — all self-declared.',
        dataSources: ['ECI affidavits', 'Court records', 'MyNeta'],
        stat: { value: politiciansWithCases.length, label: 'Politicians with declared cases' },
        link: '/politicians',
        icon: Scale,
        accentColor: '#EF4444',
      },
      {
        id: 'transparency-deficit',
        eyebrow: 'Accountability Dossier · Methodology',
        title: 'Transparency Deficit — Promises Where Evidence Is Insufficient',
        description:
          `${unableToVerify.length} tracked promises currently carry an "Unable to Verify" ` +
          'status — no primary source document (gazette, CAG report, or court order) could be ' +
          'located to confirm or deny the claimed outcome.',
        dataSources: ['Parliamentary records', 'State government portals', 'RTI documents'],
        stat: { value: unableToVerify.length, label: 'Promises with insufficient evidence' },
        link: '/archive',
        icon: Search,
        accentColor: '#6B7280',
      },
      {
        id: 'party-fulfillment',
        eyebrow: 'Accountability Dossier · Party Comparison',
        title: 'Promise Fulfillment Rate by Party — BJP vs INC',
        description:
          `Across the tracked dataset, BJP politicians average ${bjpFulfillment}% promise fulfillment ` +
          `versus ${incFulfillment}% for INC politicians. Methodology: fulfilled promises ÷ total ` +
          'declared promises per politician, averaged across all politicians in each party.',
        dataSources: ['Election manifestos', 'Government gazette', 'Parliamentary debates'],
        stat: { value: `${bjpFulfillment}% vs ${incFulfillment}%`, label: 'BJP vs INC fulfillment rate' },
        link: '/compare?type=party&a=bjp&b=inc',
        icon: BarChart2,
        accentColor: '#22C55E',
      },
      {
        id: 'declared-wealth',
        eyebrow: 'Accountability Dossier · Financial Disclosure',
        title: 'Declared Net Worth Analysis — Self-Reported Assets',
        description:
          'ECI affidavit data reveals wide variation in declared assets among tracked politicians. ' +
          `Average declared net worth across ${POLITICIANS.length} politicians: ₹${(avgNetWorth / 10000000).toFixed(1)} Cr. ` +
          'All figures are self-reported; cross-referenced against income tax filings where available.',
        dataSources: ['ECI Form 26 affidavits', 'Income tax returns', 'MyNeta database'],
        stat: {
          value: `₹${(avgNetWorth / 10000000).toFixed(1)} Cr`,
          label: 'Average declared net worth',
        },
        link: '/politicians',
        icon: FileText,
        accentColor: '#E6B16A',
      },
    ];
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">

      {/* ── EDITORIAL HEADER ─────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 pt-[100px] pb-12 border-b border-[var(--border-subtle)]">
        <Breadcrumbs items={[{ label: 'Accountability Dossiers' }]} />

        <div className="mt-6">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-[var(--border-subtle)]" aria-hidden="true" />
            Structured Accountability
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-black text-white tracking-tight leading-none mb-6">
            Accountability<br />Dossiers
          </h1>
          <p className="text-base md:text-lg text-[var(--text-tertiary)] max-w-3xl leading-relaxed font-serif italic">
            Curated views of existing promise, evidence, and financial data — not editorial
            commentary. Each dossier is a structured query over verifiable records, updated
            automatically as the dataset grows.
          </p>
        </div>

        {/* Epistemological note */}
        <div className="mt-8 flex items-start gap-4 p-4 border border-[var(--border-subtle)] bg-[var(--bg-raised)] max-w-2xl">
          <FileText className="w-5 h-5 text-[var(--text-tertiary)] flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
            <strong className="text-[var(--text-primary)]">Scope note:</strong>{' '}
            These dossiers are data products, not journalism. Every statistic links directly to
            its underlying evidence. Platform does not editorialize — we present what the
            primary sources say.
          </p>
        </div>
      </div>

      {/* ── DOSSIER GRID ─────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dossiers.map(dossier => {
            const Icon = dossier.icon;
            return (
              <Link
                key={dossier.id}
                href={dossier.link}
                className="group premium-card p-6 flex flex-col gap-5 hover:border-white/20 transition-all duration-300 min-h-[300px]"
              >
                {/* Eyebrow */}
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="text-[9px] font-black uppercase tracking-widest leading-tight"
                    style={{ color: dossier.accentColor }}
                  >
                    {dossier.eyebrow}
                  </div>
                  <div
                    className="w-[32px] h-[32px] rounded-[var(--radius-sm)] flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: dossier.accentColor + '18' }}
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{ color: dossier.accentColor }}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* Thin rule — editorial detail */}
                <hr className="border-0 border-t border-white/8" />

                {/* Title + description */}
                <div className="flex-1">
                  <h2 className="font-serif text-[18px] font-bold text-white leading-snug mb-3 group-hover:text-[var(--color-accent-positive)] transition-colors duration-200">
                    {dossier.title}
                  </h2>
                  <p className="text-[13px] text-[var(--text-tertiary)] leading-relaxed line-clamp-4">
                    {dossier.description}
                  </p>
                </div>

                {/* Live stat */}
                <div className="pt-4 border-t border-white/5">
                  <div
                    className="text-[22px] font-black leading-none mb-0.5"
                    style={{ color: dossier.accentColor }}
                  >
                    {dossier.stat.value}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">
                    {dossier.stat.label}
                  </div>
                </div>

                {/* Data sources */}
                <div className="flex flex-wrap gap-1.5">
                  {dossier.dataSources.map(src => (
                    <span
                      key={src}
                      className="text-[9px] font-medium px-1.5 py-0.5 bg-white/5 text-[var(--text-tertiary)] rounded border border-white/[0.06]"
                    >
                      {src}
                    </span>
                  ))}
                </div>

                {/* CTA — uses real ArrowRight icon, no &rarr; */}
                <div className="flex items-center gap-2 text-[12px] font-bold text-[var(--text-tertiary)] group-hover:text-white transition-colors duration-200">
                  View Dossier
                  <ArrowRight
                    className="w-[14px] h-[14px] group-hover:translate-x-1 transition-transform duration-200"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Methodology footnote */}
        <div className="mt-12 pt-8 border-t border-[var(--border-subtle)] flex items-start gap-4 max-w-2xl">
          <span className="w-8 h-px bg-[var(--border-subtle)] mt-2 flex-shrink-0" aria-hidden="true" />
          <p className="text-[11px] text-[var(--text-tertiary)] leading-relaxed">
            All statistics are computed from primary source data at page load — not cached editorial
            summaries. As the dataset is updated, dossier stats update automatically. See{' '}
            <Link href="/methodology" className="text-[var(--text-primary)] hover:text-[var(--color-accent-positive)] transition-colors underline underline-offset-2">
              Methodology
            </Link>{' '}
            for scoring details.
          </p>
        </div>
      </div>
    </div>
  );
}
