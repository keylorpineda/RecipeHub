import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import type { IUser } from '../types';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post<{ user: IUser }>('/api/auth/login', { email, password });
      login(data.user);
      navigate('/');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Error al iniciar sesión';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      {/* Panel izquierdo — formulario */}
      <div className="auth-page__panel">
        <div className="auth-card">
          <span className="auth-card__eyebrow">Bienvenido de nuevo</span>
          <h1>Iniciar sesión</h1>
          <p className="auth-card__subtitle">Accede a tu colección de recetas favoritas.</p>

          {error && (
            <div className="alert alert--error" role="alert">
              {error}
            </div>
          )}

          <form className="auth-card__form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Correo electrónico
              </label>
              <input id="email" type="email" className="form-input" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className={`btn btn-primary btn-lg${loading ? ' btn--loading' : ''}`} disabled={loading} style={{ width: '100%' }}>
              {loading ? <span className="btn__spinner" /> : 'Entrar'}
            </button>
          </form>

          <p className="auth-card__footer">
            ¿Sin cuenta? <Link to="/register">Crea una gratis</Link>
          </p>
        </div>
      </div>

      {/* Panel derecho — arte editorial */}
      <div className="auth-page__art">
        <div className="auth-page__art-deco" />
        <span className="auth-page__art-issue">RecipeHub · Alta Cocina</span>
        <span className="auth-page__art-logo">RecipeHub</span>
        <p className="auth-page__art-quote">
          "Cocinar es un acto de amor que se comparte con quienes nos importan."
        </p>
      </div>
    </div>
  );
}
