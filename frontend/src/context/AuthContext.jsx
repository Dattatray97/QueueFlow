import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = sessionStorage.getItem('user');
    const storedToken = sessionStorage.getItem('token');
    const storedIndustry = sessionStorage.getItem('industry');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    if (storedIndustry) {
      setSelectedIndustry(storedIndustry);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    sessionStorage.setItem('token', userData.token);
    sessionStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('industry');
    setUser(null);
    setSelectedIndustry(null);
  };

  const setIndustry = (industry) => {
    sessionStorage.setItem('industry', industry);
    setSelectedIndustry(industry);
  };

  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  const isAuthenticated = () => {
    return !!user && !!sessionStorage.getItem('token');
  };

  if (loading) {
    return (
      <div className="spinner-container" style={{ minHeight: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, selectedIndustry, setIndustry, login, logout, isAdmin, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
