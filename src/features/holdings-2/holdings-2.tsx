import { useHoldings2 } from './useHoldings2';
import HoldingsTable2 from './HoldingsTable2';
import LastUpdated from '@components/last-updated/LastUpdated';
import HoldingsCards2 from './holdings-cards-2/HoldingsCards2';

export default function Holdings2() {
  const { liveHoldings, isLoading, isError, lastUpdatedAt, isUpdating } = useHoldings2();

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

      <div className="block md:hidden">
        <HoldingsCards2 />
      </div>

      <div className="hidden md:block">
        <HoldingsTable2 liveHoldings={liveHoldings} isUpdating={isUpdating} />
      </div>
    </div>
  );
}
