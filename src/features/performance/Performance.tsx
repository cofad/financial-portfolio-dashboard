import { useMemo, useState } from 'react';
import { useHoldings } from '@features/holdings/useHoldings';
import { formatCurrency } from '@features/holdings/portfolioUtils';
import PerformanceChart from './PerformanceChart';
import PerformanceRangeSelector from './PerformanceRangeSelector';
import { usePerformanceData, type PerformanceRange } from './usePerformanceData';

const formatPercent = (value: number | null) =>
  typeof value === 'number' && Number.isFinite(value) ? `${value >= 0 ? '+' : ''}${value.toFixed(2)}%` : '—';

const getChangeTone = (value: number | null) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 'text-slate-400';
  }
  return value >= 0 ? 'text-emerald-300' : 'text-rose-300';
};

const Performance = () => {
  const { holdings, rows } = useHoldings();
  const [range, setRange] = useState<PerformanceRange>('30d');

  const totalValue = useMemo(() => {
    let total: number | null = null;
    rows.forEach((row) => {
      if (typeof row.totalValue === 'number' && Number.isFinite(row.totalValue)) {
        total = (total ?? 0) + row.totalValue;
      }
    });
    return total;
  }, [rows]);

  const symbols = useMemo(() => holdings.map((holding) => holding.symbol), [holdings]);
  const { points, percentChange, isLoading, isError } = usePerformanceData(range, totalValue, symbols);

  if (holdings.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center text-sm text-slate-400">
        Add holdings to see portfolio performance over time.
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <PerformanceRangeSelector value={range} onChange={setRange} />

      <div className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-950/40 p-6">
        {isError ? (
          <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            Unable to load performance data right now.
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Period Change</p>
            <div className="mt-3">
              {isLoading ? (
                <div className="h-7 w-24 animate-pulse rounded-full bg-slate-800/80" />
              ) : (
                <p className={`text-2xl font-semibold ${getChangeTone(percentChange)}`}>
                  {formatPercent(percentChange)}
                </p>
              )}
              <p className="mt-1 text-xs text-slate-400">{range.toUpperCase()} performance</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Current Value</p>
            <div className="mt-2 text-lg font-semibold text-slate-100">
              {isLoading && totalValue === null ? (
                <div className="h-6 w-28 animate-pulse rounded-full bg-slate-800/80" />
              ) : (
                formatCurrency(totalValue)
              )}
            </div>
          </div>
        </div>

        <PerformanceChart data={points} isLoading={isLoading} />
      </div>
    </section>
  );
};

export default Performance;
