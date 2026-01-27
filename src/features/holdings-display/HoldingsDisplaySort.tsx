import { SORT_OPTIONS, type SortDirection, type SortKey, type SortState } from './holdingsDisplaySorting';
import { useHoldingsDisplayContext } from './HoldingsDisplayContext';

const getNextSortState = (current: SortState | null, nextKey: SortKey | ''): SortState | null => {
  if (!nextKey) {
    return null;
  }

  return { key: nextKey, direction: current?.direction ?? 'asc' };
};

function SelectChevron({ disabled = false }: { disabled?: boolean }) {
  return (
    <span
      className={`pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 ${disabled ? 'text-slate-600' : ''}`}
      aria-hidden="true"
    >
      <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
        <path
          d="M4 6.25L8 10.25L12 6.25"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function HoldingsDisplaySort() {
  const { sortState, setSortState } = useHoldingsDisplayContext();
  const isOrderDisabled = !sortState;
  const selectedSortLabel = SORT_OPTIONS.find((option) => option.key === sortState?.key)?.label ?? 'Default';
  const selectedOrderLabel = sortState?.direction === 'desc' ? 'Descending' : 'Ascending';

  return (
    <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:w-auto lg:justify-end">
      <label className="focus-ring relative flex w-full items-center justify-between gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-300 transition sm:w-auto">
        <span className="font-semibold tracking-[0.2em] whitespace-nowrap text-slate-400 uppercase">Sort by</span>
        <span className="mr-6 w-full min-w-0 text-right text-xs font-semibold text-slate-100">
          {selectedSortLabel}
        </span>
        <select
          value={sortState?.key ?? ''}
          onChange={(event) => {
            const nextKey = event.target.value as SortKey | '';
            setSortState(getNextSortState(sortState, nextKey));
          }}
          className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0 focus:outline-none"
        >
          <option value="">Default</option>
          {SORT_OPTIONS.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
        <SelectChevron />
      </label>

      <label className="focus-ring relative flex w-full items-center justify-between gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-300 transition sm:w-auto">
        <span className="font-semibold tracking-[0.2em] whitespace-nowrap text-slate-400 uppercase">Order</span>
        <span
          className={`mr-6 w-full min-w-0 text-right text-xs font-semibold ${isOrderDisabled ? 'text-slate-500' : 'text-slate-100'}`}
        >
          {selectedOrderLabel}
        </span>
        <select
          value={sortState?.direction ?? 'asc'}
          onChange={(event) => {
            const nextDirection = event.target.value as SortDirection;
            if (sortState) {
              setSortState({ ...sortState, direction: nextDirection });
            }
          }}
          disabled={isOrderDisabled}
          className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0 focus:outline-none disabled:cursor-not-allowed"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <SelectChevron disabled={isOrderDisabled} />
      </label>
    </div>
  );
}
