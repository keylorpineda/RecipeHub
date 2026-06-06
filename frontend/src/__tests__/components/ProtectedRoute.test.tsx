import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import * as AuthContextModule from '../../context/AuthContext';

/** Helper that mounts <ProtectedRoute> inside a minimal router. */
function renderRoute({ isAuthenticated, loading }: { isAuthenticated: boolean; loading: boolean }) {
  vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
    isAuthenticated,
    loading,
    user: null,
    login: vi.fn(),
    logout: vi.fn(),
  });

  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <div>Contenido protegido</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div>Página de login</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  it('shows the loading spinner while loading is true', () => {
    renderRoute({ isAuthenticated: false, loading: true });
    // The spinner container has "page-loading" class; text is "Verificando sesión…"
    expect(screen.getByText(/verificando sesión/i)).toBeInTheDocument();
  });

  it('redirects to /login when not authenticated and not loading', () => {
    renderRoute({ isAuthenticated: false, loading: false });
    expect(screen.getByText('Página de login')).toBeInTheDocument();
    expect(screen.queryByText('Contenido protegido')).toBeNull();
  });

  it('renders children when the user is authenticated', () => {
    renderRoute({ isAuthenticated: true, loading: false });
    expect(screen.getByText('Contenido protegido')).toBeInTheDocument();
    expect(screen.queryByText('Página de login')).toBeNull();
  });

  it('does not show children while loading even if somehow authenticated', () => {
    renderRoute({ isAuthenticated: true, loading: true });
    // Still showing the loading spinner, not the final content
    expect(screen.getByText(/verificando sesión/i)).toBeInTheDocument();
  });
});
