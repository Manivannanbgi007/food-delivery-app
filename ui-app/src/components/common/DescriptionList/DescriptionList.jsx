import { cn } from '@/utils/classNames';
import { NOT_AVAILABLE } from '@/utils/constants';

/** Labelled values of one record ("Email: ...", "Phone: ..."). */
export function DescriptionList({ items, columns = 2 }) {
  return (
    <dl className={cn('grid gap-x-8 gap-y-4', columns === 2 && 'sm:grid-cols-2')}>
      {items.map((item) => (
        <div key={item.label}>
          <dt className="text-xs text-ink-soft">{item.label}</dt>
          <dd className="mt-0.5 text-sm font-medium break-words">
            {item.value === null || item.value === undefined || item.value === ''
              ? NOT_AVAILABLE
              : item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
