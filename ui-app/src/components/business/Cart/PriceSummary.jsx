import { formatCurrency } from '@/utils/formatUtils';
import { amountForFreeDelivery } from '@/utils/shoppingUtils';

/** Items, discount, delivery, tax and the total, as order-service worked them out. */
export function PriceSummary({ price, couponCode, showFreeDeliveryHint = false }) {
  const money = (amount) => formatCurrency(amount, price.currency);
  const missing = showFreeDeliveryHint ? amountForFreeDelivery(price) : null;

  return (
    <div className="flex flex-col gap-3 text-sm">
      <dl className="flex flex-col gap-2">
        <Row label="Items" value={money(price.itemsTotal)} />
        {price.discountAmount > 0 && (
          <Row
            label={couponCode ? `Discount (${couponCode})` : 'Discount'}
            value={`− ${money(price.discountAmount)}`}
            className="text-brand-text"
          />
        )}
        <Row
          label="Delivery"
          value={
            price.deliveryFee === 0 && price.itemsTotal > 0 ? 'Free' : money(price.deliveryFee)
          }
        />
        <Row label="Taxes (5%)" value={money(price.taxAmount)} />
        <div className="mt-1 flex justify-between border-t border-line pt-3 text-base font-bold">
          <dt>Total</dt>
          <dd>{money(price.totalAmount)}</dd>
        </div>
      </dl>
      {missing !== null && (
        <p className="rounded-xl bg-brand-50 px-3 py-2 text-brand-text-strong">
          Add {money(missing)} more for free delivery.
        </p>
      )}
    </div>
  );
}

function Row({ label, value, className }) {
  return (
    <div className={`flex justify-between gap-4 ${className ?? ''}`}>
      <dt className="text-ink-soft">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
