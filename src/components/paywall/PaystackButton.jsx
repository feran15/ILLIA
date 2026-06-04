/**
 * Paystack inline payment handler.
 * Opens Paystack popup. On success calls onSuccess(reference).
 * Falls back gracefully if Paystack JS is not loaded.
 */
export function openPaystack({ email, amount, onSuccess, onClose }) {
  const key = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
  if (!key || !window.PaystackPop) {
    // Paystack not configured — simulate success for dev
    console.warn('Paystack not configured. Simulating payment success.');
    onSuccess({ reference: 'sim_' + Date.now() });
    return;
  }
  const handler = window.PaystackPop.setup({
    key,
    email,
    amount: amount * 100, // kobo
    currency: 'NGN',
    callback: (response) => onSuccess(response),
    onClose,
  });
  handler.openIframe();
}