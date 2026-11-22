import { Link } from 'react-router';

import {
  HEADER_ITEM,
  HEADER_TILE,
  ICON_MOTIONS,
} from '@/components/common/HeaderIcon/headerIconStyles';
import { useTooltip } from '@/components/common/Tooltip';
import { cn } from '@/utils/classNames';

/** An icon in the header (notifications, coupons, the cart): a white tile that turns green on hover. */
export function HeaderIconLink({ to, label, icon: Icon, count, motion = 'pop', pulse = false }) {
  const hasCount = count !== undefined && count > 0;
  const { trigger, tooltip, hide } = useTooltip({ label, icon: Icon });
  return (
    <>
      <Link to={to} aria-label={label} className={HEADER_ITEM} {...trigger} onClick={hide}>
        <span className={HEADER_TILE}>
          <Icon aria-hidden="true" className={cn('size-5', ICON_MOTIONS[motion])} />
        </span>
        {hasCount && (
          <span aria-hidden="true" className="absolute -top-1.5 -right-1.5 z-10 flex">
            {pulse && (
              <span className="absolute inset-0 animate-ping rounded-full bg-danger-500/50 motion-reduce:hidden" />
            )}
            <span className="relative flex h-5 min-w-5 items-center justify-center rounded-full bg-danger-500 px-1 text-[10px] font-bold text-white ring-2 ring-surface">
              {count > 99 ? '99+' : count}
            </span>
          </span>
        )}
      </Link>
      {tooltip}
    </>
  );
}
