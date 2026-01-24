import { createContext, use } from 'react';
import { , type UseHoldingsDisplay } from './useHoldingsDisplay';


export const HoldingsDisplayContext = createContext<UseHoldingsDisplay | null>(null);

export function useHoldingsDisplayContext(): UseHoldingsDisplay {
  const context = use(HoldingsDisplayContext);

  if (!context) {
    throw new Error('useHoldings2Context must be used within Holdings2Provider');
  }

  return context;
}
