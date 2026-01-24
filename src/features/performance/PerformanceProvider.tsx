import { useState, type ReactNode } from 'react';
import { PerformanceContext, type PerformanceRange } from './PerformanceContext';
import { usePerformance } from './usePerformance';
import { useHoldingsSelector } from '@/store/holdings/hooks';
import { selectHoldings } from '@/store/holdings/store';
import useSummary from '@/hooks/useSummary';

interface PerformanceProviderProps {
  children: ReactNode;
}

const ranges: { label: string; value: PerformanceRange }[] = [
  { label: '7d', value: 7 },
  { label: '30d', value: 30 },
  { label: '90d', value: 90 },
];

function calculatePercentChange(data: { date: string; value: number }[]): number | undefined {
  const prevValue = data[0].value;
  const currentValue = data[data.length - 1].value;

  if (prevValue === 0) {
    return undefined;
  }

  return ((currentValue - prevValue) / prevValue) * 100;
}

export function PerformanceProvider({ children }: PerformanceProviderProps) {
  const holdings = useHoldingsSelector(selectHoldings);

  const { isError, isLoading, portfolioDailyValue } = usePerformance();
  const { totalValue } = useSummary();

  const [range, setRange] = useState<PerformanceRange>(7);

  const rangedPortfolioDailyValue = portfolioDailyValue?.slice(-range);

  const percentChange = rangedPortfolioDailyValue && calculatePercentChange(rangedPortfolioDailyValue);

  const value = {
    range,
    setRange,
    ranges,
    isError,
    isLoading,
    rangedPortfolioDailyValue,
    holdingsCount: holdings.length,
    totalValue,
    percentChange,
  };

  return <PerformanceContext value={value}>{children}</PerformanceContext>;
}
