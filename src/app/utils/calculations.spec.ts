import { describe, it, expect } from 'vitest';
import {
  calcTotalAssets,
  calcTotalLiabilities,
  calcNetWorth,
  calcAssetsByCategory,
  calcNetWorthTrend,
} from './calculations';
import { Asset, Liability, Snapshot } from '../types';

const mockAssets: Asset[] = [
  {
    id: '1',
    name: 'Family Home',
    category: 'property',
    value: 850000,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Savings Account',
    category: 'savings',
    value: 50000,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'Super Fund',
    category: 'superannuation',
    value: 120000,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

const mockLiabilities: Liability[] = [
  {
    id: '1',
    name: 'Home Mortgage',
    category: 'mortgage',
    value: 600000,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Car Loan',
    category: 'car-loan',
    value: 15000,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

describe('calcTotalAssets', () => {
  it('returns sum of all asset values', () => {
    expect(calcTotalAssets(mockAssets)).toBe(1020000);
  });

  it('returns 0 for empty array', () => {
    expect(calcTotalAssets([])).toBe(0);
  });
});

describe('calcTotalLiabilities', () => {
  it('returns sum of all liability values', () => {
    expect(calcTotalLiabilities(mockLiabilities)).toBe(615000);
  });

  it('returns 0 for empty array', () => {
    expect(calcTotalLiabilities([])).toBe(0);
  });
});

describe('calcNetWorth', () => {
  it('returns assets minus liabilities', () => {
    expect(calcNetWorth(mockAssets, mockLiabilities)).toBe(405000);
  });

  it('returns positive total assets when no liabilities', () => {
    expect(calcNetWorth(mockAssets, [])).toBe(1020000);
  });

  it('returns negative value when liabilities exceed assets', () => {
    const highLiabilities: Liability[] = [
      {
        id: '1',
        name: 'Large Debt',
        category: 'personal-loan',
        value: 2000000,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ];
    expect(calcNetWorth(mockAssets, highLiabilities)).toBe(-980000);
  });

  it('returns 0 when both arrays are empty', () => {
    expect(calcNetWorth([], [])).toBe(0);
  });
});

describe('calcAssetsByCategory', () => {
  it('groups asset values by category', () => {
    const result = calcAssetsByCategory(mockAssets);
    expect(result['property']).toBe(850000);
    expect(result['savings']).toBe(50000);
    expect(result['superannuation']).toBe(120000);
  });

  it('sums values for duplicate categories', () => {
    const assets: Asset[] = [
      { ...mockAssets[0], id: '1', value: 500000, category: 'property' },
      { ...mockAssets[0], id: '2', value: 300000, category: 'property' },
    ];
    const result = calcAssetsByCategory(assets);
    expect(result['property']).toBe(800000);
  });

  it('returns empty object for empty array', () => {
    expect(calcAssetsByCategory([])).toEqual({});
  });
});

describe('calcNetWorthTrend', () => {
  const mockSnapshots: Snapshot[] = [
    {
      id: '3',
      date: '2024-03-01T00:00:00.000Z',
      netWorth: 420000,
      totalAssets: 1050000,
      totalLiabilities: 630000,
    },
    {
      id: '1',
      date: '2024-01-01T00:00:00.000Z',
      netWorth: 400000,
      totalAssets: 1000000,
      totalLiabilities: 600000,
    },
    {
      id: '2',
      date: '2024-02-01T00:00:00.000Z',
      netWorth: 410000,
      totalAssets: 1020000,
      totalLiabilities: 610000,
    },
  ];

  it('sorts snapshots by date ascending', () => {
    const result = calcNetWorthTrend(mockSnapshots);
    expect(result[0].netWorth).toBe(400000);
    expect(result[1].netWorth).toBe(410000);
    expect(result[2].netWorth).toBe(420000);
  });

  it('returns correct shape', () => {
    const result = calcNetWorthTrend(mockSnapshots);
    expect(result[0]).toHaveProperty('date');
    expect(result[0]).toHaveProperty('netWorth');
  });

  it('returns empty array for no snapshots', () => {
    expect(calcNetWorthTrend([])).toEqual([]);
  });
});
