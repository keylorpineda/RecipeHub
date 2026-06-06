/**
 * validators.ts — pure validation functions (no DB, no HTTP)
 */

/** Returns true if the string is a syntactically valid email. */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  // Simple but solid RFC-5322-compatible regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Returns true if value is a number in the closed interval [1, 5].
 * Rejects non-numeric, NaN, and out-of-range values.
 */
export function isValidCalificacion(value: unknown): boolean {
  if (typeof value !== 'number') return false;
  if (!Number.isFinite(value)) return false;
  return value >= 1 && value <= 5;
}

/**
 * Returns true if the string is non-empty after trimming whitespace.
 * Works as a guard for required text fields.
 */
export function isTrimmedNonEmpty(text: string): boolean {
  return typeof text === 'string' && text.trim().length > 0;
}

/**
 * Returns true when the requesting user owns the resource.
 * Compares as strings so Mongoose ObjectId instances work too.
 */
export function isAuthorized(requestingUserId: string, resourceOwnerId: string): boolean {
  return String(requestingUserId) === String(resourceOwnerId);
}
