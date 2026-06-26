import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiMenu, FiUser, FiSun, FiMoon } from 'react-icons/fi';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar-custom d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center gap-3">
        {user && (
          <button
            className="btn-secondary-custom d-md-none"
            onClick={onToggleSidebar}
            style={{ padding: '8px 10px', fontSize: '1.1rem' }}
            id="sidebar-toggle"
          >
            <FiMenu />
          </button>
        )}
        <Link to={user ? (isAdmin() ? '/admin' : '/dashboard') : '/'} style={{ textDecoration: 'none' }}>
          <div className="navbar-brand-text">
            Queue<span>Flow</span>
          </div>
        </Link>
      </div>

      <div className="d-flex align-items-center gap-3">
        <button 
          className="btn-secondary-custom" 
          onClick={toggleTheme} 
          style={{ padding: '8px 10px', fontSize: '1.1rem', borderRadius: '50%' }}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <FiMoon /> : <FiSun />}
        </button>

        {user ? (
          <>
            <div className="d-none d-md-flex align-items-center gap-2" style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              <FiUser />
              <span>{user.name}</span>
              <span className="token-status booked" style={{ marginLeft: '4px' }}>
                {user.role}
              </span>
            </div>
            <button className="btn-secondary-custom" onClick={handleLogout} id="logout-btn">
              <FiLogOut />
              <span className="d-none d-md-inline">Logout</span>
            </button>
          </>
        ) : (
          <div className="d-flex gap-2">
            <Link to="/login" className="btn-secondary-custom" id="nav-login">
              Login
            </Link>
            <Link to="/register" className="btn-primary-custom" id="nav-register">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
