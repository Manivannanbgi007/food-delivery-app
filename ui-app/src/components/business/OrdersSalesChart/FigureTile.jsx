import { cn } from '@/utils/classNames';
import { PALETTE } from '@/utils/palette';

/** A compact tinted tile of a list of key figures: a gradient icon, the figure's name, its value and a note. */
export function FigureTile({ icon: Icon, colour, label, hint, value, note, className }) {
  const look = PALETTE[colour];
  return (
    <li
      title={hint}
      className={cn('flex min-w-0 flex-col gap-0.5 rounded-2xl px-3 py-2.5', look.soft, className)}
    >
      <span className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className={cn(
            'flex size-6 shrink-0 items-center justify-center rounded-lg text-white shadow-md',
            look.fill,
            look.glow,
          )}
        >
          <Icon className="size-3.5" />
        </span>
        <span className={cn('truncate text-xs font-semibold', look.text)}>{label}</span>
      </span>
      <span className="truncate text-lg font-extrabold text-ink tabular-nums sm:text-xl">
        {value}
      </span>
      {note}
    </li>
  );
}

/** A short muted note under a figure; the whole sentence is its tooltip. */
export function FigureNote({ text, title }) {
  return (
    <span className="truncate text-xs text-ink-soft" title={title}>
      {text}
    </span>
  );
}
