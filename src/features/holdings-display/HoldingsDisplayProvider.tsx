import { type ReactNode } from 'react';
import { useHoldingsDisplay } from './useHoldingsDisplay';
import { HoldingsDisplayContext } from './HoldingsDisplayContext';

interface HoldingsProviderProps {
  children: ReactNode;
}

export function HoldingsDisplayProvider({ children }: HoldingsProviderProps) {
  const value = useHoldingsDisplay();

  return <HoldingsDisplayContext value={value}>{children}</HoldingsDisplayContext>;
}
