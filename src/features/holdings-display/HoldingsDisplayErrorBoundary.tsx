import { ErrorBoundary } from 'react-error-boundary';
import type { ReactNode } from 'react';
import ErrorState from '@components/error-state/ErrorState';

function HoldingsDisplayErrorState() {
  return (
    <ErrorState
      className="border border-dashed border-slate-800 bg-slate-950/40 text-slate-400"
      message="Failed to load holdings."
    />
  );
}

interface HoldingsDisplayErrorBoundaryProps {
  children: ReactNode;
}

function HoldingsDisplayErrorBoundary({ children }: HoldingsDisplayErrorBoundaryProps) {
  return <ErrorBoundary fallback={<HoldingsDisplayErrorState />}>{children}</ErrorBoundary>;
}

export default HoldingsDisplayErrorBoundary;
