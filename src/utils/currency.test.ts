import { describe, expect, it } from 'vitest';

import { formatCurrency } from './currency';

describe('formatCurrency', () => {
  it('formats numbers as USD currency with two decimals', () => {
    expect(formatCurrency(1234.5)).toBe('$1,234.50');
  });

  it('formats negative values with a leading minus sign', () => {
    expect(formatCurrency(-42)).toBe('-$42.00');
  });
});
