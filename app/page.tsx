import { HomeClient } from './HomeClient';
import { getPlatformStats } from '@/lib/api';

export default async function HomePage() {
  const stats = await getPlatformStats();
  
  return <HomeClient stats={stats} />;
}
