import { useState, type ReactNode } from 'react';
import { PerformanceContext, type PerformanceRange } from './PerformanceContext';
import { usePerformance } from './usePerformance';
import useSummary from '@hooks/useSummary';
import { useHoldingsSelector } from '@store/holdings/hooks';
import { selectHoldings } from '@store/holdings/store';

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

  const { portfolioDailyValue } = usePerformance();
  const { totalValue, lastUpdatedAt } = useSummary();

  const [range, setRange] = useState<PerformanceRange>(7);

  const rangedPortfolioDailyValue = portfolioDailyValue.slice(-range);

  const percentChange =
    rangedPortfolioDailyValue.length > 1 ? calculatePercentChange(rangedPortfolioDailyValue) : undefined;

  const value = {
    range,
    setRange,
    ranges,
    rangedPortfolioDailyValue,
    holdingsCount: holdings.length,
    lastUpdatedAt,
    totalValue,
    percentChange,
  };

  return <PerformanceContext value={value}>{children}</PerformanceContext>;
}
