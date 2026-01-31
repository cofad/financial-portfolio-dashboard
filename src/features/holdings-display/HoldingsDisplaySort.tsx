import Select from '@components/select/Select';
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
  const isOrderDisabled = !sortState;
  const selectedSortLabel = SORT_OPTIONS.find((option) => option.key === sortState?.key)?.label ?? 'Default';
  const selectedOrderLabel = sortState?.direction === 'desc' ? 'Descending' : 'Ascending';
  const sortOptions = SORT_OPTIONS;
  const orderOptions = [
    { label: 'Ascending', key: 'asc' },
    { label: 'Descending', key: 'desc' },
  ];

  return (
    <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:w-auto lg:justify-end">
      <Select
        label="Sort by"
        displayValue={selectedSortLabel}
        value={sortState?.key ?? ''}
        options={[...sortOptions]}
        defaultOption={{ key: '', label: 'Default' }}
        onChange={(event) => {
          const nextKey = event.target.value as SortKey | '';
          setSortState(getNextSortState(sortState, nextKey));
        }}
      />

      <Select
        label="Order"
        displayValue={selectedOrderLabel}
        value={sortState?.direction ?? 'asc'}
        options={orderOptions}
        onChange={(event) => {
          const nextDirection = event.target.value as SortDirection;
          if (sortState) {
            setSortState({ ...sortState, direction: nextDirection });
          }
        }}
        disabled={isOrderDisabled}
        containerClassName="h-11 lg:h-auto"
      />
    </div>
  );
}
