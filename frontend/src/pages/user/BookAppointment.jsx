import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceAPI, appointmentAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { FiCalendar, FiClock, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const BookAppointment = () => {
  const { user, selectedIndustry } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    serviceId: '',
    appointmentDate: '',
    appointmentTime: ''
  });

  // Generate today and next 6 days for date selection
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      value: d.toISOString().split('T')[0],
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    };
  });

  // Generate time slots (9 AM to 5 PM, every 30 mins)
  const timeSlots = [];
  for (let h = 9; h < 17; h++) {
    timeSlots.push(`${h.toString().padStart(2, '0')}:00`);
    timeSlots.push(`${h.toString().padStart(2, '0')}:30`);
  }

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const industry = selectedIndustry || user?.industry || '';
        const response = await serviceAPI.getAll(industry);
        setServices(response.data);
      } catch (error) {
        toast.error('Failed to load services');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [selectedIndustry, user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.serviceId || !form.appointmentDate || !form.appointmentTime) {
      toast.error('Please fill all fields');
      return;
    }

    setSubmitting(true);
    try {
      const response = await appointmentAPI.book(form);
      toast.success(`Appointment booked! Your token is ${response.data.tokenNo}`);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="fade-in max-w-3xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">Book Appointment</h1>
        <p className="page-subtitle">Select a service, date, and time slot to get your token.</p>
      </div>

      <div className="glass-card p-4 p-md-5 fade-in-delay-1" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          {/* Service Selection */}
          <div className="mb-4">
            <label className="form-label-custom">1. Select Service</label>
            <div className="row g-3">
              {services.map(service => (
                <div className="col-12 col-md-6" key={service.id}>
                  <div 
                    className={`p-3 rounded cursor-pointer transition-all border ${form.serviceId == service.id ? 'bg-primary-500 border-primary-500 text-white' : 'border-color bg-secondary'}`}
                    style={{ 
                      cursor: 'pointer',
                      background: form.serviceId == service.id ? 'var(--gradient-primary)' : 'var(--bg-secondary)',
                      borderColor: form.serviceId == service.id ? 'transparent' : 'var(--border-color)',
                      boxShadow: form.serviceId == service.id ? 'var(--shadow-md)' : 'none'
                    }}
                    onClick={() => setForm({...form, serviceId: service.id})}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-1 fw-bold" style={{ fontSize: 'var(--font-size-base)' }}>{service.serviceName}</h5>
                      {form.serviceId == service.id && <FiCheckCircle size={20} />}
                    </div>
                    <div style={{ 
                      fontSize: 'var(--font-size-xs)', 
                      color: form.serviceId == service.id ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)' 
                    }}>
                      <FiClock className="me-1" /> Est. {service.duration} mins
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          <div className="mb-4">
            <label className="form-label-custom">2. Select Date</label>
            <div className="d-flex flex-wrap gap-2">
              {dates.map(date => (
                <div 
                  key={date.value}
                  onClick={() => setForm({...form, appointmentDate: date.value})}
                  className={`px-3 py-2 rounded text-center cursor-pointer border`}
                  style={{
                    cursor: 'pointer',
                    minWidth: '100px',
                    background: form.appointmentDate === date.value ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-secondary)',
                    borderColor: form.appointmentDate === date.value ? 'var(--primary-500)' : 'var(--border-color)',
                    color: form.appointmentDate === date.value ? 'var(--primary-400)' : 'var(--text-secondary)',
                    fontWeight: form.appointmentDate === date.value ? '600' : 'normal'
                  }}
                >
                  <FiCalendar className="d-block mx-auto mb-1" />
                  <div style={{ fontSize: 'var(--font-size-sm)' }}>{date.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Time Slot Selection */}
          {form.appointmentDate && (
            <div className="mb-5 fade-in">
              <label className="form-label-custom">3. Select Time</label>
              <div className="time-slots-grid">
                {timeSlots.map(time => {
                  // Basic past time check for today
                  const isToday = form.appointmentDate === new Date().toISOString().split('T')[0];
                  const currentHour = new Date().getHours();
                  const currentMin = new Date().getMinutes();
                  const [slotHour, slotMin] = time.split(':').map(Number);
                  
                  const isPast = isToday && (slotHour < currentHour || (slotHour === currentHour && slotMin <= currentMin));
                  
                  return (
                    <div 
                      key={time}
                      className={`time-slot ${form.appointmentTime === time ? 'selected' : ''} ${isPast ? 'disabled' : ''}`}
                      onClick={() => !isPast && setForm({...form, appointmentTime: time})}
                    >
                      {time}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="d-flex justify-content-end border-top pt-4" style={{ borderColor: 'var(--border-color) !important' }}>
            <button 
              type="submit" 
              className="btn-primary-custom" 
              disabled={submitting || !form.serviceId || !form.appointmentDate || !form.appointmentTime}
            >
              {submitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
