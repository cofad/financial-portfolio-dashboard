import AddAssetForm from '@/features/add-asset-form/AddAssetForm';
import Holdings from '@/features/holdings/Holdings';
import Summary from '@/features/summary/Summary';

function App() {
  return (
    <div className="min-h-screen px-6 py-12 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <h1 className="text-3xl font-semibold">Financial Portfolio Dashboard</h1>
        <p className="text-sm text-slate-400">
          Add assets to your portfolio and keep them synced to local storage.
        </p>
        <Summary />
        <AddAssetForm />
        <Holdings />
      </div>
    </div>
  );
}

export default App;
