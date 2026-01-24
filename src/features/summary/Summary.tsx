import { Suspense } from 'react';
import useSummary from '@hooks/useSummary';
import { formatCurrency } from '@utils/currency';
import AllocationChart from '@components/allocation-chart/AllocationChart';
import LastUpdated from '@components/last-updated/LastUpdated';
import ProfitOrLoss from '@components/profit-or-loss/ProfitOrLoss';
import SummaryErrorBoundary from './SummaryErrorBoundary';
import SummaryLoadingState from './SummaryLoadingState';

function SummaryContent() {
  const { liveHoldings, totalValue, dailyProfitLoss, allocations, lastUpdatedAt } = useSummary();

  if (liveHoldings.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center text-sm text-slate-400">
        No holdings yet. Add assets to see a portfolio overview.
      </section>
    );
  }

  const dailyProfitLossPercent = totalValue === 0 ? 0 : dailyProfitLoss / totalValue;

  return (
    <section className="flex flex-col gap-4">
      <LastUpdated lastUpdatedAt={lastUpdatedAt} className="self-start" />

      <div className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-950/40 p-6">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-slate-900/40">
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Total Value</p>

            <div className="mt-4">
              <p className="text-2xl font-semibold text-slate-100">
                <span className="mr-2">{formatCurrency(totalValue)}</span>
                <span className="text-xs text-slate-400">USD</span>
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-slate-900/40">
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Daily P/L</p>

            <div className="mt-4 flex text-2xl font-semibold">
              <ProfitOrLoss value={dailyProfitLoss} />
              <span className="mx-3">/</span>
              <ProfitOrLoss value={dailyProfitLossPercent} type="percent" />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-slate-900/40">
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Allocation</p>
            <AllocationChart allocations={allocations} className="mt-4" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Summary() {
  return (
    <SummaryErrorBoundary>
      <Suspense fallback={<SummaryLoadingState />}>
        <SummaryContent />
      </Suspense>
    </SummaryErrorBoundary>
  );
}
