import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { subSeconds } from 'date-fns';

import LastUpdated from './LastUpdated';

const baseTime = new Date('2025-01-01T00:00:00.000Z');

describe('LastUpdated', function () {
  beforeEach(function () {
    vi.useFakeTimers();
    vi.setSystemTime(baseTime);
  });

  afterEach(function () {
    vi.useRealTimers();
  });

  it('matches snapshot', function () {
    const baseTimeMinus10Seconds = subSeconds(baseTime, 10);

    const { container } = render(<LastUpdated lastUpdatedAt={baseTimeMinus10Seconds} />);

    expect(container).toMatchSnapshot();
  });
});
