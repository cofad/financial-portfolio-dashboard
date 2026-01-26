import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import LoadingState from './LoadingState';

describe('LoadingState', () => {
  it('renders the spinner label', () => {
    render(<LoadingState label="Loading data" />);

    expect(screen.getByText('Loading data')).toBeTruthy();
    expect(screen.getByRole('status')).toBeTruthy();
  });
});
