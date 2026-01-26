import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';

import { buildQuotesQueryKey } from '@hooks/useLiveHoldings/quotes-query';
import type { Quote } from '@services/mock-api/mock-api';
import { store } from '@store/holdings/store';

import App from './App';

function AppTestProviders({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Number.POSITIVE_INFINITY,
      },
    },
  });

  queryClient.setQueryData<Quote[]>(buildQuotesQueryKey([]), []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
}

describe('App', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <AppTestProviders>
        <App />
      </AppTestProviders>,
    );
    expect(container).toMatchSnapshot();
  });
});
