import { useEffect, useState } from 'react';
import api from '../api/axios';
import type { IRecipe } from '../types';
import RecipeCard from '../components/RecipeCard';
import SkeletonCard from '../components/SkeletonCard';

const CATEGORIAS = ['Todas', 'Italiana', 'Mexicana', 'Asiática', 'Mediterránea', 'Española', 'Francesa', 'Postres', 'Vegana'];
const DIFICULTADES = ['Todas', 'Fácil', 'Media', 'Difícil'];

export default function Home() {
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [dificultad, setDificultad] = useState('Todas');

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (categoria !== 'Todas') params.categoria = categoria;
    if (dificultad !== 'Todas') params.dificultad = dificultad;

    api
      .get<{ recetas: IRecipe[] }>('/api/recetas', { params })
      .then(({ data }) => setRecipes(data.recetas ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [categoria, dificultad]);

  const filtered = recipes.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return r.titulo.toLowerCase().includes(q) || r.tags.some((t) => t.toLowerCase().includes(q));
  });

  return (
    <main>
      {/* ── Hero asimétrico ── */}
      <section className="page-content" style={{ paddingBottom: 0 }}>
        <div className="container">
          <div className="hero__inner">
            <div className="hero__left">
              <span className="hero__label">Cocina de autor</span>
              <h1 className="hero__title">
                Recetas que
                <br />
                <em>te inspiran</em>
              </h1>
              <p className="hero__subtitle">Publica tus platos, descubre los de otros y construye tu recetario personal.</p>

              {/* Búsqueda */}
              <div className="search-bar">
                <span className="search-bar__icon">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
                <input className="form-input" type="search" placeholder="Buscar receta o etiqueta…" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>

              {/* Filtros */}
              <div className="filters">
                <select className="form-select" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                  {CATEGORIAS.map((c) => (
                    <option key={c} value={c}>
                      {c === 'Todas' ? 'Categoría' : c}
                    </option>
                  ))}
                </select>
                <select className="form-select" value={dificultad} onChange={(e) => setDificultad(e.target.value)}>
                  {DIFICULTADES.map((d) => (
                    <option key={d} value={d}>
                      {d === 'Todas' ? 'Dificultad' : d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Columna derecha — stats decorativas */}
            <div className="hero__right">
              <div className="hero__stat">
                <span className="hero__stat-n">{loading ? '—' : recipes.length}</span>
                <span className="hero__stat-label">recetas</span>
              </div>
              <div className="hero__stat">
                <span className="hero__stat-n">{CATEGORIAS.length - 1}</span>
                <span className="hero__stat-label">categorías</span>
              </div>
              <div className="hero__stat">
                <span className="hero__stat-n">3</span>
                <span className="hero__stat-label">niveles</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Grid de recetas ── */}
      <section className="page-content" style={{ paddingTop: '40px' }}>
        <div className="container">
          <div className="section-header">
            <h2>Recetas</h2>
            {!loading && (
              <span className="results-count">
                {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {loading ? (
            <div className="recipe-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} wide={i === 0} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">🍴</div>
              <h3>Sin resultados</h3>
              <p>Prueba con otros filtros o términos de búsqueda.</p>
            </div>
          ) : (
            <div className="recipe-grid">
              {filtered.map((recipe, i) => (
                <RecipeCard key={recipe._id} {...recipe} comentarios={[]} index={i} wide={i % 7 === 0} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
