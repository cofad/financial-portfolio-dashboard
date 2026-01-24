import { ErrorBoundary } from 'react-error-boundary';
import type { ReactNode } from 'react';

const HoldingsDisplayErrorState = () => {
  return (
    <section className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center text-sm text-slate-400">
      Unable to load holdings right now.
    </section>
  );
};

interface HoldingsDisplayErrorBoundaryProps {
  children: ReactNode;
}

const HoldingsDisplayErrorBoundary = ({ children }: HoldingsDisplayErrorBoundaryProps) => {
  return <ErrorBoundary fallback={<HoldingsDisplayErrorState />}>{children}</ErrorBoundary>;
};

export default HoldingsDisplayErrorBoundary;
