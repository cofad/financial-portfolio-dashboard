import type { AssetType } from '@services/mock-api/mock-api';
import { useLiveHoldings, type LiveHolding } from './useLiveHoldings/useLiveHoldings';

export interface Allocations {
  total: number;
  groups: { assetType: AssetType; count: number; percentage: number }[];
}

interface UseSummary {
  isLoading: boolean;
  isError: boolean;
  liveHoldings: LiveHolding[];
  lastUpdatedAt: Date;
  totalValue: number;
  dailyProfitLoss: number;
  dailyProfitLossPercent: number;
  allocations: Allocations;
}

function generateAllocations(liveHoldings: LiveHolding[]): Allocations {
  const allocations: Allocations = { total: 0, groups: [] };

  liveHoldings.forEach((holding) => {
    allocations.total += 1;
    const group = allocations.groups.find((g) => g.assetType === holding.assetType);

    if (group) {
      group.count += 1;
    } else {
      allocations.groups.push({ assetType: holding.assetType, count: 1, percentage: 0 });
    }
  });

  allocations.groups.forEach((group) => {
    group.percentage = (group.count / allocations.total) * 100;
  });

  return allocations;
}

export default function useSummary(): UseSummary {
  const { liveHoldings, isLoading, isError, lastUpdatedAt } = useLiveHoldings();

  const totalValue = liveHoldings.reduce((acc, holding) => {
    return acc + holding.currentValue;
  }, 0);

  const dailyProfitLoss = liveHoldings.reduce((acc, holding) => {
    return acc + holding.profitLoss;
  }, 0);

  const dailyProfitLossPercent = totalValue === 0 ? 0 : (dailyProfitLoss / totalValue) * 100;

  const allocations = generateAllocations(liveHoldings);

  return {
    isLoading,
    isError,
    liveHoldings,
    lastUpdatedAt,
    totalValue,
    dailyProfitLoss,
    dailyProfitLossPercent,
    allocations,
  };
}
