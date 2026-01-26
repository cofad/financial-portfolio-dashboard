import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import EmptyState from './EmptyState';

describe('EmptyState', function () {
  it('matches snapshot', function () {
    const { container } = render(<EmptyState message="No holdings yet." className="text-left" />);

    expect(container).toMatchSnapshot();
  });
});
