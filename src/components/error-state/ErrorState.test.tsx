import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Provider } from 'react-redux';

import { store } from '@store/holdings/store';

import ErrorState from './ErrorState';

vi.mock('@store/holdings/store', async () => {
  const actual = await vi.importActual<typeof import('@store/holdings/store')>('@store/holdings/store');

  return {
    ...actual,
    persistor: {
      purge: vi.fn(),
    },
  };
});

describe('ErrorState', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <Provider store={store}>
        <ErrorState className="bg-slate-950/40 text-slate-400" message="Failed to load holdings." />
      </Provider>,
    );

    expect(container).toMatchSnapshot();
  });
});
