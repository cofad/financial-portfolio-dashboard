import { useMemo } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';

import { type Holding } from '@store/holdings/slice';
import { useHoldingsSelector } from '@store/holdings/hooks';
import { selectHoldings, selectHoldingSymbols } from '@store/holdings/store';
import { type Quote } from '@services/mock-api/mock-api';

import { buildQuotesQueryOptions } from './quotes-query';

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
  liveHoldings: LiveHolding[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  lastUpdatedAt: Date;
}

export function useLiveHoldings(): UseHoldings {
  const holdings = useHoldingsSelector(selectHoldings);
  const holdingSymbols = useHoldingsSelector(selectHoldingSymbols);

  const {
    data: quotes,
    isLoading,
    isError,
    dataUpdatedAt,
    isFetching,
  } = useSuspenseQuery(buildQuotesQueryOptions(holdingSymbols));

  const liveHoldings: LiveHolding[] = useMemo(() => {
    return holdings.map((holding) => {
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
    });
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
