import { useSyncExternalStore } from 'react';

import { getPageLoading, subscribeToPageLoading } from '@/utils/pageLoadTracker';

/** Pages whose code is downloading, and page loaders on screen (see utils/pageLoadTracker.js). */
export function usePageLoading() {
  return useSyncExternalStore(subscribeToPageLoading, getPageLoading, getPageLoading);
}
