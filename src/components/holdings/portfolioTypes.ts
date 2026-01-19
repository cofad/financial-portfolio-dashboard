export type SortKey =
  | 'symbol'
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
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
  currentPrice: number | null;
  totalValue: number | null;
  profitLoss: number | null;
  quoteStatus: 'idle' | 'loading' | 'error' | 'ready';
}

export type SortToggleHandler = (key: SortKey) => void;
