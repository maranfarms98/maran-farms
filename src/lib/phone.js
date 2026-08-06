/** Indian mobile numbers are stored as exactly 10 digits, without a country code. */
const MOBILE_LENGTH = 10;

export const PHONE_ERROR = "Phone must be a 10-digit Indian mobile number";

/** Strips formatting, a +91 country code, or a leading trunk 0. */
export function normalizePhone(raw) {
  const digits = String(raw ?? "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

export function isValidMobile(phone) {
  return /^\d{10}$/.test(String(phone ?? ""));
}

/** For controlled phone inputs: digits only, capped at 10. */
export function toPhoneInput(value) {
  return String(value ?? "").replace(/\D/g, "").slice(0, MOBILE_LENGTH);
}
