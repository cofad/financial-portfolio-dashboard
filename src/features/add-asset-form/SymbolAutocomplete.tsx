import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import useDebounce from '@hooks/useDebounce';
import Autocomplete from '@components/autocomplete/Autocomplete';
import { fetchSearchResults, type SearchResult } from '@services/mock-api/mock-api';
import { isMobile } from '@utils/screens';

interface SymbolAutocompleteProps {
  onSelect: (result: SearchResult) => void;
  value: string;
  onValueChange: (value: string) => void;
}

const getResultLabel = (result: SearchResult): string => result.name;

const getResultKey = (result: SearchResult, index: number): string =>
  `${getResultLabel(result)}-${result.description}-${index.toString()}`;

const SymbolAutocomplete = ({ onSelect, value, onValueChange }: SymbolAutocompleteProps) => {
  const debouncedQuery = useDebounce(value, 350);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    data: searchResults,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ['fetchSearchResults', debouncedQuery],
    queryFn: () => fetchSearchResults(debouncedQuery),
    enabled: debouncedQuery.trim().length > 0,
  });

  function scrollInputToTop() {
    const inputElement = inputRef.current;
    if (!inputElement) return;

    const inputRect = inputElement.getBoundingClientRect();
    const targetTop = Math.max(0, window.scrollY + inputRect.top - 10);
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  }

  function handleInputFocus() {
    if (!isMobile()) return;
    scrollInputToTop();
  }

  return (
    <Autocomplete
      ref={inputRef}
      label="Symbol"
      placeholder="Search symbols like AAPL or TSLA"
      query={value}
      onQueryChange={onValueChange}
      onInputFocus={handleInputFocus}
      items={searchResults ?? []}
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

            <span className="text-[10px] tracking-[0.2em] text-slate-500 uppercase">{result.type}</span>
          </div>

          {result.description && <p className="text-xs text-slate-400">{result.description}</p>}
        </div>
      )}
    />
  );
};

export default SymbolAutocomplete;
