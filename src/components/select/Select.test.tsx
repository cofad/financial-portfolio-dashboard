import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Select from './Select';

const options = [
  { key: 'symbol', label: 'Symbol' },
  { key: 'quantity', label: 'Quantity' },
];

describe('Select', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <Select
        label="Sort by"
        displayValue="Symbol"
        value="symbol"
        defaultOption={{ key: '', label: 'Default' }}
        options={options}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('disables the select input', () => {
    render(
      <Select
        label="Order"
        displayValue="Ascending"
        value="asc"
        options={[
          { key: 'asc', label: 'Ascending' },
          { key: 'desc', label: 'Descending' },
        ]}
        disabled
      />,
    );

    const select = screen.getByRole('combobox', { name: /order/i });

    if (!(select instanceof HTMLSelectElement)) {
      throw new Error('Expected select, but received other element type');
    }

    expect(select.disabled).toBe(true);
  });
});
