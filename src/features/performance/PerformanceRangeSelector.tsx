import { usePerformanceContext } from './PerformanceContext';

const PerformanceRangeSelector = () => {
  const { range, setRange, ranges } = usePerformanceContext();

  return (
    <div className="flex flex-wrap justify-end gap-2">
      {ranges.map((option) => {
        const isActive = range === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              setRange(option.value);
            }}
            className={`rounded-full border px-4 py-1 text-xs font-semibold transition ${
              isActive
                ? 'border-emerald-400/70 bg-emerald-500/10 text-emerald-100'
                : 'border-slate-800 bg-slate-950/70 text-slate-400 hover:border-slate-600 hover:text-slate-200'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default PerformanceRangeSelector;
