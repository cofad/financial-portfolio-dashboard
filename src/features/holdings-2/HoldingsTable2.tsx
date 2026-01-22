import { useMemo, useState } from 'react';

import { formatCurrency } from '@utils/currency';
import { formatDate } from '@utils/date';
import type { LiveHolding } from './useHoldings2';
import ConfirmDialog from '@components/confirm-dialog/ConfirmDialog';
import { useToast } from '@components/toast/useToast';
import { useHoldingsDispatch } from '@store/holdings/hooks';
import { removeHolding } from '@store/holdings/slice';

interface HoldingsTable2Props {
  liveHoldings: LiveHolding[];
  isUpdating: boolean;
}

const SORT_KEY = {
  symbol: 'symbol',
  quantity: 'quantity',
  purchasePrice: 'purchasePrice',
  currentPrice: 'currentPrice',
  currentValue: 'currentValue',
  profitLoss: 'profitLoss',
  purchaseDate: 'purchaseDate',
  assetType: 'assetType',
} as const satisfies Record<keyof LiveHolding, keyof LiveHolding>;

type SortKey = keyof typeof SORT_KEY;

type SortDirection = 'asc' | 'desc';

interface SortState {
  key: SortKey;
  direction: SortDirection;
}

const COLUMNS = [
  { key: SORT_KEY.symbol, label: 'Symbol', align: 'left' },
  { key: SORT_KEY.assetType, label: 'Type', align: 'left' },
  { key: SORT_KEY.quantity, label: 'Qty.', align: 'right' },
  { key: SORT_KEY.purchasePrice, label: 'Purchase Price', align: 'right' },
  { key: SORT_KEY.currentPrice, label: 'Current Price', align: 'right' },
  { key: SORT_KEY.currentValue, label: 'Total Value', align: 'right' },
  { key: SORT_KEY.profitLoss, label: 'P/L', align: 'right' },
  { key: SORT_KEY.purchaseDate, label: 'Purchase Date', align: 'right' },
] as const satisfies { key: SortKey; label: string; align?: 'left' | 'right' }[];

function getSortValue(holding: LiveHolding, key: SortKey): number | string {
  switch (key) {
    case SORT_KEY.symbol:
      return holding.symbol.toLowerCase();
    case SORT_KEY.quantity:
      return holding.quantity;
    case SORT_KEY.purchasePrice:
      return holding.purchasePrice;
    case SORT_KEY.currentPrice:
      return holding.currentPrice;
    case SORT_KEY.currentValue:
      return holding.currentValue;
    case SORT_KEY.profitLoss:
      return holding.profitLoss;
    case SORT_KEY.purchaseDate:
      return Date.parse(holding.purchaseDate);
    case SORT_KEY.assetType:
      return holding.assetType;
    default: {
      const exhaustiveCheck: never = key;
      return exhaustiveCheck;
    }
  }
}

function getNextSortState(current: SortState | null, key: SortKey): SortState | null {
  if (current?.key !== key) {
    return { key, direction: 'asc' };
  }

  if (current.direction === 'asc') {
    return { key, direction: 'desc' };
  }

  return null;
}

function getAriaSort(sortState: SortState | null, key: SortKey): 'ascending' | 'descending' | 'none' {
  if (sortState?.key !== key) return 'none';
  return sortState.direction === 'asc' ? 'ascending' : 'descending';
}

function getSortIndicator(sortState: SortState | null, key: SortKey): string | null {
  if (sortState?.key !== key) return null;
  return sortState.direction === 'asc' ? '▲' : '▼';
}

function sortLiveHoldings(liveHoldings: LiveHolding[], sortState: SortState | null): LiveHolding[] {
  if (!sortState) return liveHoldings;

  const sorted = [...liveHoldings].sort((a, b) => {
    const aValue = getSortValue(a, sortState.key);
    const bValue = getSortValue(b, sortState.key);

    if (aValue < bValue) return sortState.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortState.direction === 'asc' ? 1 : -1;

    return 0;
  });

  return sorted;
}

