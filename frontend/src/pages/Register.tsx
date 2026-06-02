import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import type { IUser } from '../types';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post<{ user: IUser }>('/api/auth/register', {
        nombre,
        email,
        password,
      });
      login(data.user);
      navigate('/');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Error al registrarse';
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
          <span className="auth-card__eyebrow">Únete a la comunidad</span>
          <h1>Crear cuenta</h1>
          <p className="auth-card__subtitle">Comparte tus recetas y descubre las de otros.</p>

          {error && (
            <div className="alert alert--error" role="alert">
              {error}
            </div>
          )}

          <form className="auth-card__form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="nombre">
                Nombre
              </label>
              <input id="nombre" type="text" className="form-input" placeholder="Tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required autoComplete="name" />
            </div>
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
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <button type="submit" className={`btn btn-primary btn-lg${loading ? ' btn--loading' : ''}`} disabled={loading} style={{ width: '100%' }}>
              {loading ? <span className="btn__spinner" /> : 'Crear cuenta'}
            </button>
          </form>

          <p className="auth-card__footer">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </div>

      {/* Panel derecho — arte */}
      <div className="auth-page__art">
        <span className="auth-page__art-logo">RecipeHub</span>
        <p className="auth-page__art-quote">"La mejor receta siempre lleva tiempo, paciencia y mucho amor."</p>
      </div>
    </div>
  );
}
