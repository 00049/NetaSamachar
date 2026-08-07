import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Database Search | Neta Samachar',
  description: 'Search the Neta Samachar database for politicians, parties, bills, and investigations.',
  alternates: {
    canonical: '/search',
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
