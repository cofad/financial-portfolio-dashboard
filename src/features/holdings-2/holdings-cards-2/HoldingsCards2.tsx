import { useMemo, useState } from 'react';

import { useHoldings2Context } from '@features/holdings-2/holdings-2-provider/Holdings2Provider';
import ProfitOrLoss from '@features/holdings-2/profit-or-loss/ProfitOrLoss';
import { formatCurrency } from '@utils/currency';
import { formatDate } from '@utils/date';
import type { LiveHolding } from '@features/holdings-2/useHoldings2';

const SORT_KEYS = [
  { key: 'symbol', label: 'Symbol' },
  { key: 'assetType', label: 'Type' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'purchasePrice', label: 'Purchase Price' },
  { key: 'currentPrice', label: 'Current Price' },
  { key: 'currentValue', label: 'Total Value' },
  { key: 'profitLoss', label: 'P/L' },
  { key: 'purchaseDate', label: 'Purchase Date' },
] as const;

type SortKey = (typeof SORT_KEYS)[number]['key'];
type SortDirection = 'asc' | 'desc';

interface SortState {
  key: SortKey;
  direction: SortDirection;
}

const getSortValue = (holding: LiveHolding, key: SortKey): number | string => {
  switch (key) {
    case 'symbol':
      return holding.symbol.toLowerCase();
    case 'assetType':
      return holding.assetType.toLowerCase();
    case 'quantity':
      return holding.quantity;
    case 'purchasePrice':
      return holding.purchasePrice;
    case 'currentPrice':
      return holding.currentPrice;
    case 'currentValue':
      return holding.currentValue;
    case 'profitLoss':
      return holding.profitLoss;
    case 'purchaseDate':
      return Date.parse(holding.purchaseDate);
    default: {
      const exhaustiveCheck: never = key;
      return exhaustiveCheck;
    }
  }
};

const sortHoldings = (holdings: LiveHolding[], sortState: SortState | null): LiveHolding[] => {
  if (!sortState) return holdings;
  const sorted = [...holdings].sort((a, b) => {
    const aValue = getSortValue(a, sortState.key);
    const bValue = getSortValue(b, sortState.key);

    if (aValue < bValue) return sortState.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortState.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
};

export default function HoldingsCards2() {
  const { liveHoldings, requestRemove } = useHoldings2Context();
  const [sortState, setSortState] = useState<SortState | null>(null);
  const sortedHoldings = useMemo(() => sortHoldings(liveHoldings ?? [], sortState), [liveHoldings, sortState]);

  if (!sortedHoldings.length) {
    return null;
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Sort holdings</p>
          <p className="text-sm text-slate-200">Choose how the cards are ordered.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-300">
            <span className="font-semibold tracking-[0.2em] text-slate-400 uppercase">Sort by</span>
            <select
              value={sortState?.key ?? ''}
              onChange={(event) => {
                const nextKey = event.target.value as SortKey | '';
                setSortState(nextKey ? { key: nextKey, direction: sortState?.direction ?? 'asc' } : null);
              }}
              className="bg-transparent text-xs font-semibold text-slate-100 focus:outline-none"
            >
              <option value="">Default</option>
              {SORT_KEYS.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-300">
            <span className="font-semibold tracking-[0.2em] text-slate-400 uppercase">Order</span>
            <select
              value={sortState?.direction ?? 'asc'}
              onChange={(event) => {
                const nextDirection = event.target.value as SortDirection;
                setSortState((current) => (current ? { ...current, direction: nextDirection } : null));
              }}
              disabled={!sortState}
              className="bg-transparent text-xs font-semibold text-slate-100 focus:outline-none disabled:text-slate-500"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
        </div>
      </div>

      {sortedHoldings.map((holding) => (
        <div
          key={holding.symbol}
          className="motion-safe:animate-fade-up rounded-3xl border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-slate-900/40 transition hover:-translate-y-0.5 hover:border-slate-700"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Symbol</p>
              <p className="text-lg font-semibold text-slate-100">{holding.symbol}</p>
            </div>

            <button
              type="button"
              onClick={() => {
                requestRemove(holding);
              }}
              className="rounded-2xl border border-slate-800 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:border-rose-400/70 hover:text-rose-100"
            >
              Remove
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Quantity</p>
              <p className="text-slate-200">{holding.quantity}</p>
            </div>

            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Type</p>
              <p className="text-slate-200">{holding.assetType}</p>
            </div>

            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Purchase Price</p>
              <p className="text-slate-200">{formatCurrency(holding.purchasePrice)}</p>
            </div>

            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Current Price</p>
              <p className="text-slate-200">{formatCurrency(holding.currentPrice)}</p>
            </div>

            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Total Value</p>
              <p className="text-slate-200">{formatCurrency(holding.currentValue)}</p>
            </div>

            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">P/L</p>
              <ProfitOrLoss value={holding.profitLoss} />
            </div>

            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Purchase Date</p>
              <p className="text-slate-300">{formatDate(holding.purchaseDate)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
