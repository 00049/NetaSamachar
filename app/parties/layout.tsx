import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Political Parties | Neta Samachar',
  description: 'Explore political parties in India, their manifestos, and aggregate accountability scores.',
  alternates: {
    canonical: '/parties',
  },
};

export default function PartiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
