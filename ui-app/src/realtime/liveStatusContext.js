import { createContext, useContext } from 'react';

/** The state of the live connection, for parts of the screen that show "Live" (see LiveUpdatesProvider). */
export const LiveStatusContext = createContext('closed');

export function useLiveStatus() {
  return useContext(LiveStatusContext);
}
