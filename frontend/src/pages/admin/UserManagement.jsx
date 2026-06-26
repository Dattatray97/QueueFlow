import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FiUsers, FiSearch, FiMail, FiPhone, FiCalendar, FiShield, FiBriefcase, FiFilter } from 'react-icons/fi';
import { industries } from '../IndustrySelection';

const UserManagement = () => {
  const { selectedIndustry } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const industryData = industries.find(i => i.id === selectedIndustry) || industries[0];

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers(roleFilter);
      setUsers(response.data || []);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.phone?.toLowerCase().includes(term)
    );
  });

  const getRoleBadgeStyle = (role) => {
    if (role === 'ADMIN') {
      return {
        background: 'rgba(239, 68, 68, 0.15)',
        color: '#ef4444',
        border: '1px solid rgba(239, 68, 68, 0.3)',
      };
    }
    return {
      background: 'rgba(59, 130, 246, 0.15)',
      color: '#3b82f6',
      border: '1px solid rgba(59, 130, 246, 0.3)',
    };
  };

  const userCount = users.filter(u => u.role === 'USER').length;
  const adminCount = users.filter(u => u.role === 'ADMIN').length;

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 fade-in">
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <div style={{ color: industryData.color, display: 'flex', alignItems: 'center' }}>
              <FiUsers size={20} />
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              User Management
            </span>
          </div>
          <h1 className="fw-bolder mb-1" style={{ fontSize: '2rem' }}>
            Registered Users
          </h1>
          <p style={{ color: 'var(--text-light)', margin: 0, fontSize: '0.95rem' }}>
            View and manage all registered users in the system.
          </p>
        </div>
      </div>
      <hr style={{ borderColor: 'rgba(255,255,255,0.1)', marginBottom: '2rem' }} />

      {/* Stats Summary */}
      <div className="row g-3 mb-4 fade-in-delay-1">
        <div className="col-6 col-md-3">
          <div className="glass-card p-3 text-center" style={{ borderTop: '3px solid #3b82f6' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#3b82f6' }}>{users.length}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Users</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="glass-card p-3 text-center" style={{ borderTop: '3px solid #10b981' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>{userCount}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Regular Users</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="glass-card p-3 text-center" style={{ borderTop: '3px solid #ef4444' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ef4444' }}>{adminCount}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Admins</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="glass-card p-3 text-center" style={{ borderTop: '3px solid #f59e0b' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b' }}>{filteredUsers.length}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Showing</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-3 mb-4 fade-in-delay-2">
        <div className="d-flex flex-column flex-md-row gap-3 align-items-md-center">
          <div className="d-flex align-items-center gap-2 flex-grow-1" style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '10px',
            padding: '8px 14px',
            border: '1px solid var(--border-color)',
          }}>
            <FiSearch style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-main)',
                width: '100%',
                fontSize: '0.95rem',
              }}
            />
          </div>
          <div className="d-flex align-items-center gap-2">
            <FiFilter style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '8px 14px',
                color: 'var(--text-main)',
                fontSize: '0.95rem',
                outline: 'none',
                cursor: 'pointer',
                minWidth: '150px',
              }}
            >
              <option value="">All Roles</option>
              <option value="USER">Users Only</option>
              <option value="ADMIN">Admins Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card overflow-hidden fade-in-delay-3">
        <div className="table-responsive" style={{ maxHeight: '600px' }}>
          <table className="table-custom">
            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Industry</th>
                <th>Appointments</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{index + 1}</td>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: user.role === 'ADMIN'
                            ? 'linear-gradient(135deg, #ef4444, #f87171)'
                            : 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '1rem',
                          flexShrink: 0,
                        }}>
                          {user.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{user.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-column gap-1">
                        <div className="d-flex align-items-center gap-1" style={{ fontSize: '0.9rem' }}>
                          <FiMail size={13} style={{ color: 'var(--text-secondary)' }} />
                          <span>{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="d-flex align-items-center gap-1" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            <FiPhone size={13} />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span style={{
                        ...getRoleBadgeStyle(user.role),
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}>
                        <FiShield size={12} />
                        {user.role}
                      </span>
                    </td>
                    <td>
                      {user.industry ? (
                        <span className="d-flex align-items-center gap-1" style={{ fontSize: '0.9rem' }}>
                          <FiBriefcase size={13} style={{ color: 'var(--text-secondary)' }} />
                          {user.industry}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>—</span>
                      )}
                    </td>
                    <td>
                      <span style={{
                        background: 'rgba(139, 92, 246, 0.15)',
                        color: '#8b5cf6',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                      }}>
                        {user.totalAppointments}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-1" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <FiCalendar size={13} />
                        {user.createdAt}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    {searchTerm ? 'No users match your search.' : 'No users found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
