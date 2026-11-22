import { Star } from 'lucide-react';
import { useRef } from 'react';

import { cn } from '@/utils/classNames';

const STARS = [1, 2, 3, 4, 5];

/**
 * Five stars to choose from: a radio group for the keyboard (Tab into it, arrow keys change the rating) and
 * screen readers ("3 stars, radio button, 3 of 5").
 */
export function StarRatingInput({
  label,
  value,
  onChange,
  clearable = false,
  size = 'md',
  invalid = false,
  describedBy,
}) {
  const refs = useRef([]);

  const choose = (star) => {
    onChange(clearable && star === value ? 0 : star);
  };

  const move = (event, star) => {
    const step =
      event.key === 'ArrowRight' || event.key === 'ArrowUp'
        ? 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowDown'
          ? -1
          : 0;
    if (step === 0) {
      return;
    }
    event.preventDefault();
    const next = Math.min(5, Math.max(1, star + step));
    onChange(next);
    refs.current[next - 1]?.focus();
  };

  // The tab stop: the chosen star, or the first while nothing is chosen
  const tabStop = value > 0 ? value : 1;

  return (
    <div
      role="radiogroup"
      aria-label={label}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      className="inline-flex items-center gap-1"
    >
      {STARS.map((star) => (
        <button
          key={star}
          ref={(element) => {
            refs.current[star - 1] = element;
          }}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={star === 1 ? '1 star' : `${star} stars`}
          tabIndex={star === tabStop ? 0 : -1}
          onClick={() => choose(star)}
          onKeyDown={(event) => move(event, star)}
          className={cn(
            'cursor-pointer rounded-md p-0.5 transition duration-150 motion-safe:hover:scale-110',
            'focus-visible:ring-4 focus-visible:ring-brand-500/30 focus-visible:outline-none',
            invalid && 'ring-1 ring-danger-500/50',
          )}
        >
          <Star
            aria-hidden="true"
            className={cn(
              size === 'lg' ? 'size-8' : 'size-6',
              star <= value ? 'fill-warning-500 text-warning-500' : 'text-ink-soft/40',
            )}
          />
        </button>
      ))}
    </div>
  );
}
