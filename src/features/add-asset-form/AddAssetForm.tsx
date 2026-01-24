import SymbolAutocomplete from './SymbolAutocomplete';
import { useAddAssetForm } from '@/features/add-asset-form/useAddAssetForm';

const AddAssetForm = () => {
  const {
    register,
    onSubmit,
    errors,
    isValid,
    isSubmitting,
    symbolQuery,
    onSymbolChange,
    onSymbolSelect,
    purchasePriceDisplay,
    totalPriceDisplay,
    quoteIsFetching,
    quoteIsError,
  } = useAddAssetForm();

  const hasSymbol = symbolQuery.trim().length > 0;
  const totalPriceText = hasSymbol ? totalPriceDisplay || 'Enter quantity' : '-';

  const purchasePriceText = hasSymbol
    ? purchasePriceDisplay || (quoteIsFetching ? 'Fetching price...' : 'Unavailable')
    : '-';

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-slate-900/40"
    >
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 md:grid-cols-[3fr_1fr]">
          <div>
            <SymbolAutocomplete value={symbolQuery} onValueChange={onSymbolChange} onSelect={onSymbolSelect} />
            {errors.symbol?.message && <p className="mt-2 text-xs text-rose-400">{errors.symbol.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold tracking-[0.2em] text-slate-300 uppercase">Quantity</label>

            <input
              type="number"
              step="any"
              min="0"
              {...register('quantity')}
              className="mt-3 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 transition outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-700"
              aria-invalid={Boolean(errors.quantity?.message)}
            />

            {errors.quantity?.message && <p className="text-xs text-rose-400">{errors.quantity.message}</p>}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold tracking-[0.2em] text-slate-300 uppercase">Purchase Price</span>

          <div
            aria-invalid={Boolean(errors.purchasePrice?.message)}
            className="text-sm font-semibold text-slate-100"
          >
            {purchasePriceText}
          </div>

          {quoteIsError && <p className="text-xs text-rose-400">Unable to load price.</p>}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold tracking-[0.2em] text-slate-300 uppercase">Total Price</span>
          <div className="text-sm font-semibold text-slate-100">{totalPriceText}</div>
        </div>

        <input type="hidden" {...register('purchaseDate')} />
        <input type="hidden" {...register('assetType')} />
        <input type="hidden" {...register('purchasePrice')} />

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-950 disabled:text-slate-500"
        >
          Add to Portfolio
        </button>
      </div>
    </form>
  );
};

export default AddAssetForm;
