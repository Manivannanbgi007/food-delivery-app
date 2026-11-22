import { useState } from 'react';

import { CALENDAR_VIEWS } from '@/types/calendar';

export const CALENDAR_VIEW_STORAGE_KEY = 'calendar.view';

function readSaved() {
  try {
    const saved = localStorage.getItem(CALENDAR_VIEW_STORAGE_KEY);
    return CALENDAR_VIEWS.find((view) => view === saved) ?? 'MONTH';
  } catch {
    return 'MONTH';
  }
}

/** The calendar's view (Date, Week, Month, Year), kept in this browser; Month when nothing is saved. */
export function useCalendarView() {
  const [view, setView] = useState(readSaved);
  const change = (next) => {
    setView(next);
    try {
      localStorage.setItem(CALENDAR_VIEW_STORAGE_KEY, next);
    } catch {
      // Private window or blocked storage: the choice just is not remembered
    }
  };
  return [view, change];
}
