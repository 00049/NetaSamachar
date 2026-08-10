export type MetricPolarity = 'higher_is_better' | 'lower_is_better' | 'context_only';

export interface MetricDefinition {
  id: string;
  label: string;
  polarity: MetricPolarity;
  isPercentage: boolean;
  format?: (value: number) => string;
}

export const METRICS_REGISTRY: Record<string, MetricDefinition> = {
  totalPromises: {
    id: 'totalPromises',
    label: 'Promises Tracked',
    polarity: 'context_only',
    isPercentage: false,
  },
  avgFulfillment: {
    id: 'avgFulfillment',
    label: 'Fulfillment',
    polarity: 'higher_is_better',
    isPercentage: true,
  },
  avgAttendance: {
    id: 'avgAttendance',
    label: 'Attendance',
    polarity: 'higher_is_better',
    isPercentage: true,
  },
  avgNetAssets: {
    id: 'avgNetAssets',
    label: 'Net Assets',
    polarity: 'higher_is_better',
    isPercentage: false,
    format: (v: number) => `₹${(v / 10000000).toFixed(1)} Cr`,
  },
  totalCases: {
    id: 'totalCases',
    label: 'Legal Cases',
    polarity: 'lower_is_better',
    isPercentage: false,
  },
  billsPassed: {
    id: 'billsPassed',
    label: 'Bills Passed',
    polarity: 'higher_is_better',
    isPercentage: false,
  },
  pendingCases: {
    id: 'pendingCases',
    label: 'Pending Cases',
    polarity: 'lower_is_better',
    isPercentage: false,
  },
};
