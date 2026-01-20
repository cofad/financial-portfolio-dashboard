import AddAssetForm from '@/features/add-asset-form/AddAssetForm';
import Holdings from '@/features/holdings/Holdings';
import Performance from '@/features/performance/Performance';
import Summary from '@/features/summary/Summary';
import SectionTabs from '@/components/section-tabs/SectionTabs';

function App() {
  return (
    <div className="min-h-screen px-6 py-12 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <h1 className="text-3xl font-semibold">Portfolio Dashboard</h1>

        <SectionTabs
          defaultTabId="summary"
          tabs={[
            {
              id: 'summary',
              label: 'Summary',
              content: <Summary />,
            },
            {
              id: 'performance',
              label: 'Performance',
              content: <Performance />,
            },
            {
              id: 'add-asset',
              label: 'Add Asset',
              content: <AddAssetForm />,
            },
            {
              id: 'holdings',
              label: 'Holdings',
              content: <Holdings />,
            },
          ]}
        />
      </div>
    </div>
  );
}

export default App;
