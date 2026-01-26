import '@testing-library/jest-dom/vitest';
import { cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import FeatureTestProviders from '@/test-utils/FeatureTestProviders';
import HoldingsDisplay from './HoldingsDisplay';
import type { UseHoldingsDisplay } from './useHoldingsDisplay';
import { convertToTimeString } from '@utils/date';

const mockHoldingsDisplayState: UseHoldingsDisplay = {
  liveHoldings: [],
  isFetching: false,
  lastUpdatedAt: new Date('2024-01-02T11:59:50.000Z'),
  sortState: null,
  setSortState: vi.fn(),
  pendingRemove: null,
  requestRemove: vi.fn(),
  clearPendingRemove: vi.fn(),
  confirmRemove: vi.fn(),
};

vi.mock('./useHoldingsDisplay', () => {
  return {
    useHoldingsDisplay: () => mockHoldingsDisplayState,
  };
});

describe('HoldingsDisplay', function () {
  beforeEach(function () {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-02T12:00:00.000Z'));
    mockHoldingsDisplayState.liveHoldings = [];
  });

  afterEach(function () {
    cleanup();
    vi.useRealTimers();
  });

  it('matches snapshot', function () {
    const { container } = render(
      <FeatureTestProviders>
        <HoldingsDisplay />
      </FeatureTestProviders>,
    );

    expect(container).toMatchSnapshot();
  });

  it('renders holdings content when data is available', function () {
    mockHoldingsDisplayState.liveHoldings = [
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
      {
        symbol: 'BTC',
        quantity: 1,
        purchasePrice: 20000,
        purchaseDate: convertToTimeString(new Date('2024-01-01T12:00:00.000Z')),
        assetType: 'Crypto',
        currentPrice: 21000,
        currentValue: 21000,
        profitLoss: 1000,
        dailyProfitLoss: 500,
      },
    ];

    const container = render(
      <FeatureTestProviders>
        <HoldingsDisplay />
      </FeatureTestProviders>,
    );

    expect(container).toMatchSnapshot();
  });
});
