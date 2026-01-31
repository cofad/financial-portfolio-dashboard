import '@testing-library/jest-dom/vitest';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { LiveHolding } from './useLiveHoldings/useLiveHoldings';
import { useLiveHoldings } from './useLiveHoldings/useLiveHoldings';
import useSummary from './useSummary';
import { convertToTimeString } from '@utils/date';

vi.mock('./useLiveHoldings/useLiveHoldings', () => {
  return {
    useLiveHoldings: vi.fn(),
  };
});

describe('useSummary', function () {
  it('calculates totals and allocations from live holdings', function () {
    const mockedUseLiveHoldings = vi.mocked(useLiveHoldings);

    const liveHoldings: LiveHolding[] = [
      {
        symbol: 'AAPL',
        quantity: 2,
        purchasePrice: 100,
        purchaseDate: convertToTimeString('2024-01-01T12:00:00-05:00'),
        assetType: 'Stock',
        currentPrice: 110,
        currentValue: 220,
        profitLoss: 20,
        dailyProfitLoss: 4,
      },
      {
        symbol: 'MSFT',
        quantity: 1,
        purchasePrice: 50,
        purchaseDate: convertToTimeString('2024-01-01T12:00:00-05:00'),
        assetType: 'Stock',
        currentPrice: 70,
        currentValue: 70,
        profitLoss: 20,
        dailyProfitLoss: 5,
      },
      {
        symbol: 'BTC',
        quantity: 1,
        purchasePrice: 20000,
        purchaseDate: convertToTimeString('2024-01-01T12:00:00-05:00'),
        assetType: 'Crypto',
        currentPrice: 21000,
        currentValue: 21000,
        profitLoss: 1000,
        dailyProfitLoss: 500,
      },
    ];

    mockedUseLiveHoldings.mockReturnValue({
      liveHoldings,
      isLoading: false,
      isError: false,
      isFetching: false,
      lastUpdatedAt: new Date('2024-06-01T10:00:00Z'),
    });

    const { result } = renderHook(() => useSummary());

    expect(result.current.totalValue).toBe(21290);
    expect(result.current.dailyProfitLoss).toBe(1040);
    expect(result.current.dailyProfitLossPercent).toBeCloseTo((1040 / 21290) * 100, 6);

    const [stockGroup, cryptoGroup] = result.current.allocations.groups;

    expect(result.current.allocations.total).toBe(3);

    expect(stockGroup.assetType).toBe('Stock');
    expect(stockGroup.count).toBe(2);
    expect(stockGroup.percentage).toBeCloseTo(66.666, 2);

    expect(cryptoGroup.assetType).toBe('Crypto');
    expect(cryptoGroup.count).toBe(1);
    expect(cryptoGroup.percentage).toBeCloseTo(33.333, 2);
  });
});
