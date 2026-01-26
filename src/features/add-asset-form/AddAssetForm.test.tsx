import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import FeatureTestProviders from '@/test-utils/FeatureTestProviders';
import AddAssetForm from './AddAssetForm';

describe('AddAssetForm', () => {
  beforeEach(function () {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-02T12:00:00Z'));
  });

  afterEach(function () {
    vi.useRealTimers();
  });

  it('matches snapshot', () => {
    const { container } = render(
      <FeatureTestProviders>
        <AddAssetForm />
      </FeatureTestProviders>,
    );

    expect(container).toMatchSnapshot();
  });
});
