import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, setIndustry } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authAPI.login(form);
      login(response.data);
      toast.success('Welcome back! 🎉');
      
      if (response.data.role === 'ADMIN') {
        if (response.data.industry) {
          setIndustry(response.data.industry);
        }
        navigate('/admin');
      } else {
        navigate('/industry-selection');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="animated-bg"></div>
      <div className="auth-card">
        <h1 className="auth-logo">QueueFlow</h1>
        <p className="auth-subtitle">Sign in to your account</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label-custom" htmlFor="login-email">
              <FiMail style={{ marginRight: '6px' }} />
              Email Address
            </label>
            <input
              type="email"
              id="login-email"
              name="email"
              className="form-control form-control-custom"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label-custom" htmlFor="login-password">
              <FiLock style={{ marginRight: '6px' }} />
              Password
            </label>
            <input
              type="password"
              id="login-password"
              name="password"
              className="form-control form-control-custom"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary-custom w-100 justify-content-center"
            disabled={loading}
            id="login-submit"
            style={{ padding: '12px' }}
          >
            {loading ? (
              <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
            ) : (
              <>
                Sign In <FiArrowRight />
              </>
            )}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: 'var(--space-6)',
          color: 'var(--text-secondary)',
          fontSize: 'var(--font-size-sm)'
        }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: 600 }}>Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
