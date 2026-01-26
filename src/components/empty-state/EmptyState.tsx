import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface EmptyStateProps {
  message: string;
  className?: string;
  children?: ReactNode;
}

export default function EmptyState({ message, className, children }: EmptyStateProps) {
  return (
    <section
      className={twMerge(
        'rounded-3xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center text-sm text-slate-400',
        className,
      )}
    >
      <p>{message}</p>
      {children && <div className="mt-6 flex justify-center">{children}</div>}
    </section>
  );
}
