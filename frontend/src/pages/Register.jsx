import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiPhone, FiLock, FiArrowRight } from 'react-icons/fi';

const Register = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
    industry: 'CLINIC'
  });
  const [loading, setLoading] = useState(false);
  const { login, setIndustry } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    setForm({ ...form, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...data } = form;
      const response = await authAPI.register(data);
      login(response.data);
      // Set industry in context so it's available immediately
      if (response.data.industry) {
        setIndustry(response.data.industry);
      }
      toast.success('Account created successfully! 🎉');
      navigate(data.role === 'ADMIN' ? '/admin' : '/industry-selection');
    } catch (error) {
      const message = error.response?.data?.message ||
        error.response?.data?.errors?.email ||
        'Registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="animated-bg"></div>
      <div className="auth-card" style={{ maxWidth: '450px' }}>
        <h1 className="auth-logo">QueueFlow</h1>
        <p className="auth-subtitle">Create your account to get started</p>

        <form onSubmit={handleSubmit}>
          
          {/* Role Selection */}
          <div className="mb-4">
            <label className="form-label-custom">I am registering as a...</label>
            <div className="d-flex gap-3">
              <div 
                className={`flex-grow-1 p-3 rounded text-center cursor-pointer transition ${form.role === 'USER' ? 'bg-primary bg-opacity-25 border border-primary' : 'bg-dark border border-secondary'}`}
                style={{ cursor: 'pointer', transition: 'all 0.2s', borderColor: form.role === 'USER' ? 'var(--primary-500)' : 'rgba(255,255,255,0.1)' }}
                onClick={() => handleRoleSelect('USER')}
              >
                <div style={{ color: form.role === 'USER' ? 'var(--primary-400)' : 'var(--text-secondary)', fontWeight: 600 }}>Customer</div>
              </div>
              <div 
                className={`flex-grow-1 p-3 rounded text-center cursor-pointer transition ${form.role === 'ADMIN' ? 'bg-primary bg-opacity-25 border border-primary' : 'bg-dark border border-secondary'}`}
                style={{ cursor: 'pointer', transition: 'all 0.2s', borderColor: form.role === 'ADMIN' ? 'var(--accent-violet)' : 'rgba(255,255,255,0.1)' }}
                onClick={() => handleRoleSelect('ADMIN')}
              >
                <div style={{ color: form.role === 'ADMIN' ? 'var(--accent-violet)' : 'var(--text-secondary)', fontWeight: 600 }}>Service Provider</div>
              </div>
            </div>
          </div>

          {form.role === 'ADMIN' && (
            <div className="mb-4 fade-in">
              <label className="form-label-custom">Select Your Industry</label>
              <select
                name="industry"
                className="form-control form-control-custom"
                value={form.industry}
                onChange={handleChange}
                required
              >
                <option value="CLINIC">Clinics & Hospitals</option>
                <option value="BANK">Banks & Financial</option>
                <option value="COLLEGE">Colleges & Universities</option>
                <option value="GOVERNMENT">Government Offices</option>
                <option value="SERVICE_CENTER">Service Centers</option>
              </select>
            </div>
          )}

          <div className="mb-3">
            <label className="form-label-custom" htmlFor="reg-email">
              <FiMail style={{ marginRight: '6px' }} />
              Email Address
            </label>
            <input
              type="email"
              id="reg-email"
              name="email"
              className="form-control form-control-custom"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label-custom" htmlFor="reg-password">
              <FiLock style={{ marginRight: '6px' }} />
              Password
            </label>
            <input
              type="password"
              id="reg-password"
              name="password"
              className="form-control form-control-custom"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label-custom" htmlFor="reg-confirm-password">
              <FiLock style={{ marginRight: '6px' }} />
              Confirm Password
            </label>
            <input
              type="password"
              id="reg-confirm-password"
              name="confirmPassword"
              className="form-control form-control-custom"
              placeholder="Repeat password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary-custom w-100 justify-content-center"
            disabled={loading}
            id="register-submit"
            style={{ padding: '12px' }}
          >
            {loading ? (
              <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
            ) : (
              <>
                Create Account <FiArrowRight />
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
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
