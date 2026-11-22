import { useState } from 'react';

export const FOOD_VIEW_STORAGE_KEY = 'foods.view';

function readSaved() {
  try {
    return localStorage.getItem(FOOD_VIEW_STORAGE_KEY) === 'list' ? 'list' : 'grid';
  } catch {
    return 'grid';
  }
}

/** The food list's look (cards or table), kept in this browser; cards when nothing is saved or storage is blocked. */
export function useFoodViewMode() {
  const [mode, setMode] = useState(readSaved);
  const change = (next) => {
    setMode(next);
    try {
      localStorage.setItem(FOOD_VIEW_STORAGE_KEY, next);
    } catch {
      // Private window or blocked storage: the choice just is not remembered
    }
  };
  return [mode, change];
}
