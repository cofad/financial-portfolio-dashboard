import { createContext, type ReactNode, use } from 'react';

import { useHoldings2, type UseHoldings2 } from '@features/holdings-2/useHoldings2';

const Holdings2Context = createContext<UseHoldings2 | null>(null);

interface Holdings2ProviderProps {
  children: ReactNode;
}

export function Holdings2Provider({ children }: Holdings2ProviderProps) {
  const value = useHoldings2();

  return <Holdings2Context value={value}>{children}</Holdings2Context>;
}

export function useHoldings2Context(): UseHoldings2 {
  const context = use(Holdings2Context);

  if (!context) {
    throw new Error('useHoldings2Context must be used within Holdings2Provider');
  }

  return context;
}
