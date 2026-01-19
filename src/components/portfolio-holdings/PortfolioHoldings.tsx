import { useMemo, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import ConfirmDialog from '@/components/confirm-dialog/ConfirmDialog';
import HoldingsCards from './HoldingsCards';
import HoldingsTable from './HoldingsTable';
import { useToast } from '@components/toast/useToast';
import { getQuote } from '@/services/finnhub/finnhub';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { removeHolding } from '@/store/portfolioSlice';
import type { HoldingRow, SortKey, SortRule } from './portfolioTypes';
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
  const holdings = useAppSelector((state) => state.portfolio.holdings);
  const dispatch = useAppDispatch();
  const { pushToast } = useToast();
  const [sortRules, setSortRules] = useState<SortRule[]>([{ key: 'symbol', direction: 'asc' }]);
  const [pendingRemove, setPendingRemove] = useState<HoldingRow | null>(null);

  const quoteQueries = useQueries({
    queries: holdings.map((holding) => ({
      queryKey: ['quote', holding.symbol] as const,
      queryFn: () => getQuote(holding.symbol),
      staleTime: 30_000,
    })),
  });

  const rows = useMemo<HoldingRow[]>(
    () =>
      holdings.map((holding, index) => {
        const quote = quoteQueries[index];
        const price = typeof quote?.data?.c === 'number' && Number.isFinite(quote.data.c) ? quote.data.c : null;
        const totalValue = price !== null ? price * holding.quantity : null;
        const profitLoss = price !== null ? (price - holding.purchasePrice) * holding.quantity : null;
        const quoteStatus = quote?.isFetching
          ? 'loading'
          : quote?.isError
            ? 'error'
            : price !== null
              ? 'ready'
              : 'idle';
        return {
          ...holding,
          currentPrice: price,
          totalValue,
          profitLoss,
          quoteStatus,
        };
      }),
    [holdings, quoteQueries],
  );

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
      </div>

      <div className="flex flex-wrap gap-2 md:hidden">
        {holdingsColumns.map((column) => {
          const ruleIndex = sortRules.findIndex((rule) => rule.key === column.key);
          const rule = ruleIndex >= 0 ? sortRules[ruleIndex] : null;
          const directionLabel = rule?.direction === 'asc' ? '↑' : rule?.direction === 'desc' ? '↓' : '';
          return (
            <button
              key={column.key}
              type="button"
              onClick={() => handleSortToggle(column.key)}
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
        onCancel={() => setPendingRemove(null)}
      />
    </section>
  );
};

export default PortfolioHoldings;
