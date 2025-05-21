import { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { getProfile, logout as apiLogout } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Safe localStorage access
  const getCurrentUser = () => {
    try {
      const userData = localStorage.getItem('currentUser');
      return userData ? JSON.parse(userData) : null;
    } catch (err) {
      console.error('Error parsing user data', err);
      // localStorage.removeItem('currentUser');
      return null;
    }
  };

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const currentUser = getCurrentUser();
        
        if (!currentUser) {
          const userData = await getProfile(currentUser);
          if (!userData) throw new Error('No user data returned');
          setUser(userData);
        } else {
          setUser(currentUser)
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load user profile');
        console.error('Auth error:', err);
        // localStorage.removeItem('currentUser');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (userData) => {
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setUser(userData);
    setError(null);
  };

  const logout = async () => {
    try {
      await apiLogout();
    } finally {
      localStorage.removeItem('currentUser');
      setUser(null);
    }
  };

  const value = useMemo(() => ({
    user,
    setUser,
    loading,
    error,
    logout,
    login,
    isAuthenticated: !!user,
    isAdmin: Boolean(user?.role === 'admin' || user?.isAdmin),
  }), [user, loading, error]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; // <-- This closing brace was missing

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};