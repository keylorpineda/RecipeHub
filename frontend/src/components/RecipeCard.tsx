import { Link } from 'react-router-dom';
import type { IComment } from '../types';

interface RecipeCardProps {
  _id: string;
  titulo: string;
  imagenUrl: string;
  tiempoMin: number;
  dificultad: 'Fácil' | 'Media' | 'Difícil';
  categoria: string;
  comentarios?: Pick<IComment, 'calificacion'>[];
  index?: number;
  wide?: boolean;
}

const difficultyClass: Record<string, string> = {
  Fácil: 'badge-difficulty--easy',
  Media: 'badge-difficulty--medium',
  Difícil: 'badge-difficulty--hard',
};

function avgRating(comentarios?: Pick<IComment, 'calificacion'>[]) {
  if (!comentarios?.length) return null;
  const avg = comentarios.reduce((s, c) => s + c.calificacion, 0) / comentarios.length;
  return avg.toFixed(1);
}

export default function RecipeCard({ _id, titulo, imagenUrl, tiempoMin, dificultad, categoria, comentarios, index = 0, wide = false }: RecipeCardProps) {
  const rating = avgRating(comentarios);
  const delay = `${index * 60}ms`;

  function addRipple(e: React.MouseEvent<HTMLAnchorElement>) {
    const btn = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.className = 'ripple-effect';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  }

  return (
    <Link to={`/recetas/${_id}`} className={`recipe-card${wide ? ' recipe-card--wide' : ''}`} style={{ animationDelay: delay }} onClick={addRipple}>
      <div className="recipe-card__image-wrap">
        {imagenUrl ? <img src={imagenUrl} alt={titulo} className="recipe-card__image" loading="lazy" /> : <div className="recipe-card__placeholder">🍽️</div>}
        <div className="recipe-card__overlay" />
      </div>

      <div className="recipe-card__content">
        <span className="recipe-card__category">{categoria}</span>
        <h3 className="recipe-card__title">{titulo}</h3>
        <div className="recipe-card__footer">
          <div className="recipe-card__meta">
            <span className="recipe-card__meta-item">⏱ {tiempoMin} min</span>
            <span className={`badge-difficulty ${difficultyClass[dificultad]}`}>{dificultad}</span>
          </div>
          {rating && (
            <div className="recipe-card__rating">
              ★ <span>{rating}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
