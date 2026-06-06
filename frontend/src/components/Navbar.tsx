import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    setMenuOpen(false);
    await logout();
    navigate('/');
  }

  function close() {
    setMenuOpen(false);
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `navbar__link${isActive ? ' navbar__link--active' : ''}`;

  return (
    <nav className="navbar">
      {/* ── Top bar: left | logo | right ── */}
      <div className="navbar__topbar">
        {/* Left */}
        <div className="navbar__topbar-left">
          {!loading && !isAuthenticated && (
            <Link to="/register" className="navbar__subscribe">
              Únete
            </Link>
          )}
          {!loading && isAuthenticated && (
            <Link to="/nueva" className="navbar__subscribe">
              + Nueva Receta
            </Link>
          )}
        </div>

        {/* Center — logo absolutely centered */}
        <div className="navbar__logo-wrap">
          <Link to="/" className="navbar__logo" onClick={close}>
            RecipeHub
          </Link>
        </div>

        {/* Right */}
        <div className="navbar__topbar-right">
          {!loading && isAuthenticated ? (
            <>
              <NavLink to="/perfil" className="navbar__icon-btn" onClick={close}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
                Mi Perfil
              </NavLink>
              <button className="navbar__icon-btn" onClick={handleLogout} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#fff' }}>
                Salir
              </button>
            </>
          ) : !loading ? (
            <Link to="/login" className="navbar__icon-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
              Iniciar sesión
            </Link>
          ) : null}

          {/* Hamburger — mobile */}
          <button
            className={`navbar__hamburger${menuOpen ? ' is-open' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span className="navbar__hamburger-line" />
            <span className="navbar__hamburger-line" />
            <span className="navbar__hamburger-line" />
          </button>
        </div>
      </div>

      {/* ── Sub-nav: category links ── */}
      <div className="navbar__subnav">
        <NavLink to="/" end className={linkClass}>
          Inicio
        </NavLink>
        {!loading && isAuthenticated && (
          <>
            <NavLink to="/nueva" className={linkClass}>
              Nueva Receta
            </NavLink>
            <NavLink to="/perfil" className={linkClass}>
              Mi Perfil
            </NavLink>
          </>
        )}
      </div>

      {/* Mobile drawer */}
      <div id="mobile-menu" className={`navbar__mobile-menu${menuOpen ? ' is-open' : ''}`} aria-hidden={!menuOpen}>
        <NavLink to="/" end className={linkClass} onClick={close}>
          Inicio
        </NavLink>
        {!loading && isAuthenticated && (
          <>
            <NavLink to="/nueva" className={linkClass} onClick={close}>
              Nueva Receta
            </NavLink>
            <NavLink to="/perfil" className={linkClass} onClick={close}>
              Mi Perfil
            </NavLink>
          </>
        )}

        {!loading && (
          <>
            <div className="navbar__mobile-menu__divider" />
            {isAuthenticated ? (
              <button className="btn btn-logout" onClick={handleLogout}>
                Cerrar sesión
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost" onClick={close}>
                  Iniciar sesión
                </Link>
                <Link to="/register" className="btn btn-primary" onClick={close}>
                  Registrarse
                </Link>
              </>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
