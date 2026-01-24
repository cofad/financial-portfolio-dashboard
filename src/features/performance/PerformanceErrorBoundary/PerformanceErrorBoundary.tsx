import { ErrorBoundary } from 'react-error-boundary';
import type { ReactNode } from 'react';
import PerformanceErrorState from './PerformanceErrorState';

interface PerformanceErrorBoundaryProps {
  children: ReactNode;
}

const PerformanceErrorBoundary = ({ children }: PerformanceErrorBoundaryProps) => {
  return <ErrorBoundary fallback={<PerformanceErrorState />}>{children}</ErrorBoundary>;
};

export default PerformanceErrorBoundary;
