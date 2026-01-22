import { useHoldings2Context } from '@features/holdings-2/holdings-2-provider/Holdings2Provider';
import ProfitOrLoss from '@features/holdings-2/profit-or-loss/ProfitOrLoss';
import { formatCurrency } from '@utils/currency';
import { formatDate } from '@utils/date';

export default function HoldingsCards2() {
  const { liveHoldings, requestRemove } = useHoldings2Context();

  if (!liveHoldings?.length) {
    return null;
  }

  return (
    <div className="grid gap-4">
      {liveHoldings.map((holding) => (
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
