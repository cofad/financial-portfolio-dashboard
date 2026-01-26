import { Suspense } from 'react';

import LastUpdated from '@components/last-updated/LastUpdated';
import { HoldingsDisplayProvider } from './HoldingsDisplayProvider';
import HoldingsDisplayTable from './HoldingsDisplayTable';
import HoldingsDisplayCards from './HoldingDisplayCards';
import ConfirmRemoveDialog from './ConfirmRemoveDialog';
import HoldingsDisplaySort from './HoldingsDisplaySort';
import HoldingsDisplayErrorBoundary from './HoldingsDisplayErrorBoundary';
import HoldingsDisplayLoadingState from './HoldingsDisplayLoadingState';
import { useHoldingsDisplayContext } from './HoldingsDisplayContext';
import EmptyState from '@components/empty-state/EmptyState';

function HoldingsDisplayContent() {
  const { lastUpdatedAt, pendingRemove, liveHoldings } = useHoldingsDisplayContext();

  if (liveHoldings.length === 0) {
    return <EmptyState message="No holdings yet. Add assets to build your portfolio." />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start gap-3 lg:flex-row lg:items-center lg:justify-between">
        <LastUpdated lastUpdatedAt={lastUpdatedAt} />
        <HoldingsDisplaySort />
      </div>

      <div className="block lg:hidden">
        <HoldingsDisplayCards />
      </div>

      <div className="hidden lg:block">
        <HoldingsDisplayTable />
      </div>

      {pendingRemove && <ConfirmRemoveDialog />}
    </div>
  );
}

export default function HoldingsDisplay() {
  return (
    <HoldingsDisplayErrorBoundary>
      <Suspense fallback={<HoldingsDisplayLoadingState />}>
        <HoldingsDisplayProvider>
          <HoldingsDisplayContent />
        </HoldingsDisplayProvider>
      </Suspense>
    </HoldingsDisplayErrorBoundary>
  );
}
