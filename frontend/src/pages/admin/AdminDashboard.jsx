import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatsCard from '../../components/StatsCard';
import TokenCard from '../../components/TokenCard';
import { toast } from 'react-toastify';
import { FiUsers, FiCalendar, FiCheckCircle, FiClock, FiSettings } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { industries } from '../IndustrySelection';
import { BankAdminWidget } from '../../components/widgets/BankWidgets';
import { ClinicAdminWidget } from '../../components/widgets/ClinicWidgets';

const AdminDashboard = () => {
  const { user, selectedIndustry } = useAuth();
  const [stats, setStats] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const industryData = industries.find(i => i.id === selectedIndustry) || industries[0];

  useEffect(() => {
    setLoading(true);
    fetchDashboardData();
  }, [selectedIndustry]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, apptsRes] = await Promise.all([
        adminAPI.getDashboard(selectedIndustry),
        adminAPI.getTodayAppointments(selectedIndustry)
      ]);
      setStats(statsRes.data || { totalUsers: 0, todayBookings: 0, waitingTokens: 0, completedTokens: 0 });
      setTodayAppointments(apptsRes.data || []);
    } catch (error) {
      console.error('Dashboard data error:', error);
      // Set fallback data so the dashboard still renders
      setStats({ totalUsers: 0, todayBookings: 0, waitingTokens: 0, completedTokens: 0, cancelledTokens: 0, inProgressTokens: 0 });
      setTodayAppointments([]);
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

  const inProgressAppt = todayAppointments.find(a => a.status === 'IN_PROGRESS');

  const renderDomainWidget = () => {
    if (selectedIndustry === 'BANK') return <BankAdminWidget />;
    if (selectedIndustry === 'CLINIC') return <ClinicAdminWidget />;
    return null;
  };

  return (
    <div className="fade-in">
      {/* Professional Admin Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 fade-in">
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <div style={{ color: industryData.color, display: 'flex', alignItems: 'center' }}>
              {industryData.icon}
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {industryData.title} Administration
            </span>
          </div>
          <h1 className="fw-bolder mb-1" style={{ fontSize: '2rem' }}>
            System Overview
          </h1>
          <p style={{ color: 'var(--text-light)', margin: 0, fontSize: '0.95rem' }}>
            Welcome back, {user?.name?.split(' ')[0] || 'Provider'}. Here is your real-time command center.
          </p>
        </div>
        <div className="mt-3 mt-md-0 d-flex gap-3">
          <Link to="/admin/queue" className="btn btn-outline-light d-flex align-items-center gap-2" style={{ border: '1px solid rgba(255,255,255,0.1)', fontWeight: 600 }}>
            <FiSettings /> Configuration
          </Link>
          <Link to="/admin/queue" className="btn btn-primary d-flex align-items-center gap-2" style={{ background: industryData.color, border: 'none', fontWeight: 600 }}>
            <FiSettings /> Manage Queue
          </Link>
        </div>
      </div>
      <hr style={{ borderColor: 'rgba(255,255,255,0.1)', marginBottom: '2rem' }} />

      {stats && (
        <div className="stats-grid fade-in-delay-1">
          <StatsCard 
            title="Total Users" 
            value={stats.totalUsers} 
            icon={<FiUsers />} 
            color="blue" 
          />
          <StatsCard 
            title="Today's Bookings" 
            value={stats.todayBookings} 
            icon={<FiCalendar />} 
            color="cyan" 
            delay={0.1}
          />
          <StatsCard 
            title="Pending Tokens" 
            value={stats.waitingTokens} 
            icon={<FiClock />} 
            color="amber" 
            delay={0.2}
          />
          <StatsCard 
            title="Completed Tokens" 
            value={stats.completedTokens} 
            icon={<FiCheckCircle />} 
            color="green" 
            delay={0.3}
          />
        </div>
      )}

      <div className="row g-4 mt-2">
        <div className="col-12 col-lg-8 fade-in-delay-2">
          <h3 className="chart-title d-flex justify-content-between align-items-center">
            <span>Today's {selectedIndustry === 'GOVERNMENT' ? 'Applications' :
                   selectedIndustry === 'COLLEGE' ? 'Registrations' :
                   selectedIndustry === 'SERVICE_CENTER' ? 'Tickets' :
                   'Appointments'} ({todayAppointments.length})</span>
            <Link to="/admin/queue" className="btn-primary-custom" style={{ padding: '6px 12px', fontSize: 'var(--font-size-xs)' }}>
              Manage Queue
            </Link>
          </h3>
          <div className="glass-card overflow-hidden">
            <div className="table-responsive" style={{ maxHeight: '400px' }}>
              <table className="table-custom">
                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                  <tr>
                    <th>Token</th>
                    <th>User</th>
                    <th>Service</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {todayAppointments.length > 0 ? (
                    todayAppointments.map((appt) => (
                      <tr key={appt.id}>
                        <td className="fw-bold">{appt.tokenNo}</td>
                        <td>
                          <div>{appt.userName}</div>
                          <div className="text-muted" style={{ fontSize: '11px' }}>{appt.userEmail}</div>
                        </td>
                        <td>{appt.serviceName}</td>
                        <td>{appt.appointmentTime}</td>
                        <td>
                          <span className={`token-status ${appt.status.toLowerCase().replace('_', '-')}`}>
                            {appt.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-5 text-muted">
                        No {selectedIndustry === 'GOVERNMENT' ? 'applications' :
                            selectedIndustry === 'COLLEGE' ? 'registrations' :
                            selectedIndustry === 'SERVICE_CENTER' ? 'tickets' :
                            'appointments'} booked for today.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4 fade-in-delay-3">
          <h3 className="chart-title">Currently Serving</h3>
          {inProgressAppt ? (
            <TokenCard appointment={inProgressAppt} showActions={false} />
          ) : (
            <div className="glass-card p-5 text-center">
              <div className="text-muted mb-3">
                <FiClock size={40} />
              </div>
              <h5>No token in progress</h5>
              <p className="text-muted small">Call the next token from Queue Management</p>
              <Link to="/admin/queue" className="btn-secondary-custom mt-2">
                Go to Queue Management
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* DOMAIN SPECIFIC WIDGETS */}
      {renderDomainWidget()}

    </div>
  );
};

export default AdminDashboard;
