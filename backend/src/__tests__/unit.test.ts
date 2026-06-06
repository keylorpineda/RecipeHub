/**
 * unit.test.ts — Pure unit tests (no DB, no HTTP)
 * Run with: npm run test:unit
 */

import { isValidEmail, isValidCalificacion, isTrimmedNonEmpty, isAuthorized } from '../utils/validators';
import { buildRecipeFilter } from '../utils/filters';

// ─── 1. Email validation ───────────────────────────────────────────────────────

describe('isValidEmail', () => {
  it('returns true for a valid email', () => {
    expect(isValidEmail('usuario@example.com')).toBe(true);
  });

  it('returns true for subdomains', () => {
    expect(isValidEmail('user@mail.example.co.cr')).toBe(true);
  });

  it('returns false when @ is missing', () => {
    expect(isValidEmail('usuarioexample.com')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });

  it('returns false for email with only @', () => {
    expect(isValidEmail('@')).toBe(false);
  });

  it('returns false for spaces around the email', () => {
    expect(isValidEmail('a b@c.com')).toBe(false);
  });
});

// ─── 2. Calificación validation ───────────────────────────────────────────────

describe('isValidCalificacion', () => {
  it('returns true for rating 1 (minimum)', () => {
    expect(isValidCalificacion(1)).toBe(true);
  });

  it('returns true for rating 3 (middle)', () => {
    expect(isValidCalificacion(3)).toBe(true);
  });

  it('returns true for rating 5 (maximum)', () => {
    expect(isValidCalificacion(5)).toBe(true);
  });

  it('returns false for rating 0 (below minimum)', () => {
    expect(isValidCalificacion(0)).toBe(false);
  });

  it('returns false for rating 6 (above maximum)', () => {
    expect(isValidCalificacion(6)).toBe(false);
  });

  it('returns false for a negative number', () => {
    expect(isValidCalificacion(-1)).toBe(false);
  });

  it('returns false for a string "5"', () => {
    expect(isValidCalificacion('5')).toBe(false);
  });

  it('returns false for null', () => {
    expect(isValidCalificacion(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isValidCalificacion(undefined)).toBe(false);
  });

  it('returns false for NaN', () => {
    expect(isValidCalificacion(NaN)).toBe(false);
  });
});

// ─── 3. Text sanitization / non-empty guard ───────────────────────────────────

describe('isTrimmedNonEmpty', () => {
  it('returns true for a normal string', () => {
    expect(isTrimmedNonEmpty('Pasta carbonara')).toBe(true);
  });

  it('returns false for an empty string', () => {
    expect(isTrimmedNonEmpty('')).toBe(false);
  });

  it('returns false for a string of only spaces', () => {
    expect(isTrimmedNonEmpty('   ')).toBe(false);
  });

  it('returns false for a string of only tabs and newlines', () => {
    expect(isTrimmedNonEmpty('\t\n')).toBe(false);
  });

  it('returns true for a string with leading/trailing spaces (content exists)', () => {
    expect(isTrimmedNonEmpty('  texto  ')).toBe(true);
  });
});

// ─── 4. Authorization logic ───────────────────────────────────────────────────

describe('isAuthorized', () => {
  const ownerId = 'abc123';

  it('returns true when requesting user is the owner', () => {
    expect(isAuthorized(ownerId, ownerId)).toBe(true);
  });

  it('returns false when requesting user is different', () => {
    expect(isAuthorized('xyz789', ownerId)).toBe(false);
  });

  it('compares as strings so ObjectId .toString() works', () => {
    // Mongoose ObjectIds stringify to their hex value
    const id = '507f1f77bcf86cd799439011';
    expect(isAuthorized(id, id)).toBe(true);
    expect(isAuthorized(id, '507f1f77bcf86cd799439012')).toBe(false);
  });

  it('returns false for empty string vs real id', () => {
    expect(isAuthorized('', ownerId)).toBe(false);
  });
});

// ─── 5. Recipe filter builder ─────────────────────────────────────────────────

describe('buildRecipeFilter', () => {
  it('returns empty object when no params are provided', () => {
    expect(buildRecipeFilter({})).toEqual({});
  });

  it('builds filter with categoria', () => {
    expect(buildRecipeFilter({ categoria: 'Desayuno' })).toEqual({ categoria: 'Desayuno' });
  });

  it('builds filter with dificultad', () => {
    expect(buildRecipeFilter({ dificultad: 'Fácil' })).toEqual({ dificultad: 'Fácil' });
  });

  it('builds filter with tags as single string', () => {
    expect(buildRecipeFilter({ tags: 'vegano' })).toEqual({ tags: { $in: ['vegano'] } });
  });

  it('builds filter with tags as array', () => {
    expect(buildRecipeFilter({ tags: ['vegano', 'saludable'] })).toEqual({
      tags: { $in: ['vegano', 'saludable'] },
    });
  });

  it('builds combined filter with multiple params', () => {
    const result = buildRecipeFilter({ categoria: 'Italiana', dificultad: 'Media', tags: 'pasta' });
    expect(result).toEqual({
      categoria: 'Italiana',
      dificultad: 'Media',
      tags: { $in: ['pasta'] },
    });
  });

  it('ignores unknown query params', () => {
    const result = buildRecipeFilter({ page: '1', limit: '10' } as Record<string, unknown>);
    expect(result).toEqual({});
  });

  it('picks first value when categoria is an array (Express parses duplicates)', () => {
    const result = buildRecipeFilter({ categoria: ['Italiana', 'Mexicana'] });
    expect(result).toEqual({ categoria: 'Italiana' });
  });
});
