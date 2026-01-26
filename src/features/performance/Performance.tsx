import PerformanceChart from './PerformanceChart';
import PerformanceRangeSelector from './PerformanceRangeSelector';
import PerformanceErrorBoundary from './PerformanceErrorBoundary';
import PerformanceLoadingState from './PerformanceLoadingState';
import { PerformanceProvider } from './PerformanceProvider';
import { usePerformanceContext } from './PerformanceContext';
import { Suspense } from 'react';
import EmptyState from '@components/empty-state/EmptyState';
import ProfitOrLoss from '@components/profit-or-loss/ProfitOrLoss';
import { formatCurrency } from '@utils/currency';
import { useHoldingsSelector } from '@store/holdings/hooks';
import { selectHoldings } from '@store/holdings/store';
import LastUpdated from '@components/last-updated/LastUpdated';

function PerformanceContent() {
  const { rangedPortfolioDailyValue, totalValue, percentChange, lastUpdatedAt } = usePerformanceContext();

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <LastUpdated lastUpdatedAt={lastUpdatedAt} />
        <PerformanceRangeSelector />
      </div>

      <div className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-950/40 p-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="w-full rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-left sm:flex-1">
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Percent Change</p>
            <div className="mt-3">
              {percentChange === undefined ? 'N/A' : <ProfitOrLoss value={percentChange} type="percent" />}
            </div>
          </div>

          <div className="w-full rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-left sm:flex-1">
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Current Value</p>
            <div className="mt-2 text-lg font-semibold text-slate-100">
              {totalValue && formatCurrency(totalValue)}
            </div>
          </div>
        </div>

        <PerformanceChart data={rangedPortfolioDailyValue} />
      </div>
    </div>
  );
}

function Performance() {
  const holdings = useHoldingsSelector(selectHoldings);

  return (
    <PerformanceErrorBoundary>
      <PerformanceProvider>
        <section className="flex flex-col gap-4">
          {holdings.length === 0 ? (
            <EmptyState message="No holdings yet. Add assets to see portfolio performance over time." />
          ) : (
            <>
              <Suspense fallback={<PerformanceLoadingState />}>
                <PerformanceContent />
              </Suspense>
            </>
          )}
        </section>
      </PerformanceProvider>
    </PerformanceErrorBoundary>
  );
}

export default Performance;
