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
  const delay = `${index * 55}ms`;

  return (
    <Link to={`/recetas/${_id}`} className={`recipe-card${wide ? ' recipe-card--wide' : ''}`} style={{ animationDelay: delay }}>
      {/* Imagen — sin overlay de texto encima */}
      <figure className="recipe-card__figure">
        {imagenUrl ? <img src={imagenUrl} alt={titulo} className="recipe-card__image" loading="lazy" /> : <div className="recipe-card__placeholder">🍽️</div>}
        <span className={`recipe-card__badge ${difficultyClass[dificultad]}`}>{dificultad}</span>
      </figure>

      {/* Contenido — limpio, debajo de la imagen */}
      <div className="recipe-card__body">
        <div className="recipe-card__tags">
          <span className="recipe-card__category">{categoria}</span>
        </div>

        <h3 className="recipe-card__title">{titulo}</h3>

        <div className="recipe-card__footer">
          <div className="recipe-card__meta">
            <span className="recipe-card__meta-item">⏱ {tiempoMin} min</span>
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
