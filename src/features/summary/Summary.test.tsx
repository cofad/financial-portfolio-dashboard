import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import FeatureTestProviders from '@/test-utils/FeatureTestProviders';
import Summary from './Summary';
import { convertToTimeString } from '@utils/date';
import type useSummary from '@hooks/useSummary';

type UseSummary = ReturnType<typeof useSummary>;

const mockSummaryState: UseSummary = {
  isLoading: false,
  isError: false,
  liveHoldings: [],
  lastUpdatedAt: new Date('2024-01-02T12:00:00.000Z'),
  totalValue: 0,
  dailyProfitLoss: 0,
  allocations: {
    total: 0,
    groups: [],
  },
};

vi.mock('@hooks/useSummary', () => {
  return {
    default: () => mockSummaryState,
  };
});

describe('Summary', function () {
  beforeEach(function () {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-02T12:00:00.000Z'));
    mockSummaryState.liveHoldings = [];
    mockSummaryState.totalValue = 0;
    mockSummaryState.dailyProfitLoss = 0;
    mockSummaryState.allocations = { total: 0, groups: [] };
  });

  afterEach(function () {
    cleanup();
    vi.useRealTimers();
  });

  it('matches snapshot', function () {
    const { container } = render(
      <FeatureTestProviders>
        <Summary />
      </FeatureTestProviders>,
    );

    expect(container).toMatchSnapshot();
  });

  it('renders summary content when data is available', function () {
    mockSummaryState.liveHoldings = [
      {
        symbol: 'AAPL',
        quantity: 2,
        purchasePrice: 100,
        purchaseDate: convertToTimeString(new Date('2024-01-01T12:00:00.000Z')),
        assetType: 'Stock',
        currentPrice: 110,
        currentValue: 220,
        profitLoss: 20,
        dailyProfitLoss: 4,
      },
    ];
    mockSummaryState.totalValue = 220;
    mockSummaryState.dailyProfitLoss = 4;
    mockSummaryState.allocations = {
      total: 1,
      groups: [{ assetType: 'Stock', count: 1, percentage: 100 }],
    };

    const container = render(
      <FeatureTestProviders>
        <Summary />
      </FeatureTestProviders>,
    );

    expect(container.container).toMatchSnapshot();
  });
});
