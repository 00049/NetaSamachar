import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Evidence Repository | Neta Samachar',
  description: 'Explore the primary source documents, court filings, and legislative records backing our investigations.',
  alternates: {
    canonical: '/evidence',
  },
};

export default function EvidenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
