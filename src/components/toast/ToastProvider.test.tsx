import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ToastProvider } from './ToastProvider';

describe('ToastProvider', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <ToastProvider>
        <div>Children</div>
      </ToastProvider>,
    );

    expect(container).toMatchSnapshot();
  });
});
