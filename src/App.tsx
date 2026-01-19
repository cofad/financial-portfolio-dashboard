import PortfolioForm from '@components/PortfolioForm';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <h1 className="text-3xl font-semibold">Financial Portfolio Dashboard</h1>
        <p className="text-sm text-slate-400">
          Add assets to your portfolio and keep them synced to local storage.
        </p>
        <PortfolioForm />
      </div>
    </div>
  );
}

export default App;
