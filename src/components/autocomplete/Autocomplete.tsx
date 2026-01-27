import { useEffect, useMemo, useRef, useState, type FocusEvent, type ReactNode, type Ref } from 'react';

interface AutocompleteProps<Item> {
  ref?: Ref<HTMLInputElement | null>;
  label: string;
  placeholder?: string;
  query: string;
  onQueryChange: (value: string) => void;
  onInputFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  items: Item[];
  isLoading: boolean;
  isError: boolean;
  getItemLabel: (item: Item) => string;
  getItemKey: (item: Item, index: number) => string;
  onSelect?: (item: Item) => void;
  renderItem?: (item: Item) => ReactNode;
  emptyText?: string;
  errorText?: string;
  loadingText?: string;
}

function Autocomplete<Item>({
  label,
  placeholder,
  query,
  onQueryChange,
  onInputFocus,
  ref,
  items,
  isLoading,
  isError,
  getItemLabel,
  getItemKey,
  onSelect,
  renderItem,
  emptyText = 'No matches found.',
  errorText = 'Unable to load results. Try again.',
  loadingText = 'Searching...',
}: AutocompleteProps<Item>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const listRef = useRef<HTMLUListElement | null>(null);
  const showDropdown = isOpen && query.trim().length > 0;

  const effectiveActiveIndex = items.length > 0 && activeIndex < 0 ? 0 : activeIndex;

  useEffect(() => {
    if (!showDropdown || effectiveActiveIndex < 0) {
      return;
    }

    const listElement = listRef.current;
    const optionElement = optionRefs.current[effectiveActiveIndex];

    if (!listElement || !optionElement) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      const listRect = listElement.getBoundingClientRect();
      const offsetTop = optionElement.offsetTop;
      const optionBottom = offsetTop + optionElement.offsetHeight;
      const viewTop = listElement.scrollTop;
      const viewBottom = viewTop + listRect.height;

      if (offsetTop < viewTop) {
        listElement.scrollTo({ top: offsetTop });
        return;
      }

      if (optionBottom > viewBottom) {
        listElement.scrollTo({
          top: optionBottom - listRect.height,
        });
      }
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [effectiveActiveIndex, showDropdown]);

  const handleSelect = (item: Item) => {
    const nextValue = getItemLabel(item);
    onQueryChange(nextValue);
    setIsOpen(false);
    setActiveIndex(-1);
    onSelect?.(item);
  };

  const activeId =
    showDropdown && effectiveActiveIndex >= 0
      ? `autocomplete-option-${effectiveActiveIndex.toString()}`
      : undefined;

  const renderedItems = useMemo(
    () => items.map((item) => renderItem?.(item) ?? getItemLabel(item)),
    [getItemLabel, items, renderItem],
  );

  return (
    <div className="w-full lg:max-w-lg">
      <label className="text-xs font-semibold tracking-[0.2em] uppercase">{label}</label>
      <div className="relative mt-3">
        <input
          ref={ref}
          value={query}
          onChange={(event) => {
            onQueryChange(event.target.value);
          }}
          onFocus={(event) => {
            setIsOpen(true);
            onInputFocus?.(event);
          }}
          onBlur={() => {
            setIsOpen(false);
          }}
          onKeyDown={(event) => {
            if (!showDropdown) {
              return;
            }

            if (event.key === 'ArrowDown') {
              event.preventDefault();
              setActiveIndex((current) => {
                const baseIndex = current < 0 ? 0 : current;
                return items.length === 0 ? -1 : (baseIndex + 1) % items.length;
              });
            }

            if (event.key === 'ArrowUp') {
              event.preventDefault();
              setActiveIndex((current) => {
                const baseIndex = current < 0 ? 0 : current;
                return items.length === 0 ? -1 : (baseIndex - 1 + items.length) % items.length;
              });
            }

            if (event.key === 'Enter') {
              event.preventDefault();
              const nextItem = items[effectiveActiveIndex];
              if (nextItem) {
                handleSelect(nextItem);
              }
            }

            if (event.key === 'Escape') {
              setIsOpen(false);
              setActiveIndex(-1);
            }
          }}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="autocomplete-results"
          aria-activedescendant={activeId}
          className="w-full rounded-2xl border border-slate-800 px-4 py-3 text-base text-slate-100 shadow-[0_0_0_1px_rgba(30,41,59,0.2)] transition sm:text-sm"
        />
        {showDropdown && (
          <div className="absolute right-0 left-0 z-10 mt-3 rounded-2xl border border-slate-800 bg-slate-950/95 p-2 shadow-xl shadow-slate-900/40 backdrop-blur">
            {isLoading && (
              <div className="px-3 py-2 text-xs tracking-[0.2em] text-slate-500 uppercase">{loadingText}</div>
            )}
            {isError && <div className="px-3 py-2 text-sm text-rose-400">{errorText}</div>}
            {!isLoading && !isError && items.length === 0 && (
              <div className="px-3 py-2 text-sm text-slate-400">{emptyText}</div>
            )}
            <ul
              id="autocomplete-results"
              role="listbox"
              ref={listRef}
              className="max-h-64 space-y-1 overflow-y-auto pr-1"
            >
              {items.map((item, index) => (
                <li key={getItemKey(item, index)} id={`autocomplete-option-${index.toString()}`}>
                  <button
                    type="button"
                    role="option"
                    aria-label={getItemLabel(item) || 'Result'}
                    aria-selected={index === effectiveActiveIndex}
                    ref={(element) => {
                      optionRefs.current[index] = element;
                    }}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      handleSelect(item);
                    }}
                    className={`w-full rounded-xl px-3 py-2 text-left transition ${
                      index === effectiveActiveIndex ? 'bg-slate-900' : 'hover:bg-slate-900'
                    }`}
                  >
                    {renderedItems[index]}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Autocomplete;
