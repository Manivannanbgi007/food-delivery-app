import { useState } from 'react';

import { cn } from '@/utils/classNames';

/**
 * A food picture that never shows a broken-image icon: if one address cannot be loaded the next is tried, and
 * after the last the fallback is shown. Decorative (the name is always written next to it), so it has no alt text.
 */
export function FoodPhoto({ sources, fallback, className }) {
  const [failed, setFailed] = useState([]);
  const source = sources.find((candidate) => Boolean(candidate && !failed.includes(candidate)));

  if (!source) {
    return <>{fallback}</>;
  }
  return (
    <img
      src={source}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => setFailed((previous) => [...previous, source])}
      className={cn('shrink-0 object-cover', className)}
    />
  );
}
