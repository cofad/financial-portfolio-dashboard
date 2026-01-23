import { twMerge } from 'tailwind-merge';

import { formatPercent } from '@utils/percents';
import type { Allocations } from '@/hooks/useSummary';

interface AllocationChartProps {
  allocations: Allocations;
  className?: string;
}

interface ColorSet {
  bar: string;
  text: string;
}

const COLOR_PALETTE: ColorSet[] = [
  { bar: 'bg-emerald-400', text: 'text-emerald-200' },
  { bar: 'bg-sky-400', text: 'text-sky-200' },
  { bar: 'bg-amber-400', text: 'text-amber-200' },
  { bar: 'bg-fuchsia-400', text: 'text-fuchsia-200' },
  { bar: 'bg-rose-400', text: 'text-rose-200' },
  { bar: 'bg-lime-400', text: 'text-lime-200' },
  { bar: 'bg-cyan-400', text: 'text-cyan-200' },
  { bar: 'bg-indigo-400', text: 'text-indigo-200' },
];

export default function AllocationChart({ allocations, className }: AllocationChartProps) {
  if (allocations.total === 0) {
    return (
      <div className={twMerge('rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4', className)}>
        <p className="text-xs text-slate-400">No allocation data available.</p>
      </div>
    );
  }

  return (
    <div className={twMerge('space-y-4', className)}>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-900">
        {allocations.groups.map((group, index) => (
          <div
            key={group.assetType}
            className={COLOR_PALETTE[index % COLOR_PALETTE.length].bar}
            style={{ width: `${group.percentage.toString()}%` }}
          />
        ))}
      </div>

      <div className="space-y-3">
        {allocations.groups.map((group, index) => (
          <dl
            key={group.assetType}
            className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 px-3 py-2"
          >
            <dt className="flex items-center gap-2">
              <span className={twMerge('h-2 w-2 rounded-full', COLOR_PALETTE[index % COLOR_PALETTE.length].bar)} />
              <span className="text-xs text-slate-200">{group.assetType}</span>
            </dt>

            <dd className="flex items-baseline gap-2">
              <span
                className={twMerge(
                  'text-[0.7rem] font-semibold tracking-[0.25em] uppercase',
                  COLOR_PALETTE[index % COLOR_PALETTE.length].text,
                )}
              >
                {formatPercent(group.percentage, 1)}
              </span>
            </dd>
          </dl>
        ))}
      </div>
    </div>
  );
}
