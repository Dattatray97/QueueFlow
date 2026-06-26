import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiClock, FiSettings, FiUsers } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)', fontFamily: 'var(--font-family)', overflowX: 'hidden' }}>
      
      {/* Simple Transparent Navbar */}
      <nav style={{ padding: '2rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <div style={{ fontSize: '1.8rem', fontWeight: 900, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>
          QueueFlow
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {isAuthenticated() ? (
            <Link to={isAdmin() ? "/admin/dashboard" : "/dashboard"} className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: '50px', fontWeight: 600, background: 'var(--primary-500)', border: 'none' }}>
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-light" style={{ padding: '10px 24px', borderRadius: '50px', fontWeight: 600, border: '2px solid rgba(255,255,255,0.2)' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: '50px', fontWeight: 600, background: 'var(--primary-500)', border: 'none' }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ 
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        padding: '100px 4rem 4rem 4rem',
        overflow: 'hidden',
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.95)), url("/hero-bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        {/* Background Gradients */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50%', height: '70%', background: 'var(--primary-600)', filter: 'blur(150px)', opacity: 0.15, borderRadius: '50%', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '40%', height: '60%', background: 'var(--accent-violet)', filter: 'blur(120px)', opacity: 0.15, borderRadius: '50%', zIndex: 0 }}></div>

        <div className="container position-relative z-1">
          <div className="row align-items-center">
            <div className="col-lg-6 text-center text-lg-start mb-5 mb-lg-0">
              <div style={{ display: 'inline-block', padding: '8px 16px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '50px', color: 'var(--primary-400)', fontWeight: 600, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                🚀 The Future of Queue Management
              </div>
              <h1 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-1px' }}>
                No More Waiting <br/>
                <span style={{ color: 'var(--text-secondary)' }}>In Long Lines.</span>
              </h1>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-light)', marginBottom: '3rem', maxWidth: '500px', lineHeight: 1.6, margin: '0 auto 3rem auto' }} className="mx-lg-0">
              </p>
              
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                <Link to="/register" className="btn btn-primary d-flex align-items-center justify-content-center gap-2" style={{ padding: '16px 32px', fontSize: '1.1rem', borderRadius: '50px', fontWeight: 600, background: 'var(--gradient-primary)', border: 'none', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)' }}>
                  Start Using QueueFlow <FiArrowRight />
                </Link>
              </div>
            </div>
            
            <div className="col-lg-6 position-relative">
              <div className="glass-card" style={{ padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(145deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.8) 100%)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}></div>
                </div>
                
                <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Currently Serving</span>
                    <span className="badge bg-success bg-opacity-25 text-success">In Progress</span>
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-400)' }}>QF-1042</div>
                  <div style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}></div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.02)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Your Token</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent-amber)' }}>QF-1045</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.02)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Est. Wait</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>45 mins</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Footer is handled by the main app, but we can add a mini footer here if we want since we bypass AppLayout */}
      <footer style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="mb-0">© {new Date().getFullYear()} QueueFlow. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
