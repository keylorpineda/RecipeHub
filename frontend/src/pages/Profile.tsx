import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import type { IRecipe } from '../types';
import RecipeCard from '../components/RecipeCard';
import SkeletonCard from '../components/SkeletonCard';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ recetas: IRecipe[] }>('/api/recetas')
      .then(({ data }) => {
        const mine = (data.recetas ?? []).filter((r) => r.autorId._id === user?._id);
        setRecipes(mine);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  const initials = user?.nombre
    ? user.nombre
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';

  return (
    <main className="page-content">
      <div className="container">
        {/* Header de perfil */}
        <div className="profile-header">
          <div className="profile-avatar">{user?.avatarUrl ? <img src={user.avatarUrl} alt={user.nombre} /> : initials}</div>
          <div className="profile-info">
            <h1>{user?.nombre}</h1>
            <p>{user?.email}</p>
            {user?.bio && <p style={{ marginTop: 8, color: 'var(--color-text-secondary)' }}>{user.bio}</p>}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignSelf: 'center' }}>
            <Link to="/nueva" className="btn btn-primary btn-sm">
              + Nueva receta
            </Link>
            <button className="btn btn-logout btn-sm" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Recetas del usuario */}
        <div className="section-header">
          <h2>Mis recetas</h2>
          {!loading && (
            <span className="results-count">
              {recipes.length} publicada{recipes.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {loading ? (
          <div className="recipe-grid">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📝</div>
            <h3>Aún no tienes recetas</h3>
            <p>
              <Link to="/nueva" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                Publica tu primera receta
              </Link>{' '}
              y compártela con la comunidad.
            </p>
          </div>
        ) : (
          <div className="recipe-grid">
            {recipes.map((recipe, i) => (
              <RecipeCard key={recipe._id} {...recipe} comentarios={[]} index={i} wide={i % 7 === 0} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
