import { Utensils } from 'lucide-react';

import { FoodPhoto } from '@/components/common/FoodPhoto';
import { cn } from '@/utils/classNames';
import { initialsOf } from '@/utils/formatUtils';

const SIZES = {
  sm: 'size-12 text-sm',
  md: 'size-16 text-lg',
  /** A dish in the customer's lists: smaller on a phone */
  row: 'size-20 text-xl sm:size-24',
  lg: 'size-28 text-2xl',
  xl: 'size-40 text-4xl sm:size-44',
};

/**
 * The dish's picture. Without one, or when it cannot be loaded: the picture of its category (when given), then
 * its initials (square look) or a utensils icon (round look, used on the cards).
 */
export function FoodThumbnail({
  item,
  size = 'sm',
  round = false,
  placeholder = 'initials',
  fallbackSrc,
}) {
  const shape = round ? 'rounded-full' : 'rounded-2xl';
  const placeholderTile = (
    <span
      aria-hidden="true"
      className={cn(
        'flex shrink-0 items-center justify-center bg-warning-50 font-bold text-warning-text',
        shape,
        SIZES[size],
      )}
    >
      {round || placeholder === 'utensils' ? (
        <Utensils className="size-1/3" />
      ) : (
        initialsOf(item.name)
      )}
    </span>
  );
  return (
    <FoodPhoto
      sources={[item.imageUrl, fallbackSrc]}
      fallback={placeholderTile}
      className={cn(shape, SIZES[size])}
    />
  );
}
