import { useState } from 'react';

import { useHoldingsDispatch } from '@store/holdings/hooks';
import { removeHolding } from '@store/holdings/slice';
import { useToast } from '@components/toast/useToast';
import type { SortState } from '@/features/holdings-display/holdingsDisplaySort';
import { useHoldings, type LiveHolding } from '@/hooks/useHoldings';

export interface UseHoldingsDisplay {
  liveHoldings: LiveHolding[] | null;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  lastUpdatedAt: Date;
  sortState: SortState | null;
  setSortState: (nextSortState: SortState | null) => void;
  pendingRemove: LiveHolding | null;
  requestRemove: (holding: LiveHolding) => void;
  clearPendingRemove: () => void;
  confirmRemove: () => void;
}

export function useHoldingsDisplay(): UseHoldingsDisplay {
  const dispatch = useHoldingsDispatch();

  const { liveHoldings, isLoading, isError, isFetching, lastUpdatedAt } = useHoldings();
  const { pushToast } = useToast();

  const [pendingRemove, setPendingRemove] = useState<LiveHolding | null>(null);
  const [sortState, setSortState] = useState<SortState | null>(null);

  return {
    liveHoldings,
    isLoading,
    isFetching,
    isError,
    lastUpdatedAt,
    sortState,
    setSortState,
    pendingRemove,
    requestRemove: (holding: LiveHolding) => {
      setPendingRemove(holding);
    },
    clearPendingRemove: () => {
      setPendingRemove(null);
    },
    confirmRemove: () => {
      if (!pendingRemove) return;

      dispatch(removeHolding(pendingRemove.symbol));
      setPendingRemove(null);

      pushToast({
        message: `Removed ${pendingRemove.symbol} from your portfolio.`,
        variant: 'success',
      });
    },
  };
}
