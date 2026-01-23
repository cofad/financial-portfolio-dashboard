import {
  HoldingsDisplayProvider,
  useHoldingsDisplayContext,
} from '@/features/holdings-display/HoldingsDisplayProvider';
import HoldingsDisplayTable from './HoldingsDisplayTable';
import LastUpdated from '@components/last-updated/LastUpdated';
import HoldingsDisplayCards from './HoldingDisplayCards';
import ConfirmRemoveDialog from './ConfirmRemoveDialog';
import HoldingsDisplaySort from '@/features/holdings-display/HoldingsDisplaySort';

function HoldingsDisplayContent() {
  const { liveHoldings, isLoading, isError, lastUpdatedAt, pendingRemove } = useHoldingsDisplayContext();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !liveHoldings) {
    return <div>Error loading data</div>;
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
    <HoldingsDisplayProvider>
      <HoldingsDisplayContent />
    </HoldingsDisplayProvider>
  );
}
