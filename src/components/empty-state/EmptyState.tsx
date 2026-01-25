import { twMerge } from 'tailwind-merge';

interface EmptyStateProps {
  message: string;
  className?: string;
}

export default function EmptyState({ message, className }: EmptyStateProps) {
  return (
    <section
      className={twMerge(
        'rounded-3xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center text-sm text-slate-400',
        className,
      )}
    >
      {message}
    </section>
  );
}
