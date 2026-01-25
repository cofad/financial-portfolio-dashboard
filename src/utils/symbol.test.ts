import { describe, expect, it } from 'vitest';

import { normalizeSymbol } from './symbol';

describe('normalizeSymbol', () => {
  it('trims whitespace and upper cases the symbol', () => {
    expect(normalizeSymbol('  aapl ')).toBe('AAPL');
  });

  it('keeps existing uppercase symbols unchanged', () => {
    expect(normalizeSymbol('TSLA')).toBe('TSLA');
  });
});
