import { useState, useEffect } from 'react';
import { appointmentAPI } from '../../services/api';
import TokenCard from '../../components/TokenCard';
import { toast } from 'react-toastify';

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, UPCOMING, COMPLETED, CANCELLED

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentAPI.getAll();
      setAppointments(response.data);
    } catch (error) {
      toast.error('Failed to load appointment history');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentAPI.cancel(id);
        toast.success('Appointment cancelled successfully');
        fetchAppointments();
      } catch (error) {
        toast.error('Failed to cancel appointment');
      }
    }
  };

  const filteredAppointments = appointments.filter(appt => {
    if (filter === 'ALL') return true;
    if (filter === 'UPCOMING') return ['BOOKED', 'WAITING', 'IN_PROGRESS'].includes(appt.status);
    return appt.status === filter;
  });

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header d-md-flex justify-content-between align-items-end">
        <div>
          <h1 className="page-title">Appointment History</h1>
          <p className="page-subtitle">View all your past and upcoming appointments.</p>
        </div>
        
        <div className="mt-3 mt-md-0">
          <select 
            className="form-select form-select-custom" 
            style={{ width: 'auto', minWidth: '150px' }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="ALL">All Appointments</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredAppointments.length > 0 ? (
        <div className="row g-4 fade-in-delay-1">
          {filteredAppointments.map((appt) => (
            <div className="col-12 col-md-6 col-xl-4" key={appt.id}>
              <TokenCard 
                appointment={appt} 
                onCancel={handleCancel}
                showActions={['BOOKED', 'WAITING'].includes(appt.status)} 
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state fade-in-delay-1 glass-card">
          <h3>No appointments found</h3>
          <p>You don't have any appointments matching the selected filter.</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentHistory;
