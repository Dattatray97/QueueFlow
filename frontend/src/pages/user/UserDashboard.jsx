import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { queueAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FiCalendar, FiClock, FiPlusCircle, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { BankUserWidget } from '../../components/widgets/BankWidgets';
import { ClinicUserWidget } from '../../components/widgets/ClinicWidgets';
import { CollegeUserWidget } from '../../components/widgets/CollegeWidgets';
import { GovUserWidget } from '../../components/widgets/GovWidgets';
import { ServiceUserWidget } from '../../components/widgets/ServiceWidgets';
import { industries } from '../IndustrySelection';

const UserDashboard = () => {
  const { user, selectedIndustry } = useAuth();
  const [queueStatus, setQueueStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const industryData = industries.find(i => i.id === selectedIndustry) || industries[0];

  useEffect(() => {
    fetchDashboardData();
  }, [selectedIndustry]);

  const fetchDashboardData = async () => {
    try {
      const queueResponse = await queueAPI.getStatus(selectedIndustry);
      setQueueStatus(queueResponse.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

// Add this function inside UserDashboard (before return)
  const renderDomainWidget = () => {
    if (selectedIndustry === 'BANK') return <BankUserWidget />;
    if (selectedIndustry === 'CLINIC') return <ClinicUserWidget />;
    if (selectedIndustry === 'COLLEGE') return <CollegeUserWidget />;
    if (selectedIndustry === 'GOVERNMENT') return <GovUserWidget />;
    if (selectedIndustry === 'SERVICE_CENTER') return <ServiceUserWidget />;
    return null;
  };

  return (
    <div className="fade-in">
      {/* Hero Welcome Banner */}
      <div className="glass-card mb-5 fade-in position-relative overflow-hidden" style={{ border: 'none', background: industryData.gradient }}>
        <div className="p-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center position-relative z-1">
          <div className="text-white">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '50%' }}>
                {industryData.icon}
              </div>
              <span className="badge bg-white text-dark py-2 px-3 rounded-pill" style={{ fontSize: '0.9rem' }}>
                {industryData.title}
              </span>
            </div>
            <h1 className="fw-bolder mb-2" style={{ fontSize: '2.5rem' }}>
              Welcome back, <span>{user?.name?.split(' ')[0] || 'User'}</span> 👋
            </h1>
            <p style={{ fontSize: '1.1rem', maxWidth: '600px', opacity: 0.9 }}>
              Book your {industryData.title.toLowerCase()} appointment online and skip the waiting room. Track your live queue status directly from your dashboard.
            </p>
          </div>
          <div className="mt-4 mt-md-0">
            <Link to="/book-appointment" className="btn btn-light fw-bold" style={{ padding: '12px 24px', fontSize: '1.1rem', borderRadius: '50px', color: industryData.color }}>
              <FiPlusCircle size={20} className="me-2" /> Book {industryData.title.split(' ')[0]} Visit
            </Link>
          </div>
        </div>
        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '300px', height: '300px', background: 'white', opacity: '0.1', filter: 'blur(50px)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-50px', left: '10%', width: '150px', height: '150px', background: 'white', opacity: '0.1', filter: 'blur(40px)', borderRadius: '50%' }}></div>
      </div>

      <div className="row g-4 mb-5">
        {/* Quick Actions (Only show if no token today to save space, or style differently) */}
        {!queueStatus?.yourToken && (
          <div className="col-12 col-lg-4 fade-in-delay-1">
            <div className="glass-card p-4 h-100 d-flex flex-column justify-content-center align-items-center text-center" style={{ minHeight: '220px', borderTop: '4px solid var(--primary-500)' }}>
              <div className="stat-icon blue mb-3" style={{ width: '64px', height: '64px', fontSize: '2rem' }}>
                <FiCalendar />
              </div>
              <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Ready for a service?</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-4)' }}>
                Get your token number instantly.
              </p>
              <Link to="/book-appointment" className="text-primary fw-bold d-flex align-items-center gap-1" style={{ textDecoration: 'none' }}>
                Book Now <FiArrowRight />
              </Link>
            </div>
          </div>
        )}

        {/* Live Queue Status (if has token today) */}
        {queueStatus?.yourToken && (
          <div className="col-12 col-lg-8 fade-in-delay-2">
            <div className="glass-card p-4 h-100">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h3 className="chart-title mb-0 d-flex align-items-center gap-2">
                  <FiClock className="text-primary" /> Live Queue Status
                </h3>
                <Link to="/queue-status" className="btn-secondary-custom" style={{ padding: '6px 12px', fontSize: 'var(--font-size-xs)' }}>
                  View Full Queue
                </Link>
              </div>

              <div className="row g-3">
                <div className="col-6">
                  <div className="p-3 rounded text-center" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                    <div className="queue-label">Currently Serving</div>
                    <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--primary-400)' }}>
                      {queueStatus.currentServingToken}
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 rounded text-center" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                    <div className="queue-label">Your Token</div>
                    <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--accent-amber)' }}>
                      {queueStatus.yourToken}
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top" style={{ borderColor: 'var(--border-color) !important' }}>
                <div>
                  <span className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>People Ahead: </span>
                  <strong style={{ fontSize: 'var(--font-size-lg)' }}>{queueStatus.waitingAhead}</strong>
                </div>
                <div>
                  <span className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>Est. Wait: </span>
                  <strong style={{ fontSize: 'var(--font-size-lg)', color: 'var(--accent-emerald)' }}>{queueStatus.estimatedWaitMinutes} mins</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DOMAIN SPECIFIC WIDGETS */}
      {renderDomainWidget()}
    </div>
  );
};

export default UserDashboard;
