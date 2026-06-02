import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import api from '../api/axios';
import type { IUser } from '../types';

interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (user: IUser) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ user: IUser }>('/api/auth/me')
      .then(({ data }) => {
        setUser(data.user);
        setIsAuthenticated(true);
      })
      .catch(() => {
        setUser(null);
        setIsAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function login(userData: IUser) {
    setUser(userData);
    setIsAuthenticated(true);
  }

  async function logout() {
    try {
      await api.post('/api/auth/logout');
    } catch {
      // la cookie se puede limpiar igual desde el servidor
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  }

  return <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
