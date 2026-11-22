import { cn } from '@/utils/classNames';
import { initialsOf } from '@/utils/formatUtils';
import { avatarTone } from '@/utils/reviewUtils';

/** The participant's initials in a circle (the colour follows the name), with a green dot while they are online. */
export function ChatAvatar({ name, online = null, sizeClass = 'size-11' }) {
  return (
    <span className="relative inline-flex shrink-0">
      <span
        aria-hidden="true"
        className={cn(
          'flex items-center justify-center rounded-full text-sm font-bold',
          sizeClass,
          avatarTone(name),
        )}
      >
        {initialsOf(name) || '?'}
      </span>
      {online === true && (
        <>
          <span
            aria-hidden="true"
            className="absolute right-0 bottom-0 size-3 rounded-full bg-brand-500 ring-2 ring-surface"
          />
          <span className="sr-only">Online</span>
        </>
      )}
    </span>
  );
}
