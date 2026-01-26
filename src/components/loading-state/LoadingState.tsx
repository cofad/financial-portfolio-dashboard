import { twMerge } from 'tailwind-merge';

import Spinner from '@components/spinner/Spinner';

interface LoadingStateProps {
  label: string;
  className?: string;
  spinnerClassName?: string;
  showLabel?: boolean;
}

export default function LoadingState({ label, className, spinnerClassName, showLabel = true }: LoadingStateProps) {
  return (
    <section
      className={twMerge(
        'animate-fade-in-delayed rounded-3xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center text-sm text-slate-400',
        className,
      )}
    >
      <Spinner label={label} showLabel={showLabel} className={spinnerClassName} />
    </section>
  );
}
