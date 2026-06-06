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

  const linkClass = ({ isActive }: { isActive: boolean }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`;

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo" onClick={close}>
          Recipe<span>Hub</span>
        </Link>

        {/* Desktop links */}
        <div className="navbar__links">
          <NavLink to="/" end className={linkClass}>
            Inicio
          </NavLink>
          {!loading && isAuthenticated && (
            <>
              <NavLink to="/nueva" className={linkClass}>
                Nueva receta
              </NavLink>
              <NavLink to="/perfil" className={linkClass}>
                Mi perfil
              </NavLink>
            </>
          )}
        </div>

        {/* Desktop actions */}
        <div className="navbar__actions">
          {!loading &&
            (isAuthenticated ? (
              <button className="btn btn-logout btn-sm" onClick={handleLogout}>
                Cerrar sesión
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">
                  Iniciar sesión
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Registrarse
                </Link>
              </>
            ))}
        </div>

        {/* Hamburger — mobile only */}
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

      {/* Mobile drawer */}
      <div id="mobile-menu" className={`navbar__mobile-menu${menuOpen ? ' is-open' : ''}`} aria-hidden={!menuOpen}>
        <NavLink to="/" end className={linkClass} onClick={close}>
          Inicio
        </NavLink>
        {!loading && isAuthenticated && (
          <>
            <NavLink to="/nueva" className={linkClass} onClick={close}>
              Nueva receta
            </NavLink>
            <NavLink to="/perfil" className={linkClass} onClick={close}>
              Mi perfil
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
