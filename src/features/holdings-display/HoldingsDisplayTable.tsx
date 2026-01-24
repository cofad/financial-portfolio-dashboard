import { useMemo } from 'react';

import { useHoldingsDisplayContext } from '@/features/holdings-display/HoldingsDisplayProvider';
import ProfitOrLoss from '@/components/profit-or-loss/ProfitOrLoss';
import { sortHoldings } from '@/features/holdings-display/holdingsDisplaySort';
import { formatCurrency } from '@utils/currency';
import { format } from 'date-fns';

const COLUMNS = [
  { label: 'Symbol', align: 'left' },
  { label: 'Type', align: 'left' },
  { label: 'Qty.', align: 'right' },
  { label: 'Purchase Price', align: 'right' },
  { label: 'Current Price', align: 'right' },
  { label: 'Total Value', align: 'right' },
  { label: 'P/L', align: 'right' },
  { label: 'Purchase Date', align: 'right' },
] as const satisfies { label: string; align?: 'left' | 'right' }[];

export default function HoldingsDisplayTable() {
  const { liveHoldings, requestRemove, sortState } = useHoldingsDisplayContext();

  const sortedLiveHoldings = useMemo(() => sortHoldings(liveHoldings ?? [], sortState), [liveHoldings, sortState]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/70 shadow-xl shadow-slate-900/40">
      <table className="relative z-0 w-full border-separate border-spacing-0 p-2 text-left text-sm">
        <thead className="bg-slate-950/60">
          <tr>
            {COLUMNS.map((column) => (
              <th
                key={column.label}
                className={`px-4 py-4 font-semibold ${column.align === 'right' ? 'text-right' : 'text-left'}`}
              >
                <span className="text-xs tracking-[0.2em] text-slate-400 uppercase">{column.label}</span>
              </th>
            ))}
            <th className="px-4 py-4 text-center font-semibold">Action</th>
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
              <td className="px-4 py-4 text-right text-sm font-semibold">
                <ProfitOrLoss value={holding.profitLoss} />
              </td>
              <td className="px-4 py-4 text-right text-sm text-slate-300">
                {format(holding.purchaseDate, 'MMM dd')}
              </td>
              <td className="px-4 py-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    requestRemove(holding);
                  }}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-800 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:border-rose-400/70 hover:text-rose-100"
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
}
