import { twMerge } from 'tailwind-merge';
import { useHoldingsDispatch } from '@store/holdings/hooks';
import { resetHoldings } from '@store/holdings/slice';
import { persistor } from '@store/holdings/store';

interface ErrorStateProps {
  message: string;
  className?: string;
}

export default function ErrorState({ message, className }: ErrorStateProps) {
  const dispatch = useHoldingsDispatch();

  const handleClearStore = () => {
    dispatch(resetHoldings());
    void persistor.purge();
  };

  return (
    <section className={twMerge('rounded-3xl p-8 text-center text-sm', className)}>
      <p>{message}</p>

      <p className="mt-3 text-sm">
        Please try again later. If the issue persists, you can clear your stored data to start over.
      </p>

      <button
        className="mt-4 rounded-full border border-slate-700/80 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-slate-200 uppercase transition hover:border-slate-400 hover:bg-slate-200/10"
        onClick={handleClearStore}
        type="button"
      >
        Clear saved data
      </button>
    </section>
  );
}
