import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '@store/holdings/store.ts';
import { ToastProvider } from '@components/toast/ToastProvider.tsx';
import './index.css';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 60_000,
    },
  },
});

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <App />
          </ToastProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
);