export default function HoldingsTable2({ liveHoldings, isUpdating }: HoldingsTable2Props) {
  const dispatch = useHoldingsDispatch();
  const { pushToast } = useToast();
  const [sortState, setSortState] = useState<SortState | null>(null);
  const [pendingRemove, setPendingRemove] = useState<LiveHolding | null>(null);

  const sortedLiveHoldings = useMemo(() => sortLiveHoldings(liveHoldings, sortState), [liveHoldings, sortState]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/70 shadow-xl shadow-slate-900/40">
      <div className="pointer-events-none absolute inset-0 z-10">
        <div
          className={`h-full w-full bg-gradient-to-r from-transparent via-emerald-300/35 to-transparent ${
            isUpdating ? 'animate-shimmer-strong opacity-100' : 'opacity-0'
          } transition-opacity duration-200`}
        />
      </div>
      <table className="relative z-0 w-full border-separate border-spacing-0 p-2 text-left text-sm">
        <thead className="bg-slate-950/60">
          <tr>
            {COLUMNS.map((column) => (
              <th
                key={column.key}
                aria-sort={getAriaSort(sortState, column.key)}
                className={`px-4 py-4 font-semibold ${column.align === 'right' ? 'text-right' : 'text-left'}`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setSortState((current) => getNextSortState(current, column.key));
                  }}
                  className="inline-flex items-center gap-2 rounded-full transition hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-emerald-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:outline-none"
                >
                  <span className="text-xs tracking-[0.2em] text-slate-400 uppercase">{column.label}</span>
                  {getSortIndicator(sortState, column.key) && (
                    <span aria-hidden="true" className="text-xs text-slate-500">
                      {getSortIndicator(sortState, column.key)}
                    </span>
                  )}
                </button>
              </th>
            ))}
            <th className="px-4 py-4 text-right font-semibold">Action</th>
          </tr>
        </thead>

        <tbody>
          {sortedLiveHoldings.map((holding) => (
            <tr
              key={holding.symbol}
              className="motion-safe:animate-fade-up border-t border-slate-900/60 text-slate-100 transition hover:bg-slate-900/40"
            >
              <td className="px-4 py-4 text-sm font-semibold text-slate-100">{holding.symbol}</td>
              <td className="px-4 py-4 text-sm text-slate-200">{holding.assetType}</td>
              <td className="px-4 py-4 text-right text-sm text-slate-200">{holding.quantity}</td>
              <td className="px-4 py-4 text-right text-sm text-slate-200">
                {formatCurrency(holding.purchasePrice)}
              </td>
              <td className="px-4 py-4 text-right text-sm text-slate-200">
                {formatCurrency(holding.currentPrice)}
              </td>
              <td className="px-4 py-4 text-right text-sm text-slate-200">
                {formatCurrency(holding.currentValue)}
              </td>
              <td className="px-4 py-4 text-right text-sm font-semibold text-slate-200">
                {formatCurrency(holding.profitLoss)}
              </td>
              <td className="px-4 py-4 text-right text-sm text-slate-300">{formatDate(holding.purchaseDate)}</td>
              <td className="px-4 py-4 text-right">
                <button
                  type="button"
                  onClick={() => {
                    setPendingRemove(holding);
                  }}
                  className="rounded-2xl border border-slate-800 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:border-rose-400/70 hover:text-rose-100"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmDialog
        open={Boolean(pendingRemove)}
        title="Remove holding?"
        description={
          pendingRemove ? `Remove ${pendingRemove.symbol} from your portfolio? This cannot be undone.` : undefined
        }
        confirmLabel="Remove"
        cancelLabel="Cancel"
        onConfirm={() => {
          if (!pendingRemove) return;

          dispatch(removeHolding(pendingRemove.symbol));

          pushToast({
            message: `Removed ${pendingRemove.symbol} from your portfolio.`,
            variant: 'success',
          });

          setPendingRemove(null);
        }}
        onCancel={() => {
          setPendingRemove(null);
        }}
      />
    </div>
  );
}
