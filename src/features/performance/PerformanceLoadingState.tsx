const PerformanceLoadingState = () => {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-950/40 p-6">
        <div className="h-6 w-28 animate-pulse rounded-full bg-slate-800/80" />
        <div className="h-48 w-full animate-pulse rounded-2xl bg-slate-800/80" />
      </div>
    </section>
  );
};

export default PerformanceLoadingState;
