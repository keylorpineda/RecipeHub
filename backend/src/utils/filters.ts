/**
 * filters.ts — pure filter-building functions for recipe queries
 */

interface RecipeQuery {
  categoria?: string | string[];
  dificultad?: string | string[];
  tags?: string | string[];
  [key: string]: unknown;
}

/**
 * Builds a Mongoose-compatible filter object from an Express query.
 * Returns {} when no recognized parameters are present.
 */
export function buildRecipeFilter(query: RecipeQuery): Record<string, unknown> {
  const filter: Record<string, unknown> = {};

  if (query.categoria) {
    filter.categoria = Array.isArray(query.categoria) ? query.categoria[0] : query.categoria;
  }

  if (query.dificultad) {
    filter.dificultad = Array.isArray(query.dificultad) ? query.dificultad[0] : query.dificultad;
  }

  if (query.tags) {
    const tags = Array.isArray(query.tags) ? query.tags : [query.tags];
    filter.tags = { $in: tags };
  }

  return filter;
}
