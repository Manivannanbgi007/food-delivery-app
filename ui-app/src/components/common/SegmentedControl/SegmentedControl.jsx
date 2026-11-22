import { useId, useRef } from 'react';

import { cn } from '@/utils/classNames';

/**
 * A small pill-shaped switch between a few views of the same data (Monthly | Weekly | Daily). Tab semantics: the
 * arrow keys move between the segments, and only the selected one is in the tab order.
 */
export function SegmentedControl({ label, options, value, onChange, panelId }) {
  const baseId = useId();
  const buttons = useRef([]);

  const moveWithArrows = (event, index) => {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (step === 0) {
      return;
    }
    event.preventDefault();
    const next = (index + step + options.length) % options.length;
    onChange(options[next].id);
    buttons.current[next]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      className="inline-flex items-center gap-1 rounded-full bg-page p-1"
    >
      {options.map((option, index) => {
        const selected = option.id === value;
        return (
          <button
            key={option.id}
            ref={(element) => {
              buttons.current[index] = element;
            }}
            id={`${baseId}-${option.id}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={panelId}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.id)}
            onKeyDown={(event) => moveWithArrows(event, index)}
            className={cn(
              'cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition duration-200',
              'focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:outline-none',
              selected
                ? 'bg-surface text-brand-text-strong shadow-sm'
                : 'text-ink-soft hover:text-ink',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
