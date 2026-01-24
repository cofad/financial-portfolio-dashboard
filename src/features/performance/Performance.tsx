import PerformanceChart from './PerformanceChart';
import PerformanceRangeSelector from './PerformanceRangeSelector';
import PerformanceErrorBoundary from './PerformanceErrorBoundary/PerformanceErrorBoundary';
import PerformanceLoadingState from './PerformanceLoadingState/PerformanceLoadingState';
import { PerformanceProvider } from './PerformanceProvider';
import { usePerformanceContext } from './PerformanceContext';
import { Suspense } from 'react';
import ProfitOrLoss from '@components/profit-or-loss/ProfitOrLoss';
import { formatCurrency } from '@utils/currency';

const PerformanceContent = () => {
  const { rangedPortfolioDailyValue, holdingsCount, totalValue, percentChange } = usePerformanceContext();

  if (holdingsCount === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center text-sm text-slate-400">
        Add holdings to see portfolio performance over time.
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-950/40 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-right">
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Percent Change</p>
          <div className="mt-3">
            {percentChange === undefined ? 'N/A' : <ProfitOrLoss value={percentChange} type="percent" />}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-right">
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Current Value</p>
          <div className="mt-2 text-lg font-semibold text-slate-100">
            {totalValue && formatCurrency(totalValue)}
          </div>
        </div>
      </div>

      <PerformanceChart data={rangedPortfolioDailyValue} />
    </div>
  );
};

function Performance() {
  return (
    <PerformanceErrorBoundary>
      <PerformanceProvider>
        <section className="flex flex-col gap-4">
          <PerformanceRangeSelector />

          <Suspense fallback={<PerformanceLoadingState />}>
            <PerformanceContent />
          </Suspense>
        </section>
      </PerformanceProvider>
    </PerformanceErrorBoundary>
  );
}

export default Performance;
