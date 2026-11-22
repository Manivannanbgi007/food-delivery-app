import { CalendarDays } from 'lucide-react';

import { Select } from '@/components/common/Select';
import { DASHBOARD_PERIOD_OPTIONS } from '@/utils/constants';
import { formatDate } from '@/utils/dateUtils';

/** "Filter Period": which days the dashboard covers. */
export function PeriodFilter({ days, onChange, fromDate, toDate }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-surface px-5 py-3 shadow-card">
      <span className="flex size-11 items-center justify-center rounded-xl bg-info-50 text-info-500">
        <CalendarDays aria-hidden="true" className="size-5" />
      </span>
      <div>
        <Select
          variant="inline"
          label="Filter Period"
          options={DASHBOARD_PERIOD_OPTIONS.map((option) => ({
            value: String(option),
            label: `Last ${option} days`,
          }))}
          value={String(days)}
          onChange={(event) => onChange(toPeriodDays(event.target.value))}
          className="-ml-1 px-1"
        />
        {fromDate && toDate && (
          <p className="text-xs text-ink-soft">
            {formatDate(fromDate)} - {formatDate(toDate)}
          </p>
        )}
      </div>
    </div>
  );
}

function toPeriodDays(value) {
  const days = Number(value);
  return DASHBOARD_PERIOD_OPTIONS.find((option) => option === days) ?? DASHBOARD_PERIOD_OPTIONS[0];
}
