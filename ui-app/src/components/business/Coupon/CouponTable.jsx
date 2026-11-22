import { Link } from 'react-router';

import { CouponAvailabilityBadge } from '@/components/business/StatusBadges';
import { Table } from '@/components/common/Table';
import { routeTo } from '@/utils/constants';
import { formatDate } from '@/utils/dateUtils';
import { formatNumber } from '@/utils/formatUtils';

const COLUMNS = [
  {
    header: 'Coupon',
    render: (coupon) => (
      <Link to={routeTo.couponDetails(coupon.id)} className="group block">
        <span className="block font-mono font-bold tracking-wide group-hover:text-brand-text group-hover:underline">
          {coupon.code}
        </span>
        <span className="block text-xs text-ink-soft">{coupon.summary}</span>
      </Link>
    ),
  },
  {
    header: 'Restaurant',
    render: (coupon) =>
      coupon.restaurantId === null ? (
        'Every restaurant'
      ) : (
        <Link to={routeTo.restaurantDetails(coupon.restaurantId)} className="hover:underline">
          #{coupon.restaurantId}
        </Link>
      ),
  },
  {
    header: 'Valid',
    render: (coupon) => `${formatDate(coupon.validFrom)} - ${formatDate(coupon.validUntil)}`,
  },
  {
    header: 'Used',
    align: 'right',
    render: (coupon) =>
      `${formatNumber(coupon.timesUsed)} / ${coupon.usageLimit === null ? '∞' : formatNumber(coupon.usageLimit)}`,
  },
  {
    header: 'Today',
    render: (coupon) => <CouponAvailabilityBadge availability={coupon.availability} />,
  },
];

/** Coupons as a table; the code opens the coupon. "Today" says whether it can be used today. */
export function CouponTable({ coupons, isUpdating }) {
  return (
    <Table
      caption="Coupons"
      columns={COLUMNS}
      rows={coupons}
      rowKey={(coupon) => coupon.id}
      isUpdating={isUpdating}
    />
  );
}
