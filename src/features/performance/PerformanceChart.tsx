import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from 'recharts';
import type { PerformancePoint } from './usePerformanceData';
import { formatCurrency } from '@features/holdings/portfolioUtils';

interface PerformanceChartProps {
  data: PerformancePoint[];
  isLoading: boolean;
}

const formatAxisDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatAxisValue = (value: number) => {
  if (!Number.isFinite(value)) {
    return '';
  }
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
};

const PerformanceTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const value = payload[0]?.value;
  const numericValue = typeof value === 'number' && Number.isFinite(value) ? value : null;
  const formattedDate = label ? formatAxisDate(label) : '';

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-xs text-slate-200 shadow-lg">
      <p className="font-semibold text-slate-100">{formattedDate}</p>
      <p className="mt-1 text-sm">{formatCurrency(numericValue)}</p>
    </div>
  );
};

const PerformanceChart = ({ data, isLoading }: PerformanceChartProps) => {
  if (isLoading) {
    return <div className="h-64 w-full animate-pulse rounded-3xl bg-slate-900/70" />;
  }

  if (data.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-3xl border border-dashed border-slate-800 text-sm text-slate-400">
        Performance data is unavailable.
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
          <XAxis dataKey="date" tickFormatter={formatAxisDate} stroke="#475569" fontSize={12} tickLine={false} />
          <YAxis
            tickFormatter={formatAxisValue}
            stroke="#475569"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<PerformanceTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#34d399"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#34d399' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
