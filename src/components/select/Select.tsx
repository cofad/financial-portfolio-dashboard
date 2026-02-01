import { type SelectHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface SelectOption {
  readonly label: string;
  readonly key: string;
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  displayValue: string;
  options: SelectOption[];
  containerClassName?: string;
  defaultOption?: SelectOption;
};

function SelectChevron({ disabled = false }: { disabled?: boolean }) {
  return (
    <span
      className={twMerge(
        'pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400',
        disabled && 'text-slate-600',
      )}
      aria-hidden="true"
    >
      <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
        <path
          d="M4 6.25L8 10.25L12 6.25"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function Select({
  label,
  displayValue,
  className,
  disabled,
  containerClassName,
  defaultOption,
  options,
  ...props
}: SelectProps) {
  const mergedOptions = defaultOption ? [defaultOption, ...options] : options;

  return (
    <label
      className={twMerge(
        'focus-ring relative flex h-12 w-full items-center justify-between gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-300 transition sm:w-auto lg:h-auto',
        containerClassName,
      )}
    >
      <span className="font-semibold tracking-[0.2em] whitespace-nowrap text-slate-400 uppercase">{label}</span>
      <span
        className={twMerge(
          'mr-6 w-full min-w-0 text-right text-xs font-semibold text-slate-100',
          disabled && 'text-slate-500',
        )}
      >
        {displayValue}
      </span>
      <select
        {...props}
        disabled={disabled}
        className={twMerge(
          'absolute inset-0 h-full w-full cursor-pointer bg-slate-950 text-slate-100 opacity-0 focus:outline-none disabled:cursor-not-allowed',
          className,
        )}
      >
        {mergedOptions.map((option) => (
          <option className="bg-slate-950 text-slate-100" key={option.key} value={option.key}>
            {option.label}
          </option>
        ))}
      </select>
      <SelectChevron disabled={disabled} />
    </label>
  );
}
