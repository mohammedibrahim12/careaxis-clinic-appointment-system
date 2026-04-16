import {
  useEffect,
  useState,
} from 'react';
import api from '../api/client';
import { AuthContext } from './auth-context';

const STORAGE_KEY = 'clinic-auth';

const readStoredAuth = () => {
  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return { token: '', user: null };
    }

    const parsedValue = JSON.parse(rawValue);
    return {
      token: parsedValue.token || '',
      user: parsedValue.user || null,
    };
  } catch {
    return { token: '', user: null };
  }
};

export function AuthProvider({ children }) {
  const storedAuth = readStoredAuth();
  const [token, setToken] = useState(storedAuth.token);
  const [user, setUser] = useState(storedAuth.user);
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(storedAuth.token));

  useEffect(() => {
    if (!token) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
  }, [token, user]);

  useEffect(() => {
    if (!token) {
      setIsBootstrapping(false);
      return;
    }

    const syncUser = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
      } catch {
        setToken('');
        setUser(null);
      } finally {
        setIsBootstrapping(false);
      }
    };

    syncUser();
  }, [token]);

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    setToken('');
    setUser(null);
    setIsBootstrapping(false);
  };

  const refreshUser = async () => {
    if (!token) {
      return null;
    }

    const { data } = await api.get('/auth/me');
    setUser(data.user);
    return data.user;
  };

  const value = {
    token,
    user,
    isBootstrapping,
    isAuthenticated: Boolean(token && user),
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
