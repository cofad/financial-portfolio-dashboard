import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';

import { ToastProvider } from '@components/toast/ToastProvider';
import type { Quote } from '@services/mock-api/mock-api';
import { store } from '@store/holdings/store';

const emptyQuotesKey = ['quotes', ''] as const;

function createTestQueryClient(): QueryClient {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Number.POSITIVE_INFINITY,
      },
    },
  });

  queryClient.setQueryData<Quote[]>(emptyQuotesKey, []);

  return queryClient;
}

export default function FeatureTestProviders({ children }: { children: ReactNode }) {
  const queryClient = createTestQueryClient();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>{children}</ToastProvider>
      </QueryClientProvider>
    </Provider>
  );
}
