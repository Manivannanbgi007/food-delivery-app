/** Between the coupon form (text boxes) and the API (numbers, null for "not set"). */

const numberOrNull = (text) => (text.trim() === '' ? null : Number(text));

/** The form's values as the API's terms: empty boxes become null (no limit, every restaurant, ...). */
export function couponFormToTerms(form) {
  return {
    description: form.description.trim() === '' ? null : form.description.trim(),
    discountType: form.discountType,
    discountValue: Number(form.discountValue),
    maxDiscount: form.discountType === 'PERCENTAGE' ? numberOrNull(form.maxDiscount) : null,
    minOrderAmount: numberOrNull(form.minOrderAmount),
    restaurantId: numberOrNull(form.restaurantId),
    validFrom: form.validFrom,
    validUntil: form.validUntil,
    usageLimit: numberOrNull(form.usageLimit),
    perCustomerLimit: numberOrNull(form.perCustomerLimit),
  };
}

const text = (value) => (value === null ? '' : String(value));

/** A coupon's terms in the form, for changing them. */
export function couponToForm(coupon) {
  return {
    code: coupon.code,
    description: coupon.description ?? '',
    discountType: coupon.discountType,
    discountValue: String(coupon.discountValue),
    maxDiscount: text(coupon.maxDiscount),
    minOrderAmount: coupon.minOrderAmount > 0 ? String(coupon.minOrderAmount) : '',
    restaurantId: text(coupon.restaurantId),
    validFrom: coupon.validFrom,
    validUntil: coupon.validUntil,
    usageLimit: text(coupon.usageLimit),
    perCustomerLimit: text(coupon.perCustomerLimit),
  };
}

/** How many uses are left ("12 of 100 used"), or null when unlimited. */
export function usesLeft(coupon) {
  return coupon.usageLimit === null ? null : Math.max(0, coupon.usageLimit - coupon.timesUsed);
}
