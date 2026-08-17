/** Soft email validation — empty/null is allowed (email is optional). */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const EMAIL_ERROR = "Enter a valid email address";

/** Trim + lowercase. Empty input becomes null. */
export function normalizeEmail(raw) {
  const value = String(raw ?? "").trim().toLowerCase();
  return value || null;
}

export function isValidEmail(email) {
  return EMAIL_RE.test(String(email ?? ""));
}

/**
 * Normalize optional email from a request body.
 * Returns { email: string|null } or { error: string } when non-empty but invalid.
 */
export function parseOptionalEmail(raw) {
  const email = normalizeEmail(raw);
  if (email && !isValidEmail(email)) return { error: EMAIL_ERROR };
  return { email };
}
