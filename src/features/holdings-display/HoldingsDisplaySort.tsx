import { SORT_OPTIONS, type SortDirection, type SortKey, type SortState } from './holdingsDisplaySorting';
import { useHoldingsDisplayContext } from './HoldingsDisplayContext';

const getNextSortState = (current: SortState | null, nextKey: SortKey | ''): SortState | null => {
  if (!nextKey) {
    return null;
  }

  return { key: nextKey, direction: current?.direction ?? 'asc' };
};

export default function HoldingsDisplaySort() {
  const { sortState, setSortState } = useHoldingsDisplayContext();

  return (
    <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:w-auto lg:justify-end">
      <label className="flex w-full items-center justify-between gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-300 transition focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-teal-100 sm:w-auto">
        <span className="whitespace-nowrap font-semibold tracking-[0.2em] text-slate-400 uppercase">Sort by</span>
        <select
          value={sortState?.key ?? ''}
          onChange={(event) => {
            const nextKey = event.target.value as SortKey | '';
            setSortState(getNextSortState(sortState, nextKey));
          }}
          className="w-full min-w-0 bg-transparent text-right text-xs font-semibold text-slate-100 focus:outline-none"
        >
          <option value="">Default</option>
          {SORT_OPTIONS.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex w-full items-center justify-between gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-300 transition focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-teal-100 sm:w-auto">
        <span className="whitespace-nowrap font-semibold tracking-[0.2em] text-slate-400 uppercase">Order</span>
        <select
          value={sortState?.direction ?? 'asc'}
          onChange={(event) => {
            const nextDirection = event.target.value as SortDirection;
            if (sortState) {
              setSortState({ ...sortState, direction: nextDirection });
            }
          }}
          disabled={!sortState}
          className="w-full min-w-0 bg-transparent text-right text-xs font-semibold text-slate-100 focus:outline-none disabled:text-slate-500"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </label>
    </div>
  );
}
