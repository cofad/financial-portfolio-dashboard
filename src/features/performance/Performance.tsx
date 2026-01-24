import { formatCurrency } from '@/features/holdings/holdingsUtils';
import PerformanceChart from './PerformanceChart';
import PerformanceRangeSelector from './PerformanceRangeSelector';
import { PerformanceProvider } from './PerformanceProvider';
import { usePerformanceContext } from './PerformanceContext';
import ProfitOrLoss from '@/components/profit-or-loss/ProfitOrLoss';

const PerformanceContent = () => {
  const { isLoading, isError, rangedPortfolioDailyValue, holdingsCount, totalValue, percentChange } =
    usePerformanceContext();

  if (isLoading) {
    return (
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-950/40 p-6">
          <div className="h-6 w-28 animate-pulse rounded-full bg-slate-800/80" />
          <div className="h-48 w-full animate-pulse rounded-2xl bg-slate-800/80" />
        </div>
      </section>
    );
  }

  if (isError || !rangedPortfolioDailyValue) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center text-sm text-slate-400">
        Unable to load performance data right now.
      </section>
    );
  }

  if (holdingsCount === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center text-sm text-slate-400">
        Add holdings to see portfolio performance over time.
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <PerformanceRangeSelector />

      <div className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-950/40 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-right">
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Percent Change</p>
            <div className="mt-3">
              {percentChange ? <ProfitOrLoss value={percentChange} type="percent" /> : 'N/A'}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-right">
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Current Value</p>
            <div className="mt-2 text-lg font-semibold text-slate-100">{formatCurrency(totalValue ?? null)}</div>
          </div>
        </div>

        <PerformanceChart data={rangedPortfolioDailyValue} isLoading={isLoading} />
      </div>
    </section>
  );
};

function Performance() {
  return (
    <PerformanceProvider>
      <PerformanceContent />
    </PerformanceProvider>
  );
}

export default Performance;
