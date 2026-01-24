import { formatCurrency } from '@/features/holdings/holdingsUtils';
import useSummary from '@/hooks/useSummary';
import AllocationChart from '@components/allocation-chart/AllocationChart';
import LastUpdated from '@components/last-updated/LastUpdated';
import ProfitOrLoss from '@components/profit-or-loss/ProfitOrLoss';

const Summary = () => {
  const { isLoading, isError, liveHoldings, totalValue, dailyProfitLoss, allocations, lastUpdatedAt } =
    useSummary();

  if (isLoading) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center text-sm text-slate-400">
        Loading summary...
      </section>
    );
  }

  if (isError || !liveHoldings || !totalValue || !allocations || dailyProfitLoss === undefined) {
    return (
      <section className="rounded-3xl border border-rose-500/40 bg-rose-500/10 p-8 text-center text-sm text-rose-100">
        Failed to load summary. Please try again later.
      </section>
    );
  }

  if (liveHoldings.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center text-sm text-slate-400">
        No holdings yet. Add assets to see a portfolio overview.
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <LastUpdated lastUpdatedAt={lastUpdatedAt} className="self-start" />

      <div className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-950/40 p-6">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-slate-900/40">
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Total Value</p>

            <div className="mt-4">
              <p className="text-2xl font-semibold text-slate-100">{formatCurrency(totalValue)}</p>
              <p className="mt-1 text-xs text-slate-400">USD</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-slate-900/40">
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Daily P/L</p>

            <div className="mt-4 flex text-2xl font-semibold">
              <ProfitOrLoss value={dailyProfitLoss} />
              <span className="mx-3">/</span>
              <ProfitOrLoss value={dailyProfitLoss / totalValue} type="percent" />
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
};

export default Summary;
