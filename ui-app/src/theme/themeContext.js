import { createContext, useContext } from 'react';

/** Without a provider (a test of one component) the theme is light and switching does nothing. */
export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => undefined,
  setTheme: () => undefined,
});

/** The current theme and how to change it: `const { theme, toggleTheme } = useTheme();` */
export function useTheme() {
  return useContext(ThemeContext);
}
