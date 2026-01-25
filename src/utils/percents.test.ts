import { describe, expect, it } from 'vitest';

import { formatPercent } from './percents';

describe('formatPercent', () => {
  it('formats with the default precision', () => {
    expect(formatPercent(12.3456)).toBe('12.35%');
  });

  it('formats with a custom precision', () => {
    expect(formatPercent(12.3456, 0)).toBe('12%');
  });
});
