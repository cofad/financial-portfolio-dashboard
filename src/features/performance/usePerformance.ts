import { fetchTimeSeriesDaily, type OHLCV } from '@/services/alpha-vantage/alpha-vantage';
import { useHoldingsSelector } from '@/store/holdings/hooks';
import { selectHoldings, selectHoldingSymbols } from '@/store/holdings/store';
import type { DateString } from '@/types/date-string';
import { useQueries } from '@tanstack/react-query';

interface UsePerformance {
  isError: boolean;
  isLoading: boolean;
  portfolioDailyValue: { date: DateString; value: number }[] | undefined;
}

function mergeTimeSeries(inputs: OHLCV[][]): { date: DateString; ohlcv: OHLCV[] }[] {
  const grouped = new Map<DateString, OHLCV[]>();

  for (const item of inputs.flat()) {
    const dateGroup = grouped.get(item.date);

    if (dateGroup) {
      dateGroup.push(item);
      continue;
    }

    grouped.set(item.date, [item]);
  }

  return Array.from(grouped.entries())
    .map(([date, ohlcv]) => ({
      date,
      ohlcv,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function usePerformance(): UsePerformance {
  const holdings = useHoldingsSelector(selectHoldings);
  const holdingSymbols = useHoldingsSelector(selectHoldingSymbols);

  const queries = holdingSymbols.map((symbol) => ({
    queryKey: ['timeSeries', symbol],
    queryFn: () => fetchTimeSeriesDaily(symbol),
    staleTime: Infinity,
  }));

  const queryResults = useQueries({ queries });

  const isLoading = queryResults.some((result) => result.isLoading);
  const isError = queryResults.some((result) => result.isError);

  const timeSeriesMultiple = isError || isLoading ? null : queryResults.map((result) => result.data ?? []);
  const timeSeries = timeSeriesMultiple && mergeTimeSeries(timeSeriesMultiple);

  const portfolioDailyValue = timeSeries?.map((series) => {
    const value = series.ohlcv.reduce((acc, ohlcv) => {
      const holding = holdings.find((h) => h.symbol === ohlcv.symbol);

      if (!holding) {
        throw new Error(`Holding not found for symbol: ${ohlcv.symbol}`);
      }

      const isHoldingOwnedOnDate = new Date(holding.purchaseDate) <= new Date(series.date);

      if (isHoldingOwnedOnDate) {
        return acc + ohlcv.close * holding.quantity;
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
