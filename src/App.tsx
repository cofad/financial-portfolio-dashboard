import Tabs from '@components/tabs/Tabs';
import AddAssetForm from '@features/add-asset-form/AddAssetForm';
import Performance from '@features/performance/Performance';
import Summary from '@features/summary/Summary';
import { useQuery } from '@tanstack/react-query';
import { useHoldingsSelector } from '@store/holdings/hooks';
import { selectHoldingSymbols } from '@store/holdings/store';
import { buildQuotesQueryOptions } from '@hooks/useLiveHoldings/quotes-query';
import HoldingsDisplay from '@features/holdings-display/HoldingsDisplay';

function App() {
  const holdingSymbols = useHoldingsSelector(selectHoldingSymbols);

  // Keep quotes query refetch alive for entire app life cycle
  useQuery(buildQuotesQueryOptions(holdingSymbols));

  return (
    <div className="min-h-screen px-6 py-12 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Portfolio Simulator</h1>
          <p className="text-slate-400">
            Welcome to the portfolio simulator! This app allows you to create a mock portfolio by adding stocks,
            tracking their performance, and reviewing your holdings. All data is stored in your browser and can be
            accessed again by visiting the site from the same computer/browser combination.
          </p>
        </div>

        <Tabs
          defaultTabId="summary"
          tabs={[
            {
              id: 'summary',
              label: 'Summary',
              content: <Summary />,
            },
            {
              id: 'add-asset',
              label: 'Add Asset',
              content: <AddAssetForm />,
            },
            {
              id: 'performance',
              label: 'Performance',
              content: <Performance />,
            },
            {
              id: 'holdings',
              label: 'Holdings',
              content: <HoldingsDisplay />,
            },
          ]}
        />
      </div>
    </div>
  );
}

export default App;
