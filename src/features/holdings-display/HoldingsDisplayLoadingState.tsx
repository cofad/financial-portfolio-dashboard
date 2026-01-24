const HoldingsDisplayLoadingState = () => {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="h-4 w-36 animate-pulse rounded-full bg-slate-800/80" />
        <div className="h-9 w-52 animate-pulse rounded-2xl bg-slate-800/80" />
      </div>
      <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6">
        <div className="h-48 w-full animate-pulse rounded-2xl bg-slate-800/80" />
      </div>
    </section>
  );
};

export default HoldingsDisplayLoadingState;
