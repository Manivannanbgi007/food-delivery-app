import { useCallback, useMemo, useRef, useState } from 'react';

import { Toaster } from '@/components/common/Toast/Toaster';
import { DEFAULT_TOAST_DURATIONS, MAX_VISIBLE_TOASTS, ToastContext } from '@/context/ToastContext';

/** Holds the toasts on screen and draws them (Toaster). Wraps the whole application in main.jsx. */
export function ToastProvider({ children, durations, maxVisible = MAX_VISIBLE_TOASTS }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(1);

  /** Starts the exit animation; the Toaster removes the toast when it is over. */
  const dismiss = useCallback((id) => {
    setToasts((current) =>
      current.map((toast) => (toast.id === id ? { ...toast, leaving: true } : toast)),
    );
  }, []);

  const remove = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, tone = 'success', options = {}) => {
      const id = nextId.current++;
      const duration = Math.max(
        0,
        options.duration ?? durations?.[tone] ?? DEFAULT_TOAST_DURATIONS[tone],
      );
      setToasts((current) => {
        const next = [...current, { id, tone, message, duration, leaving: false }];
        // Over the limit: the oldest ones still on screen leave (with their exit animation)
        const tooMany = next.filter((toast) => !toast.leaving).length - maxVisible;
        if (tooMany <= 0) {
          return next;
        }
        const leaving = new Set(
          next
            .filter((toast) => !toast.leaving)
            .slice(0, tooMany)
            .map((toast) => toast.id),
        );
        return next.map((toast) => (leaving.has(toast.id) ? { ...toast, leaving: true } : toast));
      });
    },
    [durations, maxVisible],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext value={value}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} onRemove={remove} />
    </ToastContext>
  );
}
