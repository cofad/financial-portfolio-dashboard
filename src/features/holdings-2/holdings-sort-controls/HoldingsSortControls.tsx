import { useHoldings2Context } from '@features/holdings-2/holdings-2-provider/Holdings2Provider';
import { SORT_OPTIONS, type SortDirection, type SortKey, type SortState } from '@features/holdings-2/holdings2Sorting';

const getNextSortState = (current: SortState | null, nextKey: SortKey | ''): SortState | null => {
  if (!nextKey) {
    return null;
  }

  return { key: nextKey, direction: current?.direction ?? 'asc' };
};

export default function HoldingsSortControls() {
  const { sortState, setSortState } = useHoldings2Context();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-300">
        <span className="font-semibold tracking-[0.2em] text-slate-400 uppercase">Sort by</span>
        <select
          value={sortState?.key ?? ''}
          onChange={(event) => {
            const nextKey = event.target.value as SortKey | '';
            setSortState(getNextSortState(sortState, nextKey));
          }}
          className="bg-transparent text-xs font-semibold text-slate-100 focus:outline-none"
        >
          <option value="">Default</option>
          {SORT_OPTIONS.map((option) => (
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
            if (sortState) {
              setSortState({ ...sortState, direction: nextDirection });
            }
          }}
          disabled={!sortState}
          className="bg-transparent text-xs font-semibold text-slate-100 focus:outline-none disabled:text-slate-500"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </label>
    </div>
  );
}
