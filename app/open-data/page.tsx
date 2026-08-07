import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import Link from 'next/link';
import { Database, FileJson, Download } from 'lucide-react';

export default function OpenDataPage() {
  return (
    <div className="min-h-screen pt-[80px]">
      <div className="max-w-[800px] mx-auto px-6 py-12">
        <Breadcrumbs items={[{ label: 'Open Data Policy' }]} />
        <h1 className="text-4xl font-bold text-white mt-8 mb-4">Open Data Policy</h1>
        <p className="text-xl text-white/50 mb-10">Data is public. It belongs to the people.</p>
        
        <div className="prose prose-invert max-w-none text-[#A1A1AA]">
          <h2 className="text-xl font-bold text-white mt-8 mb-4">Our Commitment</h2>
          <p className="mb-4">
            Neta Samachar believes that political data should not be siloed behind paywalls or proprietary formats. We are committed to an open data philosophy, ensuring that researchers, journalists, and citizens can access and verify our compiled datasets freely.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">Dataset Availability</h2>
          <p className="mb-6">
            We are currently in the process of standardizing our API and bulk export formats. Once available, all datasets concerning politician performance, promises, and criminal records will be available for download in standard open formats.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 border border-white/10 rounded-lg bg-white/5 flex flex-col items-center justify-center text-center">
              <Database className="w-8 h-8 text-[#e6b16a] mb-3" />
              <div className="text-white font-bold mb-1">Public API</div>
              <div className="text-sm text-white/50">Coming Soon</div>
            </div>
            <div className="p-4 border border-white/10 rounded-lg bg-white/5 flex flex-col items-center justify-center text-center">
              <FileJson className="w-8 h-8 text-[#e6b16a] mb-3" />
              <div className="text-white font-bold mb-1">JSON Exports</div>
              <div className="text-sm text-white/50">Coming Soon</div>
            </div>
            <div className="p-4 border border-white/10 rounded-lg bg-white/5 flex flex-col items-center justify-center text-center">
              <Download className="w-8 h-8 text-[#e6b16a] mb-3" />
              <div className="text-white font-bold mb-1">CSV Dumps</div>
              <div className="text-sm text-white/50">Coming Soon</div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">Licensing</h2>
          <p className="mb-4">
            Unless otherwise noted, the datasets provided by Neta Samachar will be licensed under the Open Data Commons Open Database License (ODbL).
          </p>
        </div>
      </div>
    </div>
  );
}
