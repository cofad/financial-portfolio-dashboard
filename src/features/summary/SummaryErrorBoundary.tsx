import { ErrorBoundary } from 'react-error-boundary';
import type { ReactNode } from 'react';

const SummaryErrorState = () => {
  return (
    <section className="rounded-3xl border border-rose-500/40 bg-rose-500/10 p-8 text-center text-sm text-rose-100">
      Failed to load summary. Please try again later.
    </section>
  );
};

interface SummaryErrorBoundaryProps {
  children: ReactNode;
}

const SummaryErrorBoundary = ({ children }: SummaryErrorBoundaryProps) => {
  return <ErrorBoundary fallback={<SummaryErrorState />}>{children}</ErrorBoundary>;
};

export default SummaryErrorBoundary;
