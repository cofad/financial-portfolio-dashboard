import type { HoldingRow, SortKey, SortRule } from './portfolioTypes';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

const quantityFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 4,
});

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
});

export const holdingsColumns: { key: SortKey; label: string }[] = [
  { key: 'symbol', label: 'Symbol' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'purchasePrice', label: 'Purchase Price' },
  { key: 'currentPrice', label: 'Current Price' },
  { key: 'totalValue', label: 'Total Value' },
  { key: 'profitLoss', label: 'P/L' },
  { key: 'purchaseDate', label: 'Purchase Date' },
];

export const formatCurrency = (value: number | null) =>
  typeof value === 'number' && Number.isFinite(value) ? currencyFormatter.format(value) : '—';

export const formatQuantity = (value: number) => quantityFormatter.format(value);

export const formatDate = (value: string) => {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? '—' : dateFormatter.format(new Date(timestamp));
};

export const getProfitLossTone = (value: number | null) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 'text-slate-400';
  }
  return value >= 0 ? 'text-emerald-300' : 'text-rose-300';
};

export const getSortValue = (row: HoldingRow, key: SortKey): string | number | null => {
  switch (key) {
    case 'symbol':
      return row.symbol;
    case 'quantity':
      return row.quantity;
    case 'purchasePrice':
      return row.purchasePrice;
    case 'currentPrice':
      return row.currentPrice;
    case 'totalValue':
      return row.totalValue;
    case 'profitLoss':
      return row.profitLoss;
    case 'purchaseDate': {
      const timestamp = Date.parse(row.purchaseDate);
      return Number.isNaN(timestamp) ? null : timestamp;
    }
    default:
      return null;
  }
};

export const compareValues = (a: string | number | null, b: string | number | null) => {
  if (a === null && b === null) {
    return 0;
  }
  if (a === null) {
    return 1;
  }
  if (b === null) {
    return -1;
  }
  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b);
  }
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }
  return 0;
};

type NextDirection = 'asc' | 'desc' | 'none';

export const updateSortRules = (rules: SortRule[], key: SortKey): SortRule[] => {
  const existingRule = rules.find((rule) => rule.key === key) ?? null;
  const nextDirection: NextDirection = !existingRule ? 'asc' : existingRule.direction === 'asc' ? 'desc' : 'none';

  if (nextDirection === 'none') {
    return [];
  }

  return [{ key, direction: nextDirection }];
};

export const getCurrentPriceText = (row: HoldingRow) => {
  if (row.quoteStatus === 'loading') {
    return 'Refreshing...';
  }
  if (row.quoteStatus === 'error') {
    return 'Error';
  }
  return formatCurrency(row.currentPrice);
};
