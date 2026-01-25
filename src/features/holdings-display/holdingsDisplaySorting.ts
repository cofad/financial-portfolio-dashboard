import type { LiveHolding } from '@/hooks/useHoldings';

export const SORT_OPTIONS = [
  { key: 'symbol', label: 'Symbol' },
  { key: 'assetType', label: 'Type' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'purchasePrice', label: 'Purchase Price' },
  { key: 'currentPrice', label: 'Current Price' },
  { key: 'currentValue', label: 'Total Value' },
  { key: 'profitLoss', label: 'P/L' },
  { key: 'purchaseDate', label: 'Purchase Date' },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]['key'];
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  key: SortKey;
  direction: SortDirection;
}

const getSortValue = (holding: LiveHolding, key: SortKey): number | string => {
  switch (key) {
    case 'symbol':
      return holding.symbol.toLowerCase();
    case 'assetType':
      return holding.assetType.toLowerCase();
    case 'quantity':
      return holding.quantity;
    case 'purchasePrice':
      return holding.purchasePrice;
    case 'currentPrice':
      return holding.currentPrice;
    case 'currentValue':
      return holding.currentValue;
    case 'profitLoss':
      return holding.profitLoss;
    case 'purchaseDate':
      return Date.parse(holding.purchaseDate);
    default: {
      const exhaustiveCheck: never = key;
      return exhaustiveCheck;
    }
  }
};

export const sortHoldings = (holdings: LiveHolding[], sortState: SortState | null): LiveHolding[] => {
  if (!sortState) return holdings;
  const sorted = [...holdings].sort((a, b) => {
    const aValue = getSortValue(a, sortState.key);
    const bValue = getSortValue(b, sortState.key);

    if (aValue < bValue) return sortState.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortState.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
};
