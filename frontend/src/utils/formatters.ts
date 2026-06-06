/**
 * formatters.ts — pure utility functions for display formatting
 */

/**
 * Formats a duration in minutes as a human-readable string.
 * - Under 60 min  → "30 min"
 * - 60+ min       → "1h 30min"  (or "2h" when no remainder)
 */
export function formatTime(minutes: number): string {
  if (!minutes || minutes <= 0) return '0 min';
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

/**
 * Extracts initials from a full name.
 * "Keylor Pineda" → "KP"
 * "Ana" → "A"
 * "" or falsy → ""
 */
export function getInitials(name: string): string {
  if (!name?.trim()) return '';
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0].toUpperCase())
    .join('');
}

/**
 * Calculates the average calificación from an array of comment objects.
 * Returns 0 for an empty array or when the input is falsy.
 */
export function calcularPromedio(comentarios: { calificacion: number }[]): number {
  if (!comentarios?.length) return 0;
  const sum = comentarios.reduce((acc, c) => acc + c.calificacion, 0);
  return sum / comentarios.length;
}
