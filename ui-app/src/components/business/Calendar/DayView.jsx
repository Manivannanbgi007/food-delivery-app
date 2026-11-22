import { DayEventList } from '@/components/business/Calendar/DayEventList';
import { longDate } from '@/utils/calendarUtils';
import { cn } from '@/utils/classNames';
import { parseIsoDate } from '@/utils/dateUtils';

/** One day as an agenda: what happens, with the details and the links. */
export function DayView({ date, today, events }) {
  return (
    <div className="mx-auto flex max-w-column flex-col gap-4">
      <p
        className={cn(
          'rounded-xl px-4 py-3 text-sm font-semibold',
          date === today ? 'bg-brand-50 text-brand-text-strong' : 'bg-page text-ink-soft',
        )}
      >
        {longDate(parseIsoDate(date))}
        {date === today && ' (today)'}
      </p>
      <DayEventList date={date} events={events} />
    </div>
  );
}
