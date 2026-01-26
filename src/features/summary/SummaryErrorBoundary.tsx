import { ErrorBoundary } from 'react-error-boundary';
import type { ReactNode } from 'react';
import ErrorState from '@components/error-state/ErrorState';

function SummaryErrorState() {
  return (
    <ErrorState
      className="border border-dashed border-slate-800 bg-slate-950/40 text-slate-400"
      message="Failed to load summary."
    />
  );
}

interface SummaryErrorBoundaryProps {
  children: ReactNode;
}

function SummaryErrorBoundary({ children }: SummaryErrorBoundaryProps) {
  return <ErrorBoundary fallback={<SummaryErrorState />}>{children}</ErrorBoundary>;
}

export default SummaryErrorBoundary;
