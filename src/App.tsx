import SymbolAutocomplete from '@components/SymbolAutocomplete';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <h1 className="text-3xl font-semibold">Financial Portfolio Dashboard</h1>

        <SymbolAutocomplete />
      </div>
    </div>
  );
}

export default App;
