import { FiCalendar, FiClock, FiHash } from 'react-icons/fi';

const TokenCard = ({ appointment, onCancel, showActions = true, industry = 'CLINIC' }) => {
  const getStatusClass = (status) => {
    const map = {
      'BOOKED': 'booked',
      'WAITING': 'waiting',
      'IN_PROGRESS': 'in-progress',
      'COMPLETED': 'completed',
      'CANCELLED': 'cancelled',
    };
    return map[status] || 'booked';
  };

  const canCancel = ['BOOKED', 'WAITING'].includes(appointment.status);

  return (
    <div className="token-card fade-in">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <div className="token-number">
            <FiHash style={{ fontSize: '0.8em' }} />
            {appointment.tokenNo}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
            {appointment.serviceName}
          </p>
        </div>
        <span className={`token-status ${getStatusClass(appointment.status)}`}>
          {appointment.status === 'IN_PROGRESS' ? 'In Progress' : appointment.status}
        </span>
      </div>

      <div className="d-flex gap-4" style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
        <div className="d-flex align-items-center gap-2">
          <FiCalendar />
          <span>{appointment.appointmentDate}</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <FiClock />
          <span>{appointment.appointmentTime}</span>
        </div>
      </div>

      {appointment.estimatedWaitMinutes > 0 && (
        <div style={{
          marginTop: 'var(--space-3)',
          padding: 'var(--space-2) var(--space-3)',
          background: 'rgba(245, 158, 11, 0.1)',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--accent-amber)'
        }}>
          ⏱ Estimated wait: {appointment.estimatedWaitMinutes} minutes
        </div>
      )}

      {showActions && canCancel && onCancel && (
        <div style={{ marginTop: 'var(--space-4)' }}>
          <button
            className="btn-danger-custom"
            onClick={() => onCancel(appointment.id)}
            style={{ fontSize: 'var(--font-size-xs)', padding: '6px 16px' }}
          >
            Cancel {industry === 'GOVERNMENT' ? 'Application' :
                   industry === 'COLLEGE' ? 'Registration' :
                   industry === 'SERVICE_CENTER' ? 'Ticket' :
                   'Appointment'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TokenCard;
