import { createContext, useContext } from 'react';

/** success: green, error: red, warning: amber, info: blue. */

/**
 * How long each kind of toast stays by default (milliseconds). Errors and warnings stay longer: they usually say
 * what to do next. A toast can set its own time (showToast(..., { duration })), and an application can change
 * these (<ToastProvider durations={...}>).
 */
export const DEFAULT_TOAST_DURATIONS = {
  success: 4_000,
  info: 5_000,
  warning: 6_000,
  error: 7_000,
};

/** At most this many toasts at once: a new one makes the oldest leave, so the corner never fills the screen. */
export const MAX_VISIBLE_TOASTS = 4;

/** The exit animation (index.css .toast-leave) and the stack closing the gap, before a toast is removed. */
export const TOAST_EXIT_MS = 350;

export const ToastContext = createContext(null);

/** UI state (React Context): any component can show a toast without passing functions down. */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside <ToastProvider>');
  }
  return context;
}
