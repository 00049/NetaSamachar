import { Bill } from '../lib/types';

export const BILLS: Bill[] = [
  {
    id: 'b-hp-001',
    politicianId: 'sukhvinder-singh-sukhu',
    title: 'The Himachal Pradesh Water Cess on Hydropower Generation Bill, 2023',
    summary: 'A bill aiming to impose water cess on hydroelectric power generation in the state to shore up the state\'s revenue, facing stiff opposition from power generation companies.',
    status: 'passed',
    sponsorRole: 'primary_sponsor',
    introducedDate: '2023-03-14',
    votesFor: 40,
    votesAgainst: 25,
    votesAbstain: 3,
    officialRecordUrl: 'https://himachal.nic.in',
    gazetteUrl: 'https://himachal.nic.in',
    relatedPromiseIds: ['p-hp-003']
  },
  {
    id: 'b-hp-002',
    politicianId: 'sukhvinder-singh-sukhu',
    title: 'The Himachal Pradesh Municipal Corporation (Amendment) Bill, 2023',
    summary: 'An amendment aiming to alter the functioning and electoral procedures of municipal corporations in the state, seeking more transparent urban local body elections.',
    status: 'in_committee',
    sponsorRole: 'co_sponsor',
    introducedDate: '2023-09-20',
    officialRecordUrl: 'https://himachal.nic.in',
    relatedPromiseIds: ['p-hp-006']
  },
  {
    id: 'b-hp-003',
    politicianId: 'sukhvinder-singh-sukhu',
    title: 'The Himachal Pradesh Town and Country Planning (Amendment) Bill',
    summary: 'A legislative move to regularize unauthorized constructions in specific urban areas, providing relief to residents while attempting to maintain structural safety norms.',
    status: 'introduced',
    sponsorRole: 'primary_sponsor',
    introducedDate: '2024-02-15',
    relatedPromiseIds: ['p-hp-006']
  },
  {
    id: 'b-hp-004',
    politicianId: 'sukhvinder-singh-sukhu',
    title: 'The Himachal Pradesh (Prevention of Anti-Social Activities) Bill',
    summary: 'A proposed stringent legislation to curb organized crime and anti-social elements in the state.',
    status: 'withdrawn',
    sponsorRole: 'co_sponsor',
    introducedDate: '2023-12-05',
    relatedPromiseIds: []
  },
  {
    id: 'b-hp-005',
    politicianId: 'sukhvinder-singh-sukhu',
    title: 'The State Transport Subsidies (Revision) Bill, 2024',
    summary: 'A controversial bill seeking to restructure the public transport subsidies to cut down on state fiscal deficit.',
    status: 'rejected',
    sponsorRole: 'primary_sponsor',
    introducedDate: '2024-05-10',
    votesFor: 28,
    votesAgainst: 40,
    votesAbstain: 0,
    relatedPromiseIds: []
  }
];
