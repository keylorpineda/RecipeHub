import { useEffect, useState, type FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import type { IRecipe, IComment } from '../types';
import StarRating from '../components/StarRating';

function AuthorAvatar({ nombre }: { nombre: string }) {
  const initials = nombre
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return <div className="author-avatar">{initials}</div>;
}

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [recipe, setRecipe] = useState<IRecipe | null>(null);
  const [comments, setComments] = useState<IComment[]>([]);
  const [loadingRecipe, setLoadingRecipe] = useState(true);

  const [commentText, setCommentText] = useState('');
  const [calificacion, setCalificacion] = useState(0);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState('');

  const isAuthor = user && recipe && recipe.autorId._id === user._id;

  useEffect(() => {
    if (!id) return;
    setLoadingRecipe(true);
    Promise.all([api.get<{ receta: IRecipe }>(`/api/recetas/${id}`), api.get<{ comentarios: IComment[] }>(`/api/recetas/${id}/comentarios`)])
      .then(([rRes, cRes]) => {
        setRecipe(rRes.data.receta);
        setComments(cRes.data.comentarios);
      })
      .catch(() => navigate('/'))
      .finally(() => setLoadingRecipe(false));
  }, [id, navigate]);

  async function handleDelete() {
    if (!window.confirm('¿Eliminar esta receta?')) return;
    try {
      await api.delete(`/api/recetas/${id}`);
      navigate('/');
    } catch {
      alert('No se pudo eliminar la receta.');
    }
  }

  async function handleComment(e: FormEvent) {
    e.preventDefault();
    if (!commentText.trim() || calificacion === 0) {
      setCommentError('Escribe un comentario y selecciona una calificación.');
      return;
    }
    setCommentError('');
    setCommentLoading(true);
    try {
      const { data } = await api.post<{ comentario: IComment }>(`/api/recetas/${id}/comentarios`, { texto: commentText, calificacion });
      setComments((prev) => [data.comentario, ...prev]);
      setCommentText('');
      setCalificacion(0);
    } catch {
      setCommentError('No se pudo publicar el comentario.');
    } finally {
      setCommentLoading(false);
    }
  }

  async function handleDeleteComment(commentId: string) {
    try {
      await api.delete(`/api/comentarios/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch {
      alert('No se pudo eliminar el comentario.');
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('es-CR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  if (loadingRecipe) {
    return (
      <div className="page-loading">
        <div className="page-loading__spinner" />
        <span>Cargando receta…</span>
      </div>
    );
  }

  if (!recipe) return null;

  const avgRating = comments.length ? (comments.reduce((s, c) => s + c.calificacion, 0) / comments.length).toFixed(1) : null;

  return (
    <main className="page-content">
      <div className="container recipe-detail">
        {/* Hero */}
        <div className="recipe-detail__hero">
          {recipe.imagenUrl ? (
            <img src={recipe.imagenUrl} alt={recipe.titulo} />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, var(--color-accent), var(--color-primary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '5rem',
              }}
            >
              🍽️
            </div>
          )}
          <div className="recipe-detail__hero-overlay">
            <div className="recipe-detail__hero-content">
              <p className="recipe-detail__hero-category">{recipe.categoria}</p>
              <h1 className="recipe-detail__title">{recipe.titulo}</h1>
              <div className="recipe-detail__meta-row">
                <span className="recipe-detail__meta-chip">⏱ {recipe.tiempoMin} min</span>
                <span className="recipe-detail__meta-chip">🍽 {recipe.porciones} porciones</span>
                <span className="recipe-detail__meta-chip">📊 {recipe.dificultad}</span>
                {avgRating && (
                  <span className="recipe-detail__meta-chip">
                    ★ {avgRating} ({comments.length})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Acciones del autor */}
        {isAuthor && (
          <div style={{ display: 'flex', gap: 12, marginBottom: 32, justifyContent: 'flex-end' }}>
            <Link to={`/editar/${recipe._id}`} className="btn btn-secondary btn-sm">
              ✏️ Editar receta
            </Link>
            <button className="btn btn-danger btn-sm" onClick={handleDelete}>
              🗑 Eliminar
            </button>
          </div>
        )}

        {/* Layout dos columnas */}
        <div className="recipe-detail__layout">
          {/* Sidebar */}
          <aside className="recipe-detail__sidebar">
            {/* Autor */}
            <div className="detail-card">
              <p className="detail-card__title">Autor</p>
              <div className="author-card">
                <AuthorAvatar nombre={recipe.autorId.nombre} />
                <div>
                  <p className="author-name">{recipe.autorId.nombre}</p>
                  <p className="author-email">{recipe.autorId.email}</p>
                </div>
              </div>
            </div>

            {/* Ingredientes */}
            <div className="detail-card">
              <p className="detail-card__title">Ingredientes</p>
              <ul className="ingredient-list">
                {recipe.ingredientes.map((ing, i) => (
                  <li key={i} className="ingredient-item">
                    <span className="ingredient-bullet" />
                    <span className="ingredient-name">{ing.nombre}</span>
                    <span className="ingredient-qty">
                      {ing.cantidad} {ing.unidad}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            {recipe.tags.length > 0 && (
              <div className="detail-card">
                <p className="detail-card__title">Etiquetas</p>
                <div className="tag-list">
                  {recipe.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Contenido principal */}
          <div>
            {/* Descripción */}
            <div className="detail-card" style={{ marginBottom: 32 }}>
              <p className="detail-card__title">Sobre esta receta</p>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.75 }}>{recipe.descripcion}</p>
            </div>

            {/* Pasos */}
            <div className="detail-card" style={{ marginBottom: 32 }}>
              <p className="detail-card__title">Preparación</p>
              <ol className="steps-list">
                {recipe.pasos.map((paso, i) => (
                  <li key={i} className="step-item">
                    <span className="step-number">{i + 1}</span>
                    <p className="step-text">{paso}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Comentarios */}
            <div className="comments-section">
              <h2 className="comments-title">Comentarios{comments.length > 0 && ` (${comments.length})`}</h2>

              {comments.length === 0 && <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>Sé el primero en comentar esta receta.</p>}

              {comments.map((comment) => (
                <div key={comment._id} className="comment-item">
                  <div className="comment-header">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span className="comment-author">{comment.usuarioId.nombre}</span>
                      <StarRating value={comment.calificacion} size="0.95rem" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className="comment-date">{formatDate(comment.createdAt)}</span>
                      {user?._id === comment.usuarioId._id && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteComment(comment._id)}>
                          Eliminar
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="comment-text">{comment.texto}</p>
                </div>
              ))}

              {/* Formulario de comentario */}
              {isAuthenticated ? (
                <div className="comment-form">
                  <h3 className="comment-form__title">Deja tu comentario</h3>
                  {commentError && (
                    <div className="alert alert--error" style={{ marginBottom: 16 }}>
                      {commentError}
                    </div>
                  )}
                  <form onSubmit={handleComment}>
                    <div className="form-group" style={{ marginBottom: 16 }}>
                      <label className="form-label">Calificación</label>
                      <StarRating value={calificacion} onChange={setCalificacion} size="1.6rem" />
                    </div>
                    <div className="form-group" style={{ marginBottom: 16 }}>
                      <label className="form-label" htmlFor="comment-text">
                        Comentario
                      </label>
                      <textarea
                        id="comment-text"
                        className="form-textarea"
                        placeholder="Cuéntanos tu experiencia con esta receta…"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div className="comment-form__actions">
                      <button type="submit" className={`btn btn-primary${commentLoading ? ' btn--loading' : ''}`} disabled={commentLoading}>
                        {commentLoading ? <span className="btn__spinner" /> : 'Publicar comentario'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="login-prompt">
                  <p>
                    <Link to="/login">Inicia sesión</Link> para dejar un comentario y calificar esta receta.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
