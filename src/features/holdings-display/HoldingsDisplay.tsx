import { Suspense } from 'react';

import {
  HoldingsDisplayProvider,
  useHoldingsDisplayContext,
} from '@features/holdings-display/HoldingsDisplayProvider';
import HoldingsDisplayTable from '@features/holdings-display/HoldingsDisplayTable';
import LastUpdated from '@components/last-updated/LastUpdated';
import HoldingsDisplayCards from '@features/holdings-display/HoldingDisplayCards';
import ConfirmRemoveDialog from '@features/holdings-display/ConfirmRemoveDialog';
import HoldingsDisplaySort from '@features/holdings-display/HoldingsDisplaySort';
import HoldingsDisplayErrorBoundary from '@/features/holdings-display/HoldingsDisplayErrorBoundary';
import HoldingsDisplayLoadingState from '@/features/holdings-display/HoldingsDisplayLoadingState';

function HoldingsDisplayContent() {
  const { lastUpdatedAt, pendingRemove } = useHoldingsDisplayContext();

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
      <HoldingsDisplayProvider>
        <Suspense fallback={<HoldingsDisplayLoadingState />}>
          <HoldingsDisplayContent />
        </Suspense>
      </HoldingsDisplayProvider>
    </HoldingsDisplayErrorBoundary>
  );
}
