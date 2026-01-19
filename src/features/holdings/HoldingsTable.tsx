import type { HoldingRow, SortKey, SortRule, SortToggleHandler } from './portfolioTypes';

const columns: { key: SortKey; label: string; align?: 'left' | 'right' }[] = [
  { key: 'symbol', label: 'Symbol', align: 'left' },
  { key: 'quantity', label: 'Quantity', align: 'right' },
  { key: 'purchasePrice', label: 'Purchase Price', align: 'right' },
  { key: 'currentPrice', label: 'Current Price', align: 'right' },
  { key: 'totalValue', label: 'Total Value', align: 'right' },
  { key: 'profitLoss', label: 'P/L', align: 'right' },
  { key: 'purchaseDate', label: 'Purchase Date', align: 'right' },
];

const getSortMeta = (sortRules: SortRule[], key: SortKey) => {
  const index = sortRules.findIndex((rule) => rule.key === key);
  if (index < 0) {
    return null;
  }
  return { index, direction: sortRules[index].direction };
};

const formatSortBadge = (sortRules: SortRule[], key: SortKey) => {
  const meta = getSortMeta(sortRules, key);
  if (!meta) {
    return null;
  }
  const arrow = meta.direction === 'asc' ? '↑' : '↓';
  return (
    <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-slate-700 px-2 py-0.5 text-[10px] font-semibold text-slate-200">
      <span>{meta.index + 1}</span>
      <span>{arrow}</span>
    </span>
  );
};

interface HoldingsTableProps {
  rows: HoldingRow[];
  sortRules: SortRule[];
  onSortToggle: SortToggleHandler;
  onRemove: (row: HoldingRow) => void;
  formatCurrency: (value: number | null) => string;
  formatQuantity: (value: number) => string;
  formatDate: (value: string) => string;
  getProfitLossTone: (value: number | null) => string;
  getCurrentPriceText: (row: HoldingRow) => string;
}

const HoldingsTable = ({
  rows,
  sortRules,
  onSortToggle,
  onRemove,
  formatCurrency,
  formatQuantity,
  formatDate,
  getProfitLossTone,
  getCurrentPriceText,
}: HoldingsTableProps) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/70 shadow-xl shadow-slate-900/40">
      <table className="w-full border-separate border-spacing-0 text-left text-sm">
        <thead className="bg-slate-950/60 text-xs tracking-[0.2em] text-slate-400 uppercase">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-4 font-semibold ${column.align === 'right' ? 'text-right' : 'text-left'}`}
              >
                <button
                  type="button"
                  onClick={() => {
                    onSortToggle(column.key);
                  }}
                  className="inline-flex items-center transition hover:text-slate-200"
                  title="Click to sort."
                >
                  {column.label}
                  {formatSortBadge(sortRules, column.key)}
                </button>
              </th>
            ))}
            <th className="px-4 py-4 text-right font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.symbol}
              className="motion-safe:animate-fade-up border-t border-slate-900/60 text-slate-100 transition hover:bg-slate-900/40"
            >
              <td className="px-4 py-4 text-sm font-semibold text-slate-100">{row.symbol}</td>
              <td className="px-4 py-4 text-right text-sm text-slate-200">{formatQuantity(row.quantity)}</td>
              <td className="px-4 py-4 text-right text-sm text-slate-200">{formatCurrency(row.purchasePrice)}</td>
              <td className="px-4 py-4 text-right text-sm text-slate-200">
                <span className="inline-flex items-center justify-end gap-2">
                  {getCurrentPriceText(row)}
                  {row.isRecentlyUpdated ? (
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
                    </span>
                  ) : null}
                </span>
              </td>
              <td className="px-4 py-4 text-right text-sm text-slate-200">{formatCurrency(row.totalValue)}</td>
              <td className={`px-4 py-4 text-right text-sm font-semibold ${getProfitLossTone(row.profitLoss)}`}>
                {formatCurrency(row.profitLoss)}
              </td>
              <td className="px-4 py-4 text-right text-sm text-slate-300">{formatDate(row.purchaseDate)}</td>
              <td className="px-4 py-4 text-right">
                <button
                  type="button"
                  onClick={() => {
                    onRemove(row);
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
    </div>
  );
};

export default HoldingsTable;
