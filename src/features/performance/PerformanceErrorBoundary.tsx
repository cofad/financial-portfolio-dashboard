import { ErrorBoundary } from 'react-error-boundary';
import type { ReactNode } from 'react';
import ErrorState from '@components/error-state/ErrorState';

function PerformanceErrorState() {
  return (
    <ErrorState
      className="border border-dashed border-slate-800 bg-slate-950/40 text-slate-400"
      message="Failed to load performance data."
    />
  );
}

interface PerformanceErrorBoundaryProps {
  children: ReactNode;
}

function PerformanceErrorBoundary({ children }: PerformanceErrorBoundaryProps) {
  return <ErrorBoundary fallback={<PerformanceErrorState />}>{children}</ErrorBoundary>;
}

export default PerformanceErrorBoundary;
