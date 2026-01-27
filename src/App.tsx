import { useEffect, useState } from 'react';
import Tabs from '@components/tabs/Tabs';
import AddAssetForm from '@features/add-asset-form/AddAssetForm';
import Performance from '@features/performance/Performance';
import Summary from '@features/summary/Summary';
import { useQuery } from '@tanstack/react-query';
import { useHoldingsSelector } from '@store/holdings/hooks';
import { selectHoldingSymbols } from '@store/holdings/store';
import { buildQuotesQueryOptions } from '@hooks/useLiveHoldings/quotes-query';
import HoldingsDisplay from '@features/holdings-display/HoldingsDisplay';
import EmptyState from '@components/empty-state/EmptyState';
import Footer from '@components/footer/Footer';

function App() {
  const holdingSymbols = useHoldingsSelector(selectHoldingSymbols);
  const hasHoldings = holdingSymbols.length > 0;
  const [showTabs, setShowTabs] = useState(hasHoldings);
  const [initialTabId, setInitialTabId] = useState<string>('summary');

  // Keep quotes query refetch alive for entire app life cycle
  useQuery(buildQuotesQueryOptions(holdingSymbols));

  useEffect(() => {
    (() => {
      if (hasHoldings && !showTabs) {
        setShowTabs(true);
      }
    })();
  }, [hasHoldings, showTabs]);

  return (
    <div className="flex min-h-screen px-6 pt-12 pb-4 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8">
        <div className="space-y-2">
          <h1 className="mb-6 text-3xl font-semibold">Portfolio Simulator</h1>
          <p className="text-slate-400">
            Welcome to the portfolio simulator! This app allows you to create a mock portfolio by adding stocks,
            tracking their performance, and reviewing your holdings. The available stocks and history data are mock
            data that has been randomly generated. All data is stored in your browser and can be accessed again by
            visiting the site from the same computer/browser combination.
          </p>
        </div>

        {showTabs ? (
          <Tabs
            defaultTabId={initialTabId}
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
        ) : (
          <EmptyState
            message="No holdings yet. Get started by adding your first asset to build a portfolio."
            className="bg-slate-950/50"
          >
            <button
              type="button"
              onClick={() => {
                setInitialTabId('add-asset');
                setShowTabs(true);
              }}
              className="rounded-2xl border border-emerald-300/70 px-6 py-3 text-sm font-semibold text-emerald-100 transition hover:border-emerald-200 hover:bg-emerald-300/10"
            >
              Get started
            </button>
          </EmptyState>
        )}

        <Footer />
      </div>
    </div>
  );
}

export default App;
