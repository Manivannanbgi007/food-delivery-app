import { logger } from '@/utils/logger';

export const THEMES = ['light', 'dark'];

/**
 * Where the chosen theme is kept: this browser (localStorage), so it is still there after a refresh and on the next
 * visit. The small script in index.html reads the same key before the first paint: keep them in step.
 */
export const THEME_STORAGE_KEY = 'front-app.theme';

export function isTheme(value) {
  return THEMES.includes(value);
}

/** The theme the user chose earlier, or null (never chose, or storage is blocked). */
export function loadTheme() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(saved) ? saved : null;
  } catch (error) {
    // Private window or site data blocked: the theme then follows the system
    logger.debug('The saved theme could not be read', error);
    return null;
  }
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    // The choice still applies until the page is closed
    logger.debug('The theme could not be saved', error);
  }
}

/** The system's own preference (the operating system or browser setting). */
export function systemTheme() {
  const query =
    typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-color-scheme: dark)')
      : null;
  return query?.matches ? 'dark' : 'light';
}
