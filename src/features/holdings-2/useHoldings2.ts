import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getQuotes, type Quote } from '@services/finnhub/finnhub';
import { useHoldingsDispatch, useHoldingsSelector } from '@store/holdings/hooks';
import { removeHolding, type Holding } from '@store/holdings/slice';
import { useToast } from '@components/toast/useToast';
import type { SortState } from '@features/holdings-2/holdings2Sorting';

export interface LiveHolding extends Holding {
  currentPrice: number;
  currentValue: number;
  profitLoss: number;
}

function extractCurrentPrice(symbol: string, quotes: Quote[]): number {
  const quote = quotes.find((q) => q.symbol === symbol);

  if (!quote) throw new Error(`Quote not found for symbol: ${symbol}`);

  return quote.currentPrice;
}

export interface UseHoldings2 {
  liveHoldings: LiveHolding[] | null;
  isLoading: boolean;
  isError: boolean;
  lastUpdatedAt: Date;
  isUpdating: boolean;
  sortState: SortState | null;
  setSortState: (nextSortState: SortState | null) => void;
  pendingRemove: LiveHolding | null;
  requestRemove: (holding: LiveHolding) => void;
  clearPendingRemove: () => void;
  confirmRemove: () => void;
}

export function useHoldings2(): UseHoldings2 {
  const holdings = useHoldingsSelector((state) => state.holdings.holdings);
  const dispatch = useHoldingsDispatch();
  const { pushToast } = useToast();

  const [pendingRemove, setPendingRemove] = useState<LiveHolding | null>(null);
  const [sortState, setSortState] = useState<SortState | null>(null);

  const holdingSymbols = holdings.map((h) => h.symbol);

  const {
    data: quotes,
    isLoading,
    isError,
    dataUpdatedAt,
    isFetching,
  } = useQuery({
    queryKey: ['quotes', holdingSymbols.join(',')],
    queryFn: () => getQuotes(holdingSymbols),
    refetchInterval: 60_000,
    refetchIntervalInBackground: true,
  });

  const liveHoldings: LiveHolding[] | null = useMemo(() => {
    return quotes
      ? holdings.map((holding) => {
          const currentPrice = extractCurrentPrice(holding.symbol, quotes);
          const currentValue = currentPrice * holding.quantity;
          const purchasedValue = holding.purchasePrice * holding.quantity;
          const profitLoss = currentValue - purchasedValue;

          return {
            ...holding,
            currentPrice,
            currentValue,
            profitLoss,
          };
        })
      : null;
  }, [holdings, quotes]);

  const lastUpdatedAt = new Date(dataUpdatedAt);

  return {
    liveHoldings,
    isLoading,
    isError,
    lastUpdatedAt,
    isUpdating: isFetching,
    sortState,
    setSortState,
    pendingRemove,
    requestRemove: (holding) => {
      setPendingRemove(holding);
    },
    clearPendingRemove: () => {
      setPendingRemove(null);
    },
    confirmRemove: () => {
      if (!pendingRemove) return;

      dispatch(removeHolding(pendingRemove.symbol));
      setPendingRemove(null);

      pushToast({
        message: `Removed ${pendingRemove.symbol} from your portfolio.`,
        variant: 'success',
      });
    },
  };
}
