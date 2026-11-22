import { Link } from 'react-router';

import { Badge } from '@/components/common/Badge';
import { EmptyState } from '@/components/common/EmptyState';
import { Table } from '@/components/common/Table';
import { PAYMENT_METHOD_LABELS, routeTo } from '@/utils/constants';
import { cancellationTone } from '@/utils/dashboardUtils';
import { formatCurrency, formatNumber, formatPercent } from '@/utils/formatUtils';

const rank = (rows, row) => rows.indexOf(row) + 1;

/** Restaurants of a report, in the report's order (most revenue, least revenue or most cancellations first). */
export function RestaurantRankTable({
  rows,
  currency,
  caption,
  emptyTitle = 'No orders in this period',
}) {
  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} />;
  }
  const columns = [
    {
      header: '#',
      render: (row) => (
        <span className="flex size-6 items-center justify-center rounded-full bg-page text-xs font-bold ring-1 ring-line">
          {rank(rows, row)}
        </span>
      ),
    },
    {
      header: 'Restaurant',
      // The name stays on one line (shortened when the column is narrow)
      className: 'max-w-56',
      render: (row) => (
        <Link
          to={routeTo.restaurantDetails(row.restaurantId)}
          title={row.restaurantName}
          className="block truncate font-semibold whitespace-nowrap text-brand-text hover:underline"
        >
          {row.restaurantName}
        </Link>
      ),
    },
    {
      // The orders and how many of them were delivered, in one column: the table fits half a page
      header: 'Delivered',
      align: 'right',
      className: 'whitespace-nowrap',
      render: (row) => (
        <span className="tabular-nums">
          <span className="font-semibold">{formatNumber(row.completed)}</span>
          <span className="text-ink-soft"> of {formatNumber(row.orders)}</span>
        </span>
      ),
    },
    { header: 'Revenue', align: 'right', render: (row) => formatCurrency(row.revenue, currency) },
    {
      header: 'Cancelled',
      align: 'right',
      render: (row) => (
        <Badge tone={cancellationTone(row.cancellationRate)}>
          {formatPercent(row.cancellationRate)}
        </Badge>
      ),
    },
  ];
  return (
    <Table
      compact
      caption={caption}
      columns={columns}
      rows={rows}
      rowKey={(row) => row.restaurantId}
    />
  );
}

export function CityTable({ rows, currency }) {
  if (rows.length === 0) {
    return <EmptyState title="No orders in this period" />;
  }
  const columns = [
    { header: 'City', render: (row) => <span className="font-semibold">{row.city}</span> },
    { header: 'Orders', align: 'right', render: (row) => formatNumber(row.orders) },
    { header: 'Delivered', align: 'right', render: (row) => formatNumber(row.completed) },
    { header: 'Revenue', align: 'right', render: (row) => formatCurrency(row.revenue, currency) },
  ];
  return (
    <Table
      compact
      caption="Orders by delivery city"
      columns={columns}
      rows={rows}
      rowKey={(row) => row.city}
    />
  );
}

export function CustomerRankTable({ rows, currency }) {
  if (rows.length === 0) {
    return <EmptyState title="No orders in this period" />;
  }
  const columns = [
    { header: '#', render: (row) => rank(rows, row) },
    {
      header: 'Customer',
      render: (row) => (
        <Link
          to={routeTo.customerDetails(row.customerId)}
          className="font-semibold text-brand-text hover:underline"
        >
          {row.customerName}
        </Link>
      ),
    },
    { header: 'Orders', align: 'right', render: (row) => formatNumber(row.orders) },
    { header: 'Delivered', align: 'right', render: (row) => formatNumber(row.completed) },
    { header: 'Spent', align: 'right', render: (row) => formatCurrency(row.spent, currency) },
  ];
  return (
    <Table
      compact
      caption="Customers who spent most"
      columns={columns}
      rows={rows}
      rowKey={(row) => row.customerId}
    />
  );
}

export function PartnerRankTable({ rows }) {
  if (rows.length === 0) {
    return <EmptyState title="No deliveries in this period" />;
  }
  const columns = [
    { header: '#', render: (row) => rank(rows, row) },
    {
      header: 'Partner',
      render: (row) => (
        <Link
          to={routeTo.partnerDetails(row.userId)}
          className="font-semibold text-brand-text hover:underline"
        >
          {row.name}
        </Link>
      ),
    },
    { header: 'Delivered', align: 'right', render: (row) => formatNumber(row.delivered) },
    {
      header: 'Average time',
      align: 'right',
      render: (row) =>
        row.averageDeliveryMinutes === null ? '—' : `${row.averageDeliveryMinutes} min`,
    },
    {
      header: 'Offers missed',
      align: 'right',
      render: (row) => (
        <Badge tone={row.offersMissed > 0 ? 'warning' : 'neutral'}>
          {formatNumber(row.offersMissed)}
        </Badge>
      ),
    },
  ];
  return (
    <Table
      compact
      caption="Partners with the most deliveries"
      columns={columns}
      rows={rows}
      rowKey={(row) => row.userId}
    />
  );
}

export function PaymentMethodTable({ byMethod, currency }) {
  const rows = Object.entries(byMethod).map(([method, row]) => ({ method, ...row }));
  if (rows.length === 0) {
    return <EmptyState title="No delivered orders in this period" />;
  }
  const columns = [
    {
      header: 'Method',
      render: (row) => (
        <span className="font-semibold">{PAYMENT_METHOD_LABELS[row.method] ?? row.method}</span>
      ),
    },
    { header: 'Orders', align: 'right', render: (row) => formatNumber(row.orders) },
    { header: 'Delivered', align: 'right', render: (row) => formatNumber(row.completed) },
    { header: 'Revenue', align: 'right', render: (row) => formatCurrency(row.revenue, currency) },
  ];
  return (
    <Table
      compact
      caption="Revenue by payment method"
      columns={columns}
      rows={rows}
      rowKey={(row) => row.method}
    />
  );
}
