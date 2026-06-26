import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiHome, FiCalendar, FiClock, FiList,
  FiUsers, FiBarChart2, FiSettings, FiLayers, FiBriefcase
} from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose }) => {
  const { isAdmin } = useAuth();

  const userLinks = [
    { to: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { to: '/book-appointment', icon: <FiCalendar />, label: 'Book Appointment' },
    { to: '/queue-status', icon: <FiClock />, label: 'Queue Status' },
  ];

  const adminLinks = [
    { to: '/admin', icon: <FiHome />, label: 'Dashboard' },
    { to: '/admin/queue', icon: <FiLayers />, label: 'Queue Management' },
    { to: '/admin/services', icon: <FiBriefcase />, label: 'Service Management' },
    { to: '/admin/users', icon: <FiUsers />, label: 'Users' },
    { to: '/admin/analytics', icon: <FiBarChart2 />, label: 'Analytics' },
  ];

  const links = isAdmin() ? adminLinks : userLinks;

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-section-title">
        {isAdmin() ? 'Admin Panel' : 'Navigation'}
      </div>

      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          onClick={onClose}
          end={link.to === '/dashboard' || link.to === '/admin'}
        >
          {link.icon}
          <span>{link.label}</span>
        </NavLink>
      ))}

      {isAdmin() && (
        <>
          <div className="sidebar-section-title" style={{ marginTop: 'var(--space-4)' }}>
            User Views
          </div>
          {userLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
              end={link.to === '/dashboard'}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </>
      )}
    </aside>
  );
};

export default Sidebar;
