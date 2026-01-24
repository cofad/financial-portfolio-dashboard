import { useSuspenseQueries } from '@tanstack/react-query';
import { fetchHistory, type History } from '@services/mock-api/mock-api';
import { useHoldingsSelector } from '@store/holdings/hooks';
import { selectHoldings, selectHoldingSymbols } from '@store/holdings/store';
import type { TimeString } from '@utils/date';
import { startOfDay } from 'date-fns';

interface UsePerformance {
  portfolioDailyValue: { date: TimeString; value: number }[];
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

  const queryResults = useSuspenseQueries({
    queries: holdingSymbols.map((symbol) => ({
      queryKey: ['timeSeries', symbol],
      queryFn: () => fetchHistory(symbol),
      staleTime: Infinity,
    })),
  });

  const histories = queryResults.map((result) => result.data);
  const mergedHistory = mergeTimeSeries(histories);

  const portfolioDailyValue = mergedHistory.map((history) => {
    const value = history.history.reduce((acc, history) => {
      const holding = holdings.find((h) => h.symbol === history.symbol);

      if (!holding) {
        throw new Error(`Holding not found for symbol: ${history.symbol}`);
      }

      const isHoldingOwnedOnDate = startOfDay(holding.purchaseDate) <= startOfDay(history.date);

      if (isHoldingOwnedOnDate) {
        return acc + history.price * holding.quantity;
      }

      return acc;
    }, 0);

    return {
      date: history.date,
      value: value,
    };
  });

  return {
    portfolioDailyValue,
  };
}
