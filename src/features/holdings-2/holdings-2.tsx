import {
  Holdings2Provider,
  useHoldings2Context,
} from '@features/holdings-2/holdings-2-provider/Holdings2Provider';
import HoldingsTable2 from './HoldingsTable2';
import LastUpdated from '@components/last-updated/LastUpdated';
import HoldingsCards2 from './holdings-cards-2/HoldingsCards2';
import ConfirmRemoveDialog from './confirm-remove-dialog/ConfirmRemoveDialog';

function Holdings2Content() {
  const { liveHoldings, isLoading, isError, lastUpdatedAt, pendingRemove } = useHoldings2Context();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !liveHoldings) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <LastUpdated lastUpdatedAt={lastUpdatedAt} />
      </div>

      <div className="block lg:hidden">
        <HoldingsCards2 />
      </div>

      <div className="hidden lg:block">
        <HoldingsTable2 />
      </div>

      {pendingRemove && <ConfirmRemoveDialog />}
    </div>
  );
}

export default function Holdings2() {
  return (
    <Holdings2Provider>
      <Holdings2Content />
    </Holdings2Provider>
  );
}
