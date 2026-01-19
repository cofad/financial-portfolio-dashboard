import { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }
    if (open && !dialog.open) {
      dialog.showModal();
    }
    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', open);
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) {
      return;
    }

    const selectors = ['button', '[href]', 'input', 'select', 'textarea', '[tabindex]:not([tabindex="-1"])'];
    const getFocusable = () =>
      Array.from(dialog.querySelectorAll<HTMLElement>(selectors.join(','))).filter(
        (element) => !element.hasAttribute('disabled') && !element.getAttribute('aria-hidden'),
      );

    const focusFirst = () => {
      const focusable = getFocusable();
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        dialog.focus();
      }
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') {
        return;
      }
      const focusable = getFocusable();
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement;
      if (event.shiftKey) {
        if (activeElement === first || activeElement === dialog) {
          event.preventDefault();
          last.focus();
        }
      } else if (activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    focusFirst();
    dialog.addEventListener('keydown', handleKeydown);
    return () => {
      dialog.removeEventListener('keydown', handleKeydown);
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="motion-safe:animate-fade-up fixed inset-0 z-50 m-auto w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950/75 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur-xl [&::backdrop]:bg-slate-950/80 [&::backdrop]:backdrop-blur-sm"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      onClick={(event) => {
        if (event.currentTarget === event.target) {
          onCancel();
        }
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
          {description && <p className="text-sm text-slate-400">{description}</p>}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:text-slate-100"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-2xl border border-rose-500/40 bg-rose-500/20 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:border-rose-400 hover:bg-rose-500/30"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ConfirmDialog;
