import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQueries, type UseQueryResult } from '@tanstack/react-query';
import { getQuote, type QuoteResponse } from '@services/finnhub/finnhub';
import { useHoldingsSelector } from '@store/holdings/hooks';
import type { Holding } from '@store/holdings/slice';
import type { HoldingRow } from '@/features/holdings/holdings';

export interface HoldingsResult {
  holdings: Holding[];
  rows: HoldingRow[];
  secondsSinceUpdate: number | null;
  lastUpdatedAt: number | null;
  hasErrors: boolean;
  isLoading: boolean;
  retryAll: () => void;
}

export const useHoldings = (): HoldingsResult => {
  const holdings = useHoldingsSelector((state) => state.holdings.holdings);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const quoteQueries: UseQueryResult<QuoteResponse>[] = useQueries({
    queries: holdings.map((holding) => ({
      queryKey: ['quote', holding.symbol] as const,
      queryFn: () => getQuote(holding.symbol),
      staleTime: 30_000,
      refetchInterval: 60_000,
      refetchIntervalInBackground: true,
      retry: 2,
    })),
  });

  const latestUpdatedAt = useMemo(() => {
    const timestamps = quoteQueries.map((query) => query.dataUpdatedAt).filter((timestamp) => timestamp > 0);
    if (timestamps.length === 0) {
      return null;
    }
    return Math.max(...timestamps);
  }, [quoteQueries]);

  const secondsSinceUpdate =
    latestUpdatedAt === null ? null : Math.max(0, Math.floor((now - latestUpdatedAt) / 1000));

  const rows = useMemo((): HoldingRow[] => {
    return holdings.map((holding: Holding, index: number): HoldingRow => {
      const quote = quoteQueries[index];
      const price = typeof quote.data?.c === 'number' && Number.isFinite(quote.data.c) ? quote.data.c : null;
      const dailyChange = typeof quote.data?.d === 'number' && Number.isFinite(quote.data.d) ? quote.data.d : null;
      const previousClose =
        typeof quote.data?.pc === 'number' && Number.isFinite(quote.data.pc) ? quote.data.pc : null;
      const totalValue = price !== null ? price * holding.quantity : null;
      const profitLoss = price !== null ? (price - holding.purchasePrice) * holding.quantity : null;
      const quoteUpdatedAt = quote.dataUpdatedAt > 0 ? quote.dataUpdatedAt : null;
      const isRecentlyUpdated = quoteUpdatedAt !== null ? now - quoteUpdatedAt <= 4_000 : false;
      const quoteStatus: HoldingRow['quoteStatus'] = quote.isFetching
        ? 'loading'
        : quote.isError
          ? 'error'
          : price !== null
            ? 'ready'
            : 'idle';
      const row: HoldingRow = {
        symbol: holding.symbol,
        assetType: holding.assetType,
        quantity: holding.quantity,
        purchasePrice: holding.purchasePrice,
        purchaseDate: holding.purchaseDate,
        currentPrice: price,
        dailyChange,
        previousClose,
        totalValue,
        profitLoss,
        quoteStatus,
        quoteUpdatedAt,
        isRecentlyUpdated,
      };
      return row;
    });
  }, [holdings, quoteQueries, now]);

  const hasErrors = quoteQueries.some((query) => query.isError);
  const isLoading = holdings.length > 0 && quoteQueries.some((query) => query.isLoading);

  const retryAll = useCallback(() => {
    quoteQueries.forEach((query) => {
      void query.refetch();
    });
  }, [quoteQueries]);

  return {
    holdings,
    rows,
    secondsSinceUpdate,
    lastUpdatedAt: latestUpdatedAt,
    hasErrors,
    isLoading,
    retryAll,
  };
};
