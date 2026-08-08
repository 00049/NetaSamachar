import { computeOverallScore } from '../lib/scoring';
import { Politician } from '../lib/types';

describe('computeOverallScore', () => {
  it('computes correct composite score (100% promises, 100% attendance, 0 cases)', () => {
    const p: Partial<Politician> = {
      promisesTotal: 10,
      promisesFulfilled: 10,
      attendancePercent: 100,
      criminalCases: []
    };
    const score = computeOverallScore(p as Politician);
    expect(score.value).toBe(100);
    expect(score.tier).toBe('A+');
  });

  it('deducts points for criminal cases', () => {
    const p: Partial<Politician> = {
      promisesTotal: 10,
      promisesFulfilled: 10,
      attendancePercent: 100,
      criminalCases: [
        { id: '1', title: 'Case 1', description: '', date: '', status: 'pending', severity: 'heinous' }
      ]
    };
    const score = computeOverallScore(p as Politician);
    // 40% of 100 + 30% of 100 + 30% of (100 - 25) = 40 + 30 + 22.5 = 92.5 = 93
    expect(score.value).toBe(93);
    expect(score.tier).toBe('A');
  });

  it('computes correct score for average performance', () => {
    const p: Partial<Politician> = {
      promisesTotal: 10,
      promisesFulfilled: 5,
      attendancePercent: 60,
      criminalCases: []
    };
    const score = computeOverallScore(p as Politician);
    // 40% of 50 + 30% of 60 + 30% of 100 = 20 + 18 + 30 = 68
    expect(score.value).toBe(68);
    expect(score.tier).toBe('B');
  });
});
