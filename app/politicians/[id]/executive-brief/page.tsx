import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { getPoliticianDossier } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { notFound } from 'next/navigation';

export default async function ExecutiveBriefPlaceholder({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dossier = await getPoliticianDossier(id);
  if (!dossier) notFound();
  
  const { politician, executiveBrief } = dossier;
  return (
    <div className="min-h-screen pt-[80px]">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <Breadcrumbs items={[
          { label: 'Politicians', href: '/politicians' },
          { label: id, href: `/politicians/${id}` },
          { label: 'Executive Brief' }
        ]} />
        <div className="mb-8">
          <div className="text-[#3B82F6] font-mono text-sm tracking-widest mb-4">EXECUTIVE BRIEF</div>
          <h1 className="text-4xl font-bold text-white mb-2">Comprehensive Assessment: {politician.name}</h1>
          <p className="text-[#A1A1AA]">Full comprehensive AI generated report based on all available data points.</p>
        </div>
        
        {executiveBrief ? (
          <div className="premium-card p-8 h-full min-h-[400px] flex flex-col text-[#A1A1AA]">
            <article className="prose prose-invert prose-blue max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {executiveBrief}
              </ReactMarkdown>
            </article>
          </div>
        ) : (
          <div className="premium-card p-8 h-full min-h-[400px] flex flex-col text-[#A1A1AA] items-center justify-center text-center">
            <h2 className="text-white text-xl font-bold mb-2">No Executive Brief Available</h2>
            <p>Sufficient data has not yet been processed to generate a comprehensive assessment for this profile.</p>
          </div>
        )}
      </div>
    </div>
  );
}
