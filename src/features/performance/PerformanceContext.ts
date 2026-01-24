import { createContext, use } from 'react';
import type { TimeString } from '@utils/date';

export type PerformanceRange = 7 | 30 | 90;

interface PerformancePoint {
  date: TimeString;
  value: number;
}

export interface PerformanceContext {
  range: PerformanceRange;
  setRange: (range: PerformanceRange) => void;
  ranges: { label: string; value: PerformanceRange }[];
  rangedPortfolioDailyValue: PerformancePoint[];
  holdingsCount: number;
  totalValue: number | undefined;
  percentChange: number | undefined;
}

export const PerformanceContext = createContext<PerformanceContext | null>(null);

export function usePerformanceContext(): PerformanceContext {
  const context = use(PerformanceContext);

  if (!context) {
    throw new Error('usePerformanceContext must be used within PerformanceProvider');
  }

  return context;
}
