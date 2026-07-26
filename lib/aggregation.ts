import { Politician, Promise as AppPromise } from './types';

export interface EntityStats {
  totalPoliticians: number;
  totalPromises: number;
  avgFulfillment: number;
  totalCases: number;
  avgAttendance: number;
  avgNetAssets: number;
  verifiedComplete: number;
  underScrutiny: number;
}

export function aggregateStats(politicians: Politician[], promises: AppPromise[]): EntityStats {
  const totalPoliticians = politicians.length;
  
  if (totalPoliticians === 0) {
    return {
      totalPoliticians: 0,
      totalPromises: 0,
      avgFulfillment: 0,
      totalCases: 0,
      avgAttendance: 0,
      avgNetAssets: 0,
      verifiedComplete: 0,
      underScrutiny: 0,
    };
  }

  let promisesTotal = 0;
  let promisesFulfilled = 0;
  let totalCases = 0;
  let totalAttendance = 0;
  let totalNetAssets = 0;

  for (const pol of politicians) {
    promisesTotal += pol.promisesTotal;
    promisesFulfilled += pol.promisesFulfilled;
    totalCases += pol.criminalCases.length;
    totalAttendance += pol.attendancePercent;
    totalNetAssets += pol.latestNetWorth || 0;
  }

  const avgFulfillment = promisesTotal > 0 
    ? Math.round((promisesFulfilled / promisesTotal) * 100) 
    : 0;

  const avgAttendance = Math.round(totalAttendance / totalPoliticians);
  const avgNetAssets = totalNetAssets / totalPoliticians;

  // Calculate promise states
  let verifiedComplete = 0;
  let underScrutiny = 0;
  
  const completedStatuses = ['completed', 'operational'];
  // Under scrutiny: active promises not yet completed
  const scrutinyStatuses = [
    'planning', 'tender_issued', 'construction_started', 
    'implementation_started', 'partially_completed', 
    'mostly_completed', 'delayed', 'pending'
  ];

  for (const promise of promises) {
    if (completedStatuses.includes(promise.status)) verifiedComplete++;
    if (scrutinyStatuses.includes(promise.status)) underScrutiny++;
  }

  return {
    totalPoliticians,
    totalPromises: promisesTotal,
    avgFulfillment,
    totalCases,
    avgAttendance,
    avgNetAssets,
    verifiedComplete,
    underScrutiny,
  };
}
