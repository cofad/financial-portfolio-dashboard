import { useMemo } from 'react';
import { useHoldings } from '@features/holdings/useHoldings';
import { formatCurrency } from '@/features/holdings/holdingsUtils';

const formatPercent = (value: number | null) =>
  typeof value === 'number' && Number.isFinite(value) ? `${value.toFixed(2)}%` : '-';

const getChangeTone = (value: number | null) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 'text-slate-400';
  }
  return value >= 0 ? 'text-emerald-300' : 'text-rose-300';
};

const Summary = () => {
  const { holdings, rows, secondsSinceUpdate, lastUpdatedAt, hasErrors, retryAll, isLoading } = useHoldings();

  const totals = useMemo(() => {
    let totalValue: number | null = null;
    let totalDailyChange: number | null = null;
    let totalPreviousClose: number | null = null;
    let stockValue = 0;
    let cryptoValue = 0;

    rows.forEach((row) => {
      if (typeof row.totalValue === 'number' && Number.isFinite(row.totalValue)) {
        totalValue = (totalValue ?? 0) + row.totalValue;
        if (row.assetType.toLowerCase().includes('crypto')) {
          cryptoValue += row.totalValue;
        } else {
          stockValue += row.totalValue;
        }
      }

      if (typeof row.dailyChange === 'number' && Number.isFinite(row.dailyChange)) {
        totalDailyChange = (totalDailyChange ?? 0) + row.dailyChange * row.quantity;
      }

      if (typeof row.previousClose === 'number' && Number.isFinite(row.previousClose)) {
        totalPreviousClose = (totalPreviousClose ?? 0) + row.previousClose * row.quantity;
      }
    });

    const totalDailyPercent =
      typeof totalDailyChange === 'number' &&
      typeof totalPreviousClose === 'number' &&
      Number.isFinite(totalPreviousClose) &&
      totalPreviousClose !== 0
        ? (totalDailyChange / totalPreviousClose) * 100
        : null;

    return {
      totalValue,
      totalDailyChange,
      totalDailyPercent,
      stockValue,
      cryptoValue,
    };
  }, [rows]);

  const allocationTotal = totals.stockValue + totals.cryptoValue;
  const stockPercent = allocationTotal > 0 ? (totals.stockValue / allocationTotal) * 100 : 0;
  const cryptoPercent = allocationTotal > 0 ? (totals.cryptoValue / allocationTotal) * 100 : 0;

  const lastUpdatedLabel =
    lastUpdatedAt === null
      ? '-'
      : new Date(lastUpdatedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const updatedAgoLabel = secondsSinceUpdate === null ? '' : `${String(secondsSinceUpdate)}s ago`;

  if (holdings.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center text-sm text-slate-400">
        No holdings yet. Add assets to see a portfolio overview.
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-end gap-4">
        <div className="rounded-full border border-slate-800 bg-slate-950/70 px-4 py-2 text-xs text-slate-300">
          Last updated: {lastUpdatedLabel}
          {updatedAgoLabel ? ` (${updatedAgoLabel})` : ''}
        </div>
      </div>

      <div className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-950/40 p-6">
        {hasErrors ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            <div>
              <p className="font-semibold">Some prices failed to refresh.</p>
              <p className="text-xs text-rose-200">Retry or check your connection.</p>
            </div>

            <button
              type="button"
              onClick={retryAll}
              className="rounded-full border border-rose-300/60 px-3 py-1 text-xs font-semibold text-rose-100 transition hover:border-rose-200 hover:text-white"
            >
              Retry now
            </button>
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-slate-900/40">
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Total Value</p>

            <div className="mt-4">
              {isLoading && totals.totalValue === null ? (
                <div className="h-8 w-36 animate-pulse rounded-full bg-slate-800/80" />
              ) : (
                <p className="text-2xl font-semibold text-slate-100">{formatCurrency(totals.totalValue)}</p>
              )}

              <p className="mt-1 text-xs text-slate-400">USD</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-slate-900/40">
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Daily P/L</p>

            <div className="mt-4">
              {isLoading && totals.totalDailyChange === null ? (
                <div className="h-8 w-32 animate-pulse rounded-full bg-slate-800/80" />
              ) : (
                <div className={`text-2xl font-semibold ${getChangeTone(totals.totalDailyChange)}`}>
                  {formatCurrency(totals.totalDailyChange)}
                </div>
              )}

              <p className={`mt-1 text-xs ${getChangeTone(totals.totalDailyChange)}`}>
                {formatPercent(totals.totalDailyPercent)}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-slate-900/40">
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Allocation</p>

            <div className="mt-4">
              {isLoading && allocationTotal === 0 ? (
                <div className="h-8 w-full animate-pulse rounded-full bg-slate-800/80" />
              ) : (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Summary;
