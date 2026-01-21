import AddAssetForm from '@/features/add-asset-form/AddAssetForm';
import Holdings from '@/features/holdings/Holdings';
import Performance from '@/features/performance/Performance';
import Summary from '@/features/summary/Summary';
import Tabs from '@/components/tabs/Tabs';
import Holdings2 from './features/holdings-2/holdings-2';

function App() {
  return (
    <div className="min-h-screen px-6 py-12 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <h1 className="text-3xl font-semibold">Portfolio Dashboard</h1>

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
              content: <Holdings />,
            },
            {
              id: 'holdings2',
              label: 'Holdings2',
              content: <Holdings2 />,
            },
          ]}
        />
      </div>
    </div>
  );
}

export default App;
