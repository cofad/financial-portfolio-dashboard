import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import FeatureTestProviders from '@/test-utils/FeatureTestProviders';
import Performance from './Performance';
import type { HoldingsState } from '@store/holdings/store';
import type { Holding } from '@store/holdings/slice';
import { convertToTimeString } from '@utils/date';
import type { PerformanceContext } from './PerformanceContext';

const mockHoldingsState: HoldingsState = {
  holdings: { holdings: [] },
  _persist: { version: 1, rehydrated: true },
};

const mockPerformanceContext: PerformanceContext = {
  range: 7,
  setRange: vi.fn(),
  ranges: [
    { label: '7d', value: 7 },
    { label: '30d', value: 30 },
    { label: '90d', value: 90 },
  ],
  rangedPortfolioDailyValue: [
    { date: convertToTimeString(new Date('2024-01-01T12:00:00.000Z')), value: 200 },
    { date: convertToTimeString(new Date('2024-01-02T12:00:00.000Z')), value: 220 },
  ],
  holdingsCount: 1,
  totalValue: 220,
  percentChange: 10,
};

vi.mock('@store/holdings/hooks', () => {
  return {
    useHoldingsSelector: (selector: (state: HoldingsState) => unknown) => selector(mockHoldingsState),
  };
});

vi.mock('./PerformanceContext', () => {
  return {
    usePerformanceContext: () => mockPerformanceContext,
  };
});

vi.mock('./PerformanceProvider', () => {
  return {
    PerformanceProvider: ({ children }: { children: ReactNode }) => children,
  };
});

vi.mock('./PerformanceChart', () => {
  return {
    default: function MockPerformanceChart() {
      return <div>Mock chart</div>;
    },
  };
});

describe('Performance', () => {
  beforeEach(() => {
    mockHoldingsState.holdings.holdings = [];
  });

  afterEach(function () {
    cleanup();
  });

  it('matches snapshot', function () {
    const { container } = render(
      <FeatureTestProviders>
        <Performance />
      </FeatureTestProviders>,
    );

    expect(container).toMatchSnapshot();
  });

  it('renders performance content when data is available', function () {
    const holdings: Holding[] = [
      {
        symbol: 'AAPL',
        quantity: 2,
        purchasePrice: 100,
        purchaseDate: convertToTimeString(new Date('2024-01-01T12:00:00.000Z')),
        assetType: 'Stock',
      },
    ];

    mockHoldingsState.holdings.holdings = holdings;

    const container = render(
      <FeatureTestProviders>
        <Performance />
      </FeatureTestProviders>,
    );
    expect(container.container).toMatchSnapshot();
  });
});
