import { formatCurrency } from '@utils/currency';

interface ProfitOrLossProps {
  value: number;
  className?: string;
}

const getProfitLossTone = (value: number): string => (value >= 0 ? 'text-emerald-300' : 'text-rose-300');

export default function ProfitOrLoss({ value, className }: ProfitOrLossProps) {
  const toneClassName = getProfitLossTone(value);
  const combinedClassName = className ? `${className} ${toneClassName}` : toneClassName;

  return <div className={combinedClassName}>{formatCurrency(value)}</div>;
}
