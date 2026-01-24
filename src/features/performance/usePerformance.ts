import { fetchHistory, type History } from '@/services/mock-api/mock-api';
import { useHoldingsSelector } from '@/store/holdings/hooks';
import { selectHoldings, selectHoldingSymbols } from '@/store/holdings/store';
import type { TimeString } from '@/utils/date';
import { useQueries } from '@tanstack/react-query';

interface UsePerformance {
  isError: boolean;
  isLoading: boolean;
  portfolioDailyValue: { date: TimeString; value: number }[] | undefined;
}

function mergeTimeSeries(inputs: History[][]): { date: TimeString; history: History[] }[] {
  const grouped = new Map<TimeString, History[]>();

  for (const item of inputs.flat()) {
    const dateGroup = grouped.get(item.date);

    if (dateGroup) {
      dateGroup.push(item);
      continue;
    }

    grouped.set(item.date, [item]);
  }

  return Array.from(grouped.entries())
    .map(([date, history]) => ({
      date,
      history,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function usePerformance(): UsePerformance {
  const holdings = useHoldingsSelector(selectHoldings);
  const holdingSymbols = useHoldingsSelector(selectHoldingSymbols);

  const queryResults = useQueries({
    queries: holdingSymbols.map((symbol) => ({
      queryKey: ['timeSeries', symbol],
      queryFn: () => fetchHistory(symbol),
      staleTime: Infinity,
      retries: false,
    })),
  });

  const isLoading = queryResults.some((result) => result.isLoading);
  const isError = queryResults.some((result) => result.isError);

  const histories = isError || isLoading ? null : queryResults.map((result) => result.data ?? []);
  const mergedHistory = histories && mergeTimeSeries(histories);

  const portfolioDailyValue = mergedHistory?.map((series) => {
    const value = series.history.reduce((acc, history) => {
      const holding = holdings.find((h) => h.symbol === history.symbol);

      if (!holding) {
        throw new Error(`Holding not found for symbol: ${history.symbol}`);
      }

      const isHoldingOwnedOnDate = new Date(holding.purchaseDate) <= new Date(series.date);

      if (isHoldingOwnedOnDate) {
        return acc + history.price * holding.quantity;
      }

      return acc;
    }, 0);

    return {
      date: series.date,
      value: value,
    };
  });

  return {
    portfolioDailyValue,
    isError,
    isLoading,
  };
}
