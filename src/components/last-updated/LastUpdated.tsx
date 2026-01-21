import { useEffect, useState } from 'react';

interface LastUpdatedProps {
  lastUpdatedAt: Date;
}

export default function LastUpdated({ lastUpdatedAt }: LastUpdatedProps) {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const secondsSinceUpdate = Math.max(0, Math.floor((now.getTime() - lastUpdatedAt.getTime()) / 1000));

  return (
    <div className="rounded-full border border-slate-800 bg-slate-950/70 px-4 py-2 text-xs text-slate-300">
      Last updated: <span className="inline-block w-[2ch] text-right">{String(secondsSinceUpdate)}</span> seconds
      ago
    </div>
  );
}
