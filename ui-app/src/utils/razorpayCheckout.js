/**
 * Razorpay Checkout (Standard Checkout, https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/):
 * Razorpay's own payment window. Card numbers, UPI PINs and bank logins are typed into Razorpay's window, never into
 * this app. Checkout only needs the public key id and the Razorpay order that payment-service created; the key
 * secret stays on the server.
 */
export const RAZORPAY_CHECKOUT_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js';

/** checkout.js could not be loaded (offline, or blocked by an ad or script blocker). */
export class RazorpayLoadError extends Error {
  constructor() {
    super('Razorpay Checkout could not be loaded');
    this.name = 'RazorpayLoadError';
  }
}

let loading = null;

/** Loads checkout.js once, when the customer is about to pay (not on every page of the app). */
export function loadRazorpayCheckout() {
  if (window.Razorpay) {
    return Promise.resolve(window.Razorpay);
  }
  loading ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = RAZORPAY_CHECKOUT_SCRIPT;
    script.async = true;
    const fail = () => {
      loading = null; // the next try loads it again
      script.remove();
      reject(new RazorpayLoadError());
    };
    script.onload = () => (window.Razorpay ? resolve(window.Razorpay) : fail());
    script.onerror = fail;
    document.body.appendChild(script);
  });
  return loading;
}

/** Opens Checkout for a session from payment-service and waits until the customer pays or closes it. */
export function openRazorpayCheckout(Razorpay, session, customer) {
  return new Promise((resolve) => {
    let lastFailure = null;
    const checkout = new Razorpay({
      key: session.keyId,
      amount: session.amount,
      currency: session.currency,
      name: session.merchantName,
      description: session.description,
      order_id: session.razorpayOrderId,
      prefill: { name: customer.name, email: customer.email, method: session.preferredMethod },
      notes: { orderId: String(session.orderId) },
      handler: (response) =>
        resolve({
          kind: 'paid',
          result: {
            razorpayOrderId: response.razorpay_order_id ?? session.razorpayOrderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          },
        }),
      modal: {
        // Asks "Are you sure?" before closing, so a payment in progress is not dropped by accident
        confirm_close: true,
        ondismiss: () =>
          resolve(
            lastFailure === null ? { kind: 'cancelled' } : { kind: 'failed', reason: lastFailure },
          ),
      },
    });
    checkout.on('payment.failed', (response) => {
      lastFailure = response.error.description ?? 'The payment failed.';
    });
    checkout.open();
  });
}
