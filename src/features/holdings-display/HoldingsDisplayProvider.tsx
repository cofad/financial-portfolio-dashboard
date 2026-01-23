import { createContext, type ReactNode, use } from 'react';
import { useHoldingsDisplay, type UseHoldingsDisplay } from './useHoldingsDisplay';

const HoldingsDisplayContext = createContext<UseHoldingsDisplay | null>(null);

interface Holdings2ProviderProps {
  children: ReactNode;
}

export function HoldingsDisplayProvider({ children }: Holdings2ProviderProps) {
  const value = useHoldingsDisplay();

  return <HoldingsDisplayContext value={value}>{children}</HoldingsDisplayContext>;
}

export function useHoldingsDisplayContext(): UseHoldingsDisplay {
  const context = use(HoldingsDisplayContext);

  if (!context) {
    throw new Error('useHoldings2Context must be used within Holdings2Provider');
  }

  return context;
}
