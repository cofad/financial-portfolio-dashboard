import { formatCurrency } from '@/features/holdings/holdingsUtils';
import useSummary from '@/hooks/useSummary';
import LastUpdated from '@/components/last-updated/LastUpdated';
import ProfitOrLoss from '@/components/profit-or-loss/ProfitOrLoss';

const Summary = () => {
  const { isLoading, isError, liveHoldings, totalValue, dailyProfitLoss, allocation, lastUpdatedAt } =
    useSummary();

  if (isLoading) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center text-sm text-slate-400">
        Loading summary...
      </section>
    );
  }

  if (isError || !liveHoldings || !totalValue || !dailyProfitLoss || !allocation) {
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

            <div className="mt-4">
              <ProfitOrLoss value={dailyProfitLoss} className="text-2xl font-semibold" />
              <ProfitOrLoss value={dailyProfitLoss / totalValue} className="mt-1 text-xs font-semibold" />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-slate-900/40">
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Allocation</p>

            {Object.entries(allocation).map(([assetType, count]) => (
              <div key={assetType} className="mt-4 flex items-center justify-between">
                <span className="text-sm text-slate-200">{assetType}</span>
                <span className="text-sm font-medium text-slate-100">{count}</span>
              </div>
            ))}

            {/* 
            <div className="mt-4">
              <>
                <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-900">
                  <div className="h-full bg-slate-500" style={{ width: `${stockPercent}%` }} />
                  <div className="h-full bg-emerald-400" style={{ width: `${cryptoPercent}%` }} />
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                    Stocks {formatPercent(stockPercent)}
                  </span>

                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Crypto {formatPercent(cryptoPercent)}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                  <span>{formatCurrency(totals.stockValue)}</span>
                  <span>{formatCurrency(totals.cryptoValue)}</span>
                </div>
              </>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Summary;
