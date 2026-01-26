import '@testing-library/jest-dom/vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { fetchQuotes, type Quote } from '@services/mock-api/mock-api';
import type { Holding } from '@store/holdings/slice';
import type { HoldingsState } from '@store/holdings/store';

import { useLiveHoldings } from './useLiveHoldings/useLiveHoldings';
import { convertToTimeString } from '@utils/date';

const mockState: HoldingsState = {
  holdings: { holdings: [] },
  _persist: { version: 1, rehydrated: true },
};

vi.mock('@store/holdings/hooks', () => {
  return {
    useHoldingsSelector: (selector: (state: HoldingsState) => unknown) => selector(mockState),
  };
});

vi.mock('@services/mock-api/mock-api', async () => {
  const actual = await vi.importActual<typeof import('@services/mock-api/mock-api')>(
    '@services/mock-api/mock-api',
  );

  return {
    ...actual,
    fetchQuotes: vi.fn(),
  };
});

describe('useHoldings', () => {
  it('builds live holdings from holdings and quotes', async function () {
    const holdings: Holding[] = [
      {
        symbol: 'AAPL',
        quantity: 2,
        purchasePrice: 100,
        purchaseDate: convertToTimeString('2024-01-01T12:00:00-05:00'),
        assetType: 'Stock',
      },
      {
        symbol: 'BTC',
        quantity: 1,
        purchasePrice: 20000,
        purchaseDate: convertToTimeString('2024-01-01T12:00:00-05:00'),
        assetType: 'Crypto',
      },
    ];

    mockState.holdings.holdings = holdings;

    const quotes: Quote[] = [
      { symbol: 'AAPL', currentPrice: 110, previousClosePrice: 108 },
      { symbol: 'BTC', currentPrice: 21000, previousClosePrice: 20500 },
    ];

    const mockedFetchQuotes = vi.mocked(fetchQuotes);
    mockedFetchQuotes.mockResolvedValue(quotes);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    function Wrapper({ children }: { children: ReactNode }) {
      return (
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={null}>{children}</Suspense>
        </QueryClientProvider>
      );
    }

    const { result } = renderHook(() => useLiveHoldings(), { wrapper: Wrapper });

    await waitFor(() => {
      expect(result.current.liveHoldings.length).toBe(2);
    });

    expect(mockedFetchQuotes).toHaveBeenCalledWith(['AAPL', 'BTC']);

    const [aapl, btc] = result.current.liveHoldings;

    expect(aapl.currentPrice).toBe(110);
    expect(aapl.currentValue).toBe(220);
    expect(aapl.profitLoss).toBe(20);
    expect(aapl.dailyProfitLoss).toBe(4);

    expect(btc.currentPrice).toBe(21000);
    expect(btc.currentValue).toBe(21000);
    expect(btc.profitLoss).toBe(1000);
    expect(btc.dailyProfitLoss).toBe(500);
  });
});
