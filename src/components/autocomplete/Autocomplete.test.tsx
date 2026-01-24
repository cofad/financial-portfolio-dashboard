import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Autocomplete from './Autocomplete';

interface Item {
  id: string;
  label: string;
}

const defaultItems: Item[] = [
  { id: 'stock', label: 'Stock' },
  { id: 'etf', label: 'ETF' },
  { id: 'crypto', label: 'Crypto' },
];

interface HarnessProps {
  items?: Item[];
  isLoading?: boolean;
  isError?: boolean;
  onSelect?: (item: Item) => void;
}

function AutocompleteHarness({
  items = defaultItems,
  isLoading = false,
  isError = false,
  onSelect,
}: HarnessProps) {
  const [query, setQuery] = useState('');

  return (
    <Autocomplete<Item>
      label="Asset type"
      placeholder="Search"
      query={query}
      onQueryChange={setQuery}
      items={items}
      isLoading={isLoading}
      isError={isError}
      getItemLabel={(item) => item.label}
      getItemKey={(item) => item.id}
      onSelect={onSelect}
    />
  );
}

describe('Autocomplete', function () {
  afterEach(function () {
    cleanup();
  });

  it('renders results when the user types a query', async function () {
    const user = userEvent.setup();
    render(<AutocompleteHarness />);

    const input = screen.getByRole('combobox');

    await user.type(input, 's');

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(defaultItems.length);
  });

  it('selects an item with the keyboard', async function () {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    render(<AutocompleteHarness onSelect={handleSelect} />);

    const input = screen.getByRole('combobox');

    await user.type(input, 'e');
    await user.keyboard('{Enter}');

    expect(handleSelect).toHaveBeenCalledWith(defaultItems[0]);
    expect(input).toHaveValue(defaultItems[0].label);
  });

  it('shows the empty state when there are no matches', async function () {
    const user = userEvent.setup();
    render(<AutocompleteHarness items={[]} />);

    const input = screen.getByRole('combobox');

    await user.type(input, 'x');

    expect(screen.getByText('No matches found.')).toBeInTheDocument();
  });
});
