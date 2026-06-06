import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import type { IRecipe } from '../types';
import RecipeCard from '../components/RecipeCard';
import SkeletonCard from '../components/SkeletonCard';

const CATEGORIAS = ['Todas', 'Italiana', 'Mexicana', 'Asiática', 'Mediterránea', 'Española', 'Francesa', 'Postres', 'Vegana'];
const DIFICULTADES = ['Todas', 'Fácil', 'Media', 'Difícil'];

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <span className="site-footer__logo">RecipeHub</span>
          <p className="site-footer__tagline">
            Una plataforma editorial dedicada a la alta cocina, recetas de autor
            y el arte de compartir la mesa.
          </p>
        </div>
        <div>
          <p className="site-footer__heading">Explorar</p>
          <div className="site-footer__links">
            <Link to="/" className="site-footer__link">Todas las recetas</Link>
            <Link to="/nueva" className="site-footer__link">Publicar receta</Link>
            <Link to="/perfil" className="site-footer__link">Mi perfil</Link>
          </div>
        </div>
        <div>
          <p className="site-footer__heading">Cuenta</p>
          <div className="site-footer__links">
            <Link to="/login" className="site-footer__link">Iniciar sesión</Link>
            <Link to="/register" className="site-footer__link">Registrarse</Link>
          </div>
        </div>
      </div>
      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} RecipeHub — Todos los derechos reservados</span>
        <span style={{ fontStyle: 'italic', letterSpacing: '0.04em' }}>
          Alta cocina, compartida.
        </span>
      </div>
    </footer>
  );
}

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

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const featured  = sorted[0] ?? null;
  const secondary = sorted[1] ?? null;
  const rest      = sorted.slice(2);

  return (
    <>
      <main style={{ flex: 1 }}>
        {/* ═══════════════════════════════════════════════
            HERO — split editorial
            ═══════════════════════════════════════════════ */}
        <section
          style={{ paddingTop: 'calc(56px + 44px)' }}
          aria-label="Receta destacada"
        >
          {!loading && featured ? (
            <div className="hero__split">
              {/* Left — image */}
              <div className="hero__split-image">
                {featured.imagenUrl ? (
                  <img src={featured.imagenUrl} alt={featured.titulo} />
                ) : (
                  <div style={{
                    width: '100%', height: '100%', minHeight: 520,
                    background: 'var(--color-surface-mid)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '5rem', color: 'var(--color-border-strong)',
                  }}>🍽️</div>
                )}
              </div>

              {/* Right — editorial content */}
              <div className="hero__split-content">
                <span className="hero__split-eyebrow">Receta destacada</span>

                <h2 className="hero__split-title">
                  {featured.titulo}
                  {featured.dificultad === 'Fácil' && <em> — sencilla y deliciosa</em>}
                </h2>

                {featured.descripcion && (
                  <p className="hero__split-desc">
                    {featured.descripcion.slice(0, 180)}
                    {featured.descripcion.length > 180 ? '…' : ''}
                  </p>
                )}

                <div className="hero__split-meta">
                  <div className="hero__split-meta-item">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                    </svg>
                    <strong>{featured.tiempoMin}</strong>&nbsp;min
                  </div>
                  <div className="hero__split-meta-item">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <strong>{featured.porciones}</strong>&nbsp;porciones
                  </div>
                  <div className="hero__split-meta-item">
                    <strong>{featured.categoria}</strong>
                  </div>
                </div>

                <Link to={`/recetas/${featured._id}`} className="btn btn-primary btn-lg">
                  Leer la receta
                </Link>

                <p className="hero__issue">
                  por <em>{featured.autorId.nombre}</em>
                </p>
              </div>
            </div>
          ) : loading ? (
            /* Skeleton hero */
            <div className="hero__split" style={{ background: 'var(--color-surface)' }}>
              <div className="skeleton" style={{ minHeight: 520 }} />
              <div style={{ padding: '56px 64px', display: 'flex', flexDirection: 'column', gap: 20, background: 'var(--color-bg-secondary)' }}>
                <div className="skeleton" style={{ height: 12, width: '40%' }} />
                <div className="skeleton" style={{ height: 36, width: '90%' }} />
                <div className="skeleton" style={{ height: 36, width: '75%' }} />
                <div className="skeleton" style={{ height: 14, width: '60%', marginTop: 8 }} />
                <div className="skeleton" style={{ height: 14, width: '80%' }} />
              </div>
            </div>
          ) : null}
        </section>

        {/* ═══════════════════════════════════════════════
            SECONDARY FEATURE + FILTERS
            ═══════════════════════════════════════════════ */}
        <section style={{ background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)' }}>
          <div className="container" style={{ paddingTop: 32, paddingBottom: 32 }}>
            <div style={{ display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Secondary featured mini-card */}
              {secondary && !loading && (
                <Link
                  to={`/recetas/${secondary._id}`}
                  style={{
                    display: 'flex', gap: 20, alignItems: 'center',
                    flex: '0 0 auto', maxWidth: 420,
                    textDecoration: 'none', color: 'inherit',
                    borderRight: '1px solid var(--color-border)',
                    paddingRight: 40,
                  }}
                >
                  {secondary.imagenUrl && (
                    <div style={{
                      width: 80, height: 80, flexShrink: 0,
                      overflow: 'hidden', background: 'var(--color-surface)',
                    }}>
                      <img src={secondary.imagenUrl} alt={secondary.titulo}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div>
                    <span style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                      También destacado
                    </span>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, lineHeight: 1.2, marginTop: 5, color: 'var(--color-ink)' }}>
                      {secondary.titulo}
                    </p>
                    <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginTop: 4, display: 'block' }}>
                      {secondary.tiempoMin} min · {secondary.categoria}
                    </span>
                  </div>
                </Link>
              )}

              {/* Search & filters */}
              <div style={{ flex: 1, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <div className="search-bar" style={{ flex: '1 1 240px', marginBottom: 0 }}>
                  <span className="search-bar__icon">
                    <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
                      <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
                      <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                  <input
                    className="form-input"
                    type="search"
                    placeholder="Buscar receta o etiqueta…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <select className="form-select" value={categoria} onChange={(e) => setCategoria(e.target.value)} style={{ flex: '0 1 165px' }}>
                  {CATEGORIAS.map((c) => <option key={c} value={c}>{c === 'Todas' ? 'Categoría' : c}</option>)}
                </select>
                <select className="form-select" value={dificultad} onChange={(e) => setDificultad(e.target.value)} style={{ flex: '0 1 155px' }}>
                  {DIFICULTADES.map((d) => <option key={d} value={d}>{d === 'Todas' ? 'Dificultad' : d}</option>)}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            RECIPE GRID
            ═══════════════════════════════════════════════ */}
        <section style={{ paddingTop: 56, paddingBottom: 0 }}>
          <div className="container">
            <div className="section-header">
              <h2>
                {loading
                  ? 'Cargando…'
                  : categoria !== 'Todas' || dificultad !== 'Todas' || search
                  ? 'Resultados'
                  : 'Las más recientes'}
              </h2>
              {!loading && (
                <span className="results-count">
                  {filtered.length} receta{filtered.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {loading ? (
              <div className="recipe-grid">
                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__icon">🍴</div>
                <h3>Sin resultados</h3>
                <p>Prueba con otros filtros o términos de búsqueda.</p>
              </div>
            ) : (
              <div className="recipe-grid">
                {/* If searching, show all filtered; otherwise skip featured+secondary */}
                {(search || categoria !== 'Todas' || dificultad !== 'Todas' ? filtered : rest).map(
                  (recipe, i) => (
                    <RecipeCard
                      key={recipe._id}
                      {...recipe}
                      comentarios={[]}
                      index={i}
                      wide={false}
                    />
                  )
                )}
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            EDITORIAL PULL QUOTE
            ═══════════════════════════════════════════════ */}
        {!loading && filtered.length > 0 && (
          <section style={{ padding: '72px 0', background: 'var(--color-bg-secondary)', marginTop: 72, borderTop: '1px solid var(--color-border)' }}>
            <div className="container" style={{ maxWidth: 760, textAlign: 'center' }}>
              {/* Ornamental divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--color-gold)', fontStyle: 'italic' }}>✦</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
              </div>

              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.3rem, 2.5vw, 2rem)',
                fontStyle: 'italic',
                fontWeight: 400,
                lineHeight: 1.55,
                color: 'var(--color-ink)',
                letterSpacing: '-0.01em',
                marginBottom: 28,
              }}>
                "La cocina es el único lugar donde puedes crear algo hermoso
                <br />con tus propias manos y compartirlo con quien amas."
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 28 }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
                <Link to="/nueva" className="btn btn-primary">
                  Publica tu receta
                </Link>
                <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
              </div>
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </>
  );
}
