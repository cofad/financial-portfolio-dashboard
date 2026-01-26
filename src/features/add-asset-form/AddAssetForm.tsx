import SymbolAutocomplete from './SymbolAutocomplete';
import { useAddAssetForm } from '@features/add-asset-form/useAddAssetForm';

function AddAssetForm() {
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
    assetTypeDisplay,
    assetDescriptionDisplay,
    quoteIsError,
  } = useAddAssetForm();

  const totalPriceText = totalPriceDisplay || '-';

  const purchasePriceText = purchasePriceDisplay || '-';
  const showAssetMeta = Boolean(assetTypeDisplay) || Boolean(assetDescriptionDisplay);

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-xl shadow-slate-900/40"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-10">
          <div className="flex flex-col gap-4 lg:grid lg:flex-1 lg:grid-rows-2 lg:gap-6 lg:self-stretch lg:rounded-3xl lg:border lg:border-slate-800 lg:bg-slate-950/40 lg:p-5">
            <div>
              <SymbolAutocomplete value={symbolQuery} onValueChange={onSymbolChange} onSelect={onSymbolSelect} />
              {errors.symbol?.message && <p className="mt-2 text-xs text-rose-400">{errors.symbol.message}</p>}

              {showAssetMeta && (
                <div className="mt-3 flex flex-col gap-2 text-sm">
                  {assetTypeDisplay && (
                    <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
                      <span>Type</span>
                      <span className="text-slate-100">{assetTypeDisplay}</span>
                    </div>
                  )}
                  {assetDescriptionDisplay && (
                    <p className="text-xs text-slate-400">{assetDescriptionDisplay}</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex w-full flex-col gap-2 md:max-w-full lg:max-w-lg">
              <label className="text-xs font-semibold tracking-[0.2em] text-slate-300 uppercase">Quantity</label>

              <input
                type="text"
                {...register('quantity')}
                inputMode="numeric"
                placeholder="Enter quantity"
                onBeforeInput={(e) => {
                  const numericPattern = /^[0-9]*$/;

                  if (!numericPattern.test(e.data)) {
                    e.preventDefault();
                  }
                }}
                className="mt-3 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-base text-slate-100 transition outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-700 md:text-sm"
                aria-invalid={Boolean(errors.quantity?.message)}
              />

              {errors.quantity?.message && <p className="text-xs text-rose-400">{errors.quantity.message}</p>}
            </div>
          </div>

          <div className="flex w-full flex-col gap-6 lg:flex-1 lg:self-stretch lg:rounded-3xl lg:border lg:border-slate-800 lg:bg-slate-950/40 lg:p-5">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold tracking-[0.2em] text-slate-300 uppercase">
                Purchase Price
              </span>

              <div
                aria-invalid={Boolean(errors.purchasePrice?.message)}
                className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-slate-100"
              >
                {purchasePriceText}
              </div>

              {quoteIsError && <p className="text-xs text-rose-400">Unable to load price.</p>}
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold tracking-[0.2em] text-slate-300 uppercase">Total Price</span>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-slate-100">
                {totalPriceText}
              </div>
            </div>
          </div>
        </div>

        <input type="hidden" {...register('purchaseDate')} />
        <input type="hidden" {...register('assetType')} />
        <input type="hidden" {...register('purchasePrice')} />

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="mx-auto flex items-center justify-center rounded-2xl border border-slate-700 bg-transparent px-8 py-4 text-base font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-900/40 disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-500"
        >
          Add to Portfolio
        </button>
      </div>
    </form>
  );
}

export default AddAssetForm;
