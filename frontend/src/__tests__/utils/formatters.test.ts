import { describe, it, expect } from 'vitest';
import { formatTime, getInitials, calcularPromedio } from '../../utils/formatters';

// ─── formatTime ───────────────────────────────────────────────────────────────

describe('formatTime', () => {
  it('returns "30 min" for 30 minutes', () => {
    expect(formatTime(30)).toBe('30 min');
  });

  it('returns "1h" for exactly 60 minutes', () => {
    expect(formatTime(60)).toBe('1h');
  });

  it('returns "1h 30min" for 90 minutes', () => {
    expect(formatTime(90)).toBe('1h 30min');
  });

  it('returns "2h" for 120 minutes', () => {
    expect(formatTime(120)).toBe('2h');
  });

  it('returns "2h 15min" for 135 minutes', () => {
    expect(formatTime(135)).toBe('2h 15min');
  });

  it('returns "1 min" for 1 minute', () => {
    expect(formatTime(1)).toBe('1 min');
  });

  it('returns "0 min" for 0 minutes', () => {
    expect(formatTime(0)).toBe('0 min');
  });

  it('returns "0 min" for negative numbers', () => {
    expect(formatTime(-5)).toBe('0 min');
  });
});

// ─── getInitials ──────────────────────────────────────────────────────────────

describe('getInitials', () => {
  it('extracts initials from a two-word name', () => {
    expect(getInitials('Keylor Pineda')).toBe('KP');
  });

  it('extracts initials from a three-word name', () => {
    expect(getInitials('Juan Carlos Mora')).toBe('JCM');
  });

  it('handles a single-word name', () => {
    expect(getInitials('Ana')).toBe('A');
  });

  it('returns empty string for an empty name', () => {
    expect(getInitials('')).toBe('');
  });

  it('handles extra spaces between words', () => {
    expect(getInitials('  María   José  ')).toBe('MJ');
  });

  it('uppercases the initials', () => {
    expect(getInitials('keylor pineda')).toBe('KP');
  });
});

// ─── calcularPromedio ─────────────────────────────────────────────────────────

describe('calcularPromedio', () => {
  it('returns the exact average for equal ratings', () => {
    expect(calcularPromedio([{ calificacion: 5 }, { calificacion: 5 }])).toBe(5);
  });

  it('returns the correct average for mixed ratings', () => {
    expect(calcularPromedio([{ calificacion: 4 }, { calificacion: 2 }])).toBe(3);
  });

  it('returns 0 for an empty array', () => {
    expect(calcularPromedio([])).toBe(0);
  });

  it('returns the single value for a one-element array', () => {
    expect(calcularPromedio([{ calificacion: 3 }])).toBe(3);
  });

  it('returns a decimal average when needed', () => {
    const avg = calcularPromedio([{ calificacion: 4 }, { calificacion: 5 }, { calificacion: 4 }]);
    expect(avg).toBeCloseTo(4.333, 2);
  });
});
