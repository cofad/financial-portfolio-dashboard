import type { AssetType } from '@/services/finnhub/finnhub';
import { useHoldings, type LiveHolding } from './useHoldings';

interface UseSummary {
  isLoading: boolean;
  isError: boolean;
  liveHoldings: LiveHolding[] | null;
  lastUpdatedAt: Date;
  totalValue?: number;
  dailyProfitLoss?: number;
  allocation?: Record<AssetType, number>;
}

export default function useSummary(): UseSummary {
  const { liveHoldings, isLoading, isError, lastUpdatedAt } = useHoldings();

  const totalValue = liveHoldings?.reduce((acc, holding) => {
    return acc + holding.currentValue;
  }, 0);

  const dailyProfitLoss = liveHoldings?.reduce((acc, holding) => {
    return acc + holding.profitLoss;
  }, 0);

  const allocation = liveHoldings?.reduce(
    (acc, holding) => {
      acc[holding.assetType] = (acc[holding.assetType] || 0) + 1;
      return acc;
    },
    {} as Record<AssetType, number>,
  );

  return {
    isLoading,
    isError,
    liveHoldings,
    lastUpdatedAt,
    totalValue,
    dailyProfitLoss,
    allocation,
  };
}
