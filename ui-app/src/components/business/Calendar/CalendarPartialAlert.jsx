import { Alert } from '@/components/common/Alert';
import { SERVICE_LABELS } from '@/utils/constants';
import { EVENT_TYPE_LABELS } from '@/utils/calendarUtils';

/**
 * admin-service answers with what it has when a part is down and lists the missing event types in `unavailable`
 * (the same idea as PartialDataAlert, worded for events: a gap in the calendar is not "no events").
 */
export function CalendarPartialAlert({ unavailable }) {
  if (unavailable.length === 0) {
    return null;
  }
  const names = unavailable.map((key) => EVENT_TYPE_LABELS[key] ?? SERVICE_LABELS[key] ?? key);
  return (
    <Alert tone="warning" title="Some events could not be loaded">
      {names.join(', ')} could not be loaded. Days may have more events than shown; the rest is up
      to date.
    </Alert>
  );
}
