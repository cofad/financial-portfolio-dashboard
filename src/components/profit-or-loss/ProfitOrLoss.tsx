import { formatPercent } from '@/utils/percents';
import { formatCurrency } from '@utils/currency';

interface ProfitOrLossProps {
  value: number;
  className?: string;
  type?: 'percent' | 'currency';
}

const getProfitLossTone = (value: number): string => (value >= 0 ? 'text-emerald-300' : 'text-rose-300');

export default function ProfitOrLoss({ value, className, type = 'currency' }: ProfitOrLossProps) {
  const toneClassName = getProfitLossTone(value);
  const combinedClassName = className ? `${className} ${toneClassName}` : toneClassName;
  const formattedValue = type === 'percent' ? formatPercent(value) : formatCurrency(value);

  return <div className={combinedClassName}>{formattedValue}</div>;
}
