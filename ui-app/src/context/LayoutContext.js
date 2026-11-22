import { createContext, useContext } from 'react';

export const LayoutContext = createContext(null);

/**
 * UI state (React Context) shared by the header (menu button) and the sidebar (closes after a click), without
 * passing it through the layout.
 */
export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used inside <LayoutProvider>');
  }
  return context;
}
