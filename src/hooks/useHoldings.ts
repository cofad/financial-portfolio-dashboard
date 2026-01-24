import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getQuotes, type Quote } from '@services/finnhub/finnhub';
import { type Holding } from '@store/holdings/slice';
import { useHoldingsSelector } from '@store/holdings/hooks';
import { selectHoldings, selectHoldingSymbols } from '@store/holdings/store';

export interface LiveHolding extends Holding {
  currentPrice: number;
  currentValue: number;
  profitLoss: number;
  dailyProfitLoss: number;
}

function extractQuote(symbol: string, quotes: Quote[]): Quote {
  const quote = quotes.find((q) => q.symbol === symbol);

  if (!quote) throw new Error(`Quote not found for symbol: ${symbol}`);

  return quote;
}

export interface UseHoldings {
  liveHoldings: LiveHolding[] | null;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  lastUpdatedAt: Date;
}

export function useHoldings(): UseHoldings {
  const holdings = useHoldingsSelector(selectHoldings);
  const holdingSymbols = useHoldingsSelector(selectHoldingSymbols);

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
          const quote = extractQuote(holding.symbol, quotes);

          const currentPrice = quote.currentPrice;
          const currentValue = currentPrice * holding.quantity;
          const purchasedValue = holding.purchasePrice * holding.quantity;
          const profitLoss = currentValue - purchasedValue;
          const dailyProfitLoss = (currentPrice - quote.previousClosePrice) * holding.quantity;

          return {
            ...holding,
            currentPrice,
            currentValue,
            profitLoss,
            dailyProfitLoss,
          };
        })
      : null;
  }, [holdings, quotes]);

  const lastUpdatedAt = new Date(dataUpdatedAt);

  return {
    liveHoldings,
    isLoading,
    isFetching,
    isError,
    lastUpdatedAt,
  };
}
