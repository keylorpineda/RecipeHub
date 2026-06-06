import { Link } from 'react-router-dom';
import type { IComment } from '../types';

interface RecipeCardProps {
  _id: string;
  titulo: string;
  imagenUrl: string;
  tiempoMin: number;
  dificultad: 'Fácil' | 'Media' | 'Difícil';
  categoria: string;
  descripcion?: string;
  porciones?: number;
  comentarios?: Pick<IComment, 'calificacion'>[];
  index?: number;
  wide?: boolean;
}

const difficultyLabel: Record<string, string> = {
  Fácil: 'easy',
  Media: 'medium',
  Difícil: 'hard',
};

function avgRating(comentarios?: Pick<IComment, 'calificacion'>[]) {
  if (!comentarios?.length) return null;
  const avg = comentarios.reduce((s, c) => s + c.calificacion, 0) / comentarios.length;
  return avg.toFixed(1);
}

export default function RecipeCard({
  _id,
  titulo,
  imagenUrl,
  tiempoMin,
  dificultad,
  categoria,
  descripcion,
  comentarios,
  index = 0,
}: RecipeCardProps) {
  const rating = avgRating(comentarios);
  const delay = `${Math.min(index * 60, 480)}ms`;
  const diff = difficultyLabel[dificultad] ?? 'easy';

  return (
    <Link
      to={`/recetas/${_id}`}
      className="recipe-card"
      style={{ animationDelay: delay }}
      aria-label={`Ver receta: ${titulo}`}
    >
      {/* ── Image block ── */}
      <figure className="recipe-card__figure">
        {imagenUrl ? (
          <img
            src={imagenUrl}
            alt={titulo}
            className="recipe-card__image"
            loading="lazy"
          />
        ) : (
          <div className="recipe-card__placeholder">🍽️</div>
        )}

        {/* Vignette overlay */}
        <div className="recipe-card__img-overlay" />

        {/* Difficulty badge — top-left, minimal with gold accent */}
        <span
          className="recipe-card__badge"
          style={{
            color:
              diff === 'easy'
                ? 'var(--color-success)'
                : diff === 'medium'
                ? 'var(--color-gold)'
                : 'var(--color-error)',
          }}
        >
          {dificultad}
        </span>

        {/* Rating badge — top-right */}
        {rating && (
          <span
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              fontFamily: 'var(--font-body)',
              fontSize: '0.6rem',
              fontWeight: 700,
              padding: '4px 9px',
              letterSpacing: '0.08em',
              background: 'rgba(255,255,255,0.95)',
              color: 'var(--color-gold)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            ★ {rating}
          </span>
        )}
      </figure>

      {/* ── Editorial body ── */}
      <div className="recipe-card__body">
        {/* Category label with gold dash */}
        <div className="recipe-card__tags">
          <span className="recipe-card__category">{categoria}</span>
        </div>

        {/* Title — large bold serif */}
        <h3 className="recipe-card__title">{titulo}</h3>

        {/* Description — italic, muted */}
        {descripcion && (
          <p className="recipe-card__desc">{descripcion}</p>
        )}

        {/* Footer meta */}
        <div className="recipe-card__footer">
          <div className="recipe-card__meta">
            {/* Clock icon */}
            <span className="recipe-card__meta-item">
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              {tiempoMin} min
            </span>
          </div>

          {/* Read arrow — editorial touch */}
          <span
            style={{
              marginLeft: 'auto',
              fontFamily: 'var(--font-body)',
              fontSize: '0.58rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              transition: 'color 180ms ease, gap 180ms ease',
            }}
          >
            Leer
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
