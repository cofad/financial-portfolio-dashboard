import type { PerformanceRange } from './usePerformanceData';

interface PerformanceRangeSelectorProps {
  value: PerformanceRange;
  onChange: (range: PerformanceRange) => void;
}

const ranges: { label: string; value: PerformanceRange }[] = [
  { label: '7d', value: '7d' },
  { label: '30d', value: '30d' },
  { label: '90d', value: '90d' },
  { label: '1y', value: '1y' },
];

const PerformanceRangeSelector = ({ value, onChange }: PerformanceRangeSelectorProps) => {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      {ranges.map((range) => {
        const isActive = value === range.value;
        return (
          <button
            key={range.value}
            type="button"
            onClick={() => {
              onChange(range.value);
            }}
            className={`rounded-full border px-4 py-1 text-xs font-semibold transition ${
              isActive
                ? 'border-emerald-400/70 bg-emerald-500/10 text-emerald-100'
                : 'border-slate-800 bg-slate-950/70 text-slate-400 hover:border-slate-600 hover:text-slate-200'
            }`}
          >
            {range.label}
          </button>
        );
      })}
    </div>
  );
};

export default PerformanceRangeSelector;
