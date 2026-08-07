import { Breadcrumbs } from '@/components/shared/Breadcrumbs';

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen pt-[80px]">
      <div className="max-w-[800px] mx-auto px-6 py-12">
        <Breadcrumbs items={[{ label: 'Terms of Use' }]} />
        <h1 className="text-4xl font-bold text-white mt-8 mb-6">Terms of Use</h1>
        
        <div className="prose prose-invert max-w-none text-[#A1A1AA]">
          <p className="mb-4">Last updated: August 2026</p>
          
          <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using Neta Samachar, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our platform.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Platform Purpose</h2>
          <p className="mb-4">
            Neta Samachar is an independent, non-partisan platform designed to aggregate and present publicly available data regarding political figures, parties, and legislation in India. We do not endorse any political party or candidate.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Data Accuracy</h2>
          <p className="mb-4">
            While we strive for complete accuracy by strictly citing official sources (such as government portals, affidavits, and legislative records), Neta Samachar makes no absolute warranties regarding the real-time accuracy, completeness, or reliability of the data. Users should independently verify critical information.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">4. Acceptable Use</h2>
          <p className="mb-4">
            You agree not to use the platform for any unlawful purpose or to extract data in a manner that degrades the platform's performance (e.g., unauthorized scraping).
          </p>
        </div>
      </div>
    </div>
  );
}
