import { HomeClient } from './HomeClient';
import { getPlatformStats, getTrendingPoliticians } from '@/lib/api';

export default async function HomePage() {
  const stats = await getPlatformStats();
  const trendingPoliticians = await getTrendingPoliticians();
  
  return <HomeClient stats={stats} trendingPoliticians={trendingPoliticians} />;
}
