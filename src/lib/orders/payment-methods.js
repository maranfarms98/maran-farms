export const PHONE_PAYMENT_METHODS = ["cash", "cash_on_delivery", "manual_upi"];
export const ALL_PAYMENT_METHODS = ["razorpay", ...PHONE_PAYMENT_METHODS];

export const PAYMENT_METHOD_LABELS = {
  razorpay: "Razorpay",
  cash: "Cash",
  cash_on_delivery: "Cash on delivery",
  manual_upi: "Manual UPI",
};

export function isPhonePaymentMethod(method) {
  return PHONE_PAYMENT_METHODS.includes(method);
}

/** Default "payment received?" for phone order form by method. */
export function defaultPaidNow(paymentMethod) {
  return paymentMethod === "cash" || paymentMethod === "manual_upi";
}
