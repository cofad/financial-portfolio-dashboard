export type SortKey =
  | 'symbol'
  | 'assetType'
  | 'quantity'
  | 'purchasePrice'
  | 'currentPrice'
  | 'totalValue'
  | 'profitLoss'
  | 'purchaseDate';

export type SortDirection = 'asc' | 'desc';

export interface SortRule {
  key: SortKey;
  direction: SortDirection;
}

export interface HoldingRow {
  symbol: string;
  assetType: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
  currentPrice: number | null;
  totalValue: number | null;
  profitLoss: number | null;
  quoteStatus: 'idle' | 'loading' | 'error' | 'ready';
  quoteUpdatedAt: number | null;
  isRecentlyUpdated: boolean;
}

export type SortToggleHandler = (key: SortKey) => void;
