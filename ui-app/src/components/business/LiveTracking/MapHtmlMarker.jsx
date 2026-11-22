import L from 'leaflet';
import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Marker } from 'react-leaflet';

import { cn } from '@/utils/classNames';

/**
 * A Leaflet marker drawn by React: the marker's element is an empty box that Leaflet places on the map, and the
 * React content (Tailwind classes, icons) is rendered into it through a portal. Moving the marker only moves the box,
 * so the content keeps its state and transitions (the partner's heading arrow turns smoothly).
 */
export function MapHtmlMarker({ position, title, anchor = 'pin', zIndexOffset = 0, children }) {
  const container = useMemo(() => document.createElement('div'), []);
  // A zero-size box at the point; the content hangs from it (no Leaflet default white square)
  const icon = useMemo(
    () => L.divIcon({ html: container, className: '', iconSize: [0, 0], iconAnchor: [0, 0] }),
    [container],
  );

  return (
    <>
      <Marker
        position={position}
        icon={icon}
        title={title}
        keyboard={false}
        zIndexOffset={zIndexOffset}
      />
      {createPortal(
        <div
          className={cn(
            'w-max',
            anchor === 'pin' ? '-translate-x-1/2 -translate-y-full' : '-translate-1/2',
          )}
        >
          {children}
        </div>,
        container,
      )}
    </>
  );
}
