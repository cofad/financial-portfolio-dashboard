import type { HoldingRow } from './portfolioTypes';

interface HoldingsCardsProps {
  rows: HoldingRow[];
  onRemove: (row: HoldingRow) => void;
  formatCurrency: (value: number | null) => string;
  formatQuantity: (value: number) => string;
  formatDate: (value: string) => string;
  getProfitLossTone: (value: number | null) => string;
  getCurrentPriceText: (row: HoldingRow) => string;
}

const HoldingsCards = ({
  rows,
  onRemove,
  formatCurrency,
  formatQuantity,
  formatDate,
  getProfitLossTone,
  getCurrentPriceText,
}: HoldingsCardsProps) => {
  return (
    <div className="grid gap-4">
      {rows.map((row) => (
        <div
          key={row.symbol}
          className="motion-safe:animate-fade-up rounded-3xl border border-slate-800 bg-slate-950/70 p-5 shadow-xl shadow-slate-900/40 transition hover:-translate-y-0.5 hover:border-slate-700"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Symbol</p>
              <p className="text-lg font-semibold text-slate-100">{row.symbol}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                onRemove(row);
              }}
              className="rounded-2xl border border-slate-800 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:border-rose-400/70 hover:text-rose-100"
            >
              Remove
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Quantity</p>
              <p className="text-slate-200">{formatQuantity(row.quantity)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Purchase Price</p>
              <p className="text-slate-200">{formatCurrency(row.purchasePrice)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Current Price</p>
              <p className="flex items-center gap-2 text-slate-200">
                {getCurrentPriceText(row)}
                {row.isRecentlyUpdated && (
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
                  </span>
                )}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Total Value</p>
              <p className="text-slate-200">{formatCurrency(row.totalValue)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">P/L</p>
              <p className={`font-semibold ${getProfitLossTone(row.profitLoss)}`}>
                {formatCurrency(row.profitLoss)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Purchase Date</p>
              <p className="text-slate-300">{formatDate(row.purchaseDate)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HoldingsCards;
