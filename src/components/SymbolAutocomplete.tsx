import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { symbolLookup } from '@/services/finnhub/finnhub';
import type { SymbolLookupResult } from '@/services/finnhub/finnhub';
import useDebounce from '@/hooks/useDebounce';
import Autocomplete from './Autocomplete';

const DEBOUNCE_MS = 350;

interface SymbolAutocompleteProps {
  onSelect?: (result: SymbolLookupResult) => void;
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

const getResultLabel = (result: SymbolLookupResult): string => result.displaySymbol ?? result.symbol ?? '';

const getResultKey = (result: SymbolLookupResult, index: number): string =>
  `${getResultLabel(result)}-${result.description ?? 'result'}-${index.toString()}`;

const SymbolAutocomplete = ({
  onSelect,
  placeholder = 'Search symbols like AAPL or TSLA',
  value,
  onValueChange,
}: SymbolAutocompleteProps) => {
  const [internalQuery, setInternalQuery] = useState<string>('');
  const query = value ?? internalQuery;
  const handleQueryChange = onValueChange ?? setInternalQuery;
  const debouncedQuery = useDebounce<string>(query, DEBOUNCE_MS);

  const { data, isFetching, isError } = useQuery({
    queryKey: ['symbolLookup', debouncedQuery],
    queryFn: () => symbolLookup(debouncedQuery),
    enabled: debouncedQuery.trim().length > 0,
    staleTime: 30_000,
  });

  const results = useMemo<SymbolLookupResult[]>(() => data?.result ?? [], [data?.result]);

  return (
    <Autocomplete
      label="Symbol lookup"
      placeholder={placeholder}
      query={query}
      onQueryChange={handleQueryChange}
      items={results}
      isLoading={isFetching}
      isError={isError}
      getItemLabel={getResultLabel}
      getItemKey={getResultKey}
      onSelect={onSelect}
      emptyText="No matches found."
      errorText="Unable to load symbols. Try again."
      loadingText="Searching..."
      renderItem={(result) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-slate-100">{getResultLabel(result) || 'Unknown'}</span>
            <span className="text-[10px] tracking-[0.2em] text-slate-500 uppercase">
              {result.type ?? 'Unknown'}
            </span>
          </div>
          {result.description && <p className="text-xs text-slate-400">{result.description}</p>}
        </div>
      )}
    />
  );
};

export default SymbolAutocomplete;
