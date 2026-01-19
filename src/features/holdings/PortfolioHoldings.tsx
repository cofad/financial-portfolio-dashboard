import { useMemo, useState } from 'react';
import ConfirmDialog from '@components/confirm-dialog/ConfirmDialog';
import HoldingsCards from './HoldingsCards';
import HoldingsTable from './HoldingsTable';
import { useToast } from '@components/toast/useToast';
import { useAppDispatch } from '@store/hooks';
import { removeHolding } from '@store/portfolioSlice';
import type { HoldingRow, SortKey, SortRule } from './portfolioTypes';
import { useHoldings } from '@features/holdings/useHoldings';
import {
  compareValues,
  formatCurrency,
  formatDate,
  formatQuantity,
  getCurrentPriceText,
  getProfitLossTone,
  getSortValue,
  holdingsColumns,
  updateSortRules,
} from './portfolioUtils';

const PortfolioHoldings = () => {
  const dispatch = useAppDispatch();
  const { pushToast } = useToast();
  const [sortRules, setSortRules] = useState<SortRule[]>([{ key: 'symbol', direction: 'asc' }]);
  const [pendingRemove, setPendingRemove] = useState<HoldingRow | null>(null);
  const { holdings, rows, secondsSinceUpdate, hasErrors, retryAll } = useHoldings();

  const sortedRows = useMemo(() => {
    if (sortRules.length === 0) {
      return rows;
    }
    return [...rows].sort((a, b) => {
      for (const rule of sortRules) {
        const comparison = compareValues(getSortValue(a, rule.key), getSortValue(b, rule.key));
        if (comparison !== 0) {
          return rule.direction === 'asc' ? comparison : -comparison;
        }
      }
      return 0;
    });
  }, [rows, sortRules]);

  const handleSortToggle = (key: SortKey) => {
    setSortRules((prev) => updateSortRules(prev, key));
  };

  const handleRemove = (row: HoldingRow) => {
    setPendingRemove(row);
  };

  const confirmRemove = () => {
    if (!pendingRemove) {
      return;
    }
    dispatch(removeHolding(pendingRemove.symbol));
    pushToast({
      message: `Removed ${pendingRemove.symbol} from your portfolio.`,
      variant: 'success',
    });
    setPendingRemove(null);
  };

  if (holdings.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center text-sm text-slate-400">
        No holdings yet. Add your first asset to see market values and performance.
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">Portfolio Holdings</h2>
          <p className="text-xs text-slate-400">Click a column to toggle sort direction.</p>
        </div>
        <div className="flex items-center gap-3 rounded-full border border-slate-800 bg-slate-950/70 px-4 py-2 text-xs text-slate-300">
          <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
          <span>
            Last updated:{' '}
            {secondsSinceUpdate === null
              ? '—'
              : `${String(secondsSinceUpdate)} second${secondsSinceUpdate === 1 ? '' : 's'} ago`}
          </span>
        </div>
      </div>

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

      <div className="flex flex-wrap gap-2 md:hidden">
        {holdingsColumns.map((column) => {
          const ruleIndex = sortRules.findIndex((rule) => rule.key === column.key);
          const rule = ruleIndex >= 0 ? sortRules[ruleIndex] : null;
          let directionLabel = '';

          if (rule?.direction === 'asc') {
            directionLabel = '↑';
          } else if (rule?.direction === 'desc') {
            directionLabel = '↓';
          }

          return (
            <button
              key={column.key}
              type="button"
              onClick={() => {
                handleSortToggle(column.key);
              }}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                rule
                  ? 'border-slate-500 bg-slate-900 text-slate-100'
                  : 'border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
              }`}
            >
              <span>{column.label}</span>
              {rule && (
                <span className="text-[10px] text-slate-300">
                  {ruleIndex + 1}
                  {directionLabel}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="block md:hidden">
        <HoldingsCards
          rows={sortedRows}
          onRemove={handleRemove}
          formatCurrency={formatCurrency}
          formatQuantity={formatQuantity}
          formatDate={formatDate}
          getProfitLossTone={getProfitLossTone}
          getCurrentPriceText={getCurrentPriceText}
        />
      </div>
      <div className="hidden md:block">
        <HoldingsTable
          rows={sortedRows}
          sortRules={sortRules}
          onSortToggle={handleSortToggle}
          onRemove={handleRemove}
          formatCurrency={formatCurrency}
          formatQuantity={formatQuantity}
          formatDate={formatDate}
          getProfitLossTone={getProfitLossTone}
          getCurrentPriceText={getCurrentPriceText}
        />
      </div>

      <ConfirmDialog
        open={Boolean(pendingRemove)}
        title="Remove holding?"
        description={
          pendingRemove ? `Remove ${pendingRemove.symbol} from your portfolio? This cannot be undone.` : undefined
        }
        confirmLabel="Remove"
        cancelLabel="Cancel"
        onConfirm={confirmRemove}
        onCancel={() => {
          setPendingRemove(null);
        }}
      />
    </section>
  );
};

export default PortfolioHoldings;
