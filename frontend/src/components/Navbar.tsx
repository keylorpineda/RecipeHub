import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          Recipe<span>Hub</span>
        </Link>

        <div className="navbar__links">
          <NavLink to="/" end className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}>
            Inicio
          </NavLink>
          {!loading && isAuthenticated && (
            <>
              <NavLink to="/nueva" className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}>
                Nueva receta
              </NavLink>
              <NavLink to="/perfil" className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}>
                Mi perfil
              </NavLink>
            </>
          )}
        </div>

        <div className="navbar__actions">
          {!loading &&
            (isAuthenticated ? (
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
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
      </div>
    </nav>
  );
}
