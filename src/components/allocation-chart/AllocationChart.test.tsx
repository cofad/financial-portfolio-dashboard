import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Allocations } from '@hooks/useSummary';

import AllocationChart from './AllocationChart';

const allocations: Allocations = {
  total: 4,
  groups: [
    { assetType: 'Stock', count: 2, percentage: 50 },
    { assetType: 'ETF', count: 1, percentage: 25 },
    { assetType: 'Crypto', count: 1, percentage: 25 },
  ],
};

describe('AllocationChart', function () {
  it('matches snapshot', function () {
    const { container } = render(<AllocationChart allocations={allocations} className="test-class" />);

    expect(container).toMatchSnapshot();
  });
});
