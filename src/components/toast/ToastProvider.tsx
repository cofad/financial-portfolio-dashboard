import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { ToastContext, type Toast, type ToastContextValue } from './useToast';

const createToastId = (): string => {
  return crypto.randomUUID();
  return `toast-${Date.now().toString()}-${Math.random().toString(16).slice(2)}`;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = createToastId();
    setToasts((current) => [...current, { ...toast, id }]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 3500);
  }, []);

  const value = useMemo<ToastContextValue>(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext value={value}>
      {children}
      <div className="pointer-events-none fixed right-6 bottom-6 left-6 z-50 flex w-full max-w-xs flex-col gap-3 sm:right-auto">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`animate-toast-rise pointer-events-auto rounded-2xl border px-4 py-3 text-sm shadow-lg backdrop-blur ${
              toast.variant === 'success'
                ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-100'
                : 'border-rose-500/40 bg-rose-500/15 text-rose-100'
            }`}
            role="status"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext>
  );
};
