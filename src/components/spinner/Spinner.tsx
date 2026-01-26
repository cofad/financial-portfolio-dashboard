type SpinnerSize = 'sm' | 'md' | 'lg';

type SpinnerProps = {
  size?: SpinnerSize;
  label?: string;
  showLabel?: boolean;
  className?: string;
};

const SIZE_CLASSES: Record<SpinnerSize, string> = {
  sm: 'h-3.5 w-3.5 border-2',
  md: 'h-4 w-4 border-2',
  lg: 'h-5 w-5 border-[2.5px]',
};

export default function Spinner({ size = 'md', label = 'Loading', showLabel = false, className = '' }: SpinnerProps) {
  const shouldShowLabel = showLabel && label.length > 0;

  return (
    <span className={`inline-flex items-center gap-2 ${className}`} role="status" aria-live="polite">
      <span
        className={`inline-block animate-spin rounded-full border-slate-700/70 border-t-teal-200 ${SIZE_CLASSES[size]}`}
        aria-hidden="true"
      />
      {shouldShowLabel ? (
        <span className="text-xs tracking-[0.2em] text-slate-500 uppercase">{label}</span>
      ) : (
        <span className="sr-only">{label}</span>
      )}
    </span>
  );
}
