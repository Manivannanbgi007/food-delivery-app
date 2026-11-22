import { useSyncExternalStore } from 'react';

function subscribe(onChange) {
  document.addEventListener('visibilitychange', onChange);
  return () => document.removeEventListener('visibilitychange', onChange);
}

/** Whether the page is in front (its tab is shown), following the user switching tabs. */
export function usePageVisible() {
  return useSyncExternalStore(
    subscribe,
    () => document.visibilityState !== 'hidden',
    () => true,
  );
}
