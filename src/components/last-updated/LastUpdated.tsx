import { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface LastUpdatedProps {
  lastUpdatedAt: Date;
  className?: string;
}

const ANIMATION_DURATION = 1_000;

export default function LastUpdated({ lastUpdatedAt, className }: LastUpdatedProps) {
  const [now, setNow] = useState<Date>(() => new Date());
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const previousUpdatedAtRef = useRef<number | undefined>(undefined);
  const pulseTimeoutRef = useRef<number | undefined>(undefined);

  // Update elapsed time each second
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  // Check if animation should be triggered
  useEffect(() => {
    (() => {
      const updatedAtTime = lastUpdatedAt.getTime();

      // Skip the initial load
      if (!previousUpdatedAtRef.current) {
        previousUpdatedAtRef.current = updatedAtTime;
        return;
      }

      // Check for change in update time
      if (previousUpdatedAtRef.current === updatedAtTime) return;

      previousUpdatedAtRef.current = updatedAtTime;
      window.clearTimeout(pulseTimeoutRef.current);
      setIsAnimating(true);

      pulseTimeoutRef.current = window.setTimeout(() => {
        setIsAnimating(false);
      }, ANIMATION_DURATION);
    })();

    return () => {
      window.clearTimeout(pulseTimeoutRef.current);
    };
  }, [lastUpdatedAt]);

  const secondsSinceUpdate = Math.max(0, Math.floor((now.getTime() - lastUpdatedAt.getTime()) / 1000));

  return (
    <div
      className={twMerge(
        'rounded-full border border-slate-800 bg-slate-950/70 px-4 py-2 text-xs text-slate-300 transition-shadow duration-700 ease-out sm:whitespace-nowrap',
        isAnimating ? 'shadow-[0_0_10px_6px_rgba(16,185,129,0.35)]' : 'shadow-none',
        className,
      )}
    >
      Last updated: <span className="inline-block w-[2ch] text-right">{String(secondsSinceUpdate)}</span> seconds
      ago
    </div>
  );
}
