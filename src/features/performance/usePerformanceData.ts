import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

export type PerformanceRange = '7d' | '30d' | '90d' | '1y';

export interface PerformancePoint {
  date: string;
  value: number;
}

interface PerformanceResult {
  points: PerformancePoint[];
  percentChange: number | null;
  isLoading: boolean;
  isError: boolean;
}

interface PerformanceSeed {
  startDate: string;
  startValue: number;
  dailyVolatility: number;
  trend: number;
  seed: number;
}

const rangeDays: Record<PerformanceRange, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '1y': 365,
};

const msPerDay = 24 * 60 * 60 * 1000;

const toDateKey = (date: Date) => date.toISOString().slice(0, 10);

const createRng = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
};

const hashSeed = (input: string) => {
  let hash = 5381;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 33) ^ input.charCodeAt(index);
  }
  return hash >>> 0;
};

const buildSeed = (symbols: string[], targetValue: number | null): PerformanceSeed => {
  const baseValue = typeof targetValue === 'number' && Number.isFinite(targetValue) ? targetValue : 85000;
  const sortedSymbols = [...symbols].sort().join('|');
  const seed = hashSeed(`${sortedSymbols}:${baseValue.toFixed(2)}`);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 400);

  return {
    startDate: toDateKey(startDate),
    startValue: Math.max(1000, baseValue * 0.82),
    dailyVolatility: 0.012,
    trend: 0.0006,
    seed,
  };
};

const generateSeries = (seed: PerformanceSeed): PerformancePoint[] => {
  const startDate = new Date(`${seed.startDate}T00:00:00Z`);
  const endDate = new Date();
  const totalDays = Math.max(1, Math.floor((endDate.getTime() - startDate.getTime()) / msPerDay));
  const rng = createRng(seed.seed);
  const points: PerformancePoint[] = [];
  let value = seed.startValue;

  for (let dayIndex = 0; dayIndex <= totalDays; dayIndex += 1) {
    if (dayIndex > 0) {
      const shock = (rng() - 0.5) * 2 * seed.dailyVolatility;
      value = Math.max(1000, value * (1 + seed.trend + shock));
    }

    const currentDate = new Date(startDate.getTime() + dayIndex * msPerDay);
    points.push({
      date: toDateKey(currentDate),
      value,
    });
  }

  return points;
};

const scaleSeries = (points: PerformancePoint[], targetValue: number | null) => {
  if (points.length === 0 || typeof targetValue !== 'number' || !Number.isFinite(targetValue)) {
    return points;
  }

  const lastValue = points[points.length - 1]?.value ?? null;
  if (lastValue === null || lastValue <= 0) {
    return points;
  }

  const scale = targetValue / lastValue;
  return points.map((point) => ({
    ...point,
    value: point.value * scale,
  }));
};

const sliceRange = (points: PerformancePoint[], range: PerformanceRange) => {
  const count = rangeDays[range];
  return points.length <= count ? points : points.slice(points.length - count);
};

const calculatePercentChange = (points: PerformancePoint[]) => {
  if (points.length < 2) {
    return null;
  }

  const firstValue = points[0]?.value ?? null;
  const lastValue = points[points.length - 1]?.value ?? null;
  if (firstValue === null || lastValue === null || firstValue === 0) {
    return null;
  }

  return ((lastValue - firstValue) / firstValue) * 100;
};

export const usePerformanceData = (
  range: PerformanceRange,
  targetValue: number | null,
  symbols: string[],
): PerformanceResult => {
  const seed = buildSeed(symbols, targetValue);
  const query = useQuery({
    queryKey: ['portfolio-performance', seed.seed],
    queryFn: () =>
      new Promise<PerformanceSeed>((resolve) => {
        window.setTimeout(() => {
          resolve(seed);
        }, 450);
      }),
    staleTime: 15 * 60 * 1000,
  });

  const { points, percentChange } = useMemo(() => {
    if (!query.data) {
      return { points: [], percentChange: null };
    }

    const series = generateSeries(query.data);
    const scaledSeries = scaleSeries(series, targetValue);
    const rangedSeries = sliceRange(scaledSeries, range);

    return {
      points: rangedSeries,
      percentChange: calculatePercentChange(rangedSeries),
    };
  }, [query.data, range, targetValue]);

  return {
    points,
    percentChange,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
