import { createContext, use } from 'react';

type ToastVariant = 'success' | 'error';

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export interface ToastContextValue {
  pushToast: (toast: Omit<Toast, 'id'>) => void;
}
export const useToast = (): ToastContextValue => {
  const context = use(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
};
