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
      {/* ── Hero ── */}
      <section className="hero">
        <div className="container">
          <span className="hero__eyebrow">✦ Cocina de autor</span>
          <h1 className="hero__title">
            Descubre recetas que
            <br />
            <em>te inspiran</em>
          </h1>
          <p className="hero__subtitle">Una colección editorial de recetas creadas con pasión. Del mercado a tu mesa.</p>

          {/* Búsqueda */}
          <div className="search-bar">
            <span className="search-bar__icon">🔍</span>
            <input className="form-input" type="search" placeholder="Buscar por nombre o etiqueta…" value={search} onChange={(e) => setSearch(e.target.value)} />
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

          <div className="hero__divider">temporada</div>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="page-content" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header">
            <h2>Recetas</h2>
            {!loading && <span className="results-count">{filtered.length} resultados</span>}
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
