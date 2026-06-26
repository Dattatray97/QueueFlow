import React, { useState } from 'react';
import { FiFileText, FiThermometer, FiHeart, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

// USER WIDGET
export const ClinicUserWidget = () => {
  return (
    <div className="fade-in-delay-3 mt-4">
      <h3 className="chart-title mb-4">Your Health Records</h3>
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <div className="glass-card p-4 h-100" style={{ borderLeft: '4px solid #0ea5e9' }}>
            <div className="d-flex align-items-center gap-3 mb-3">
              <div style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', padding: '12px', borderRadius: '50%' }}>
                <FiFileText size={24} />
              </div>
              <h4 className="mb-0" style={{ fontSize: '1.2rem' }}>Latest Lab Results</h4>
            </div>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Blood Test (CBC) - <strong>Normal</strong></p>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Cholesterol Panel - <strong>Reviewed</strong></p>
            <button className="btn btn-sm w-100 mt-2" style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', fontWeight: 600 }}>Download PDF</button>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="glass-card p-4 h-100" style={{ borderLeft: '4px solid #10b981' }}>
            <div className="d-flex align-items-center gap-3 mb-3">
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '12px', borderRadius: '50%' }}>
                <FiHeart size={24} />
              </div>
              <h4 className="mb-0" style={{ fontSize: '1.2rem' }}>Active Prescriptions</h4>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom" style={{ borderColor: 'rgba(255,255,255,0.05) !important' }}>
              <span>Amoxicillin 500mg</span>
              <span className="badge bg-success bg-opacity-25 text-success">Active</span>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span>Lisinopril 10mg</span>
              <span className="badge bg-secondary bg-opacity-25 text-secondary">Expired</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ADMIN WIDGET
export const ClinicAdminWidget = () => {
  const [alerts, setAlerts] = useState([
    { id: 1, text: 'Dr. Smith is delayed by 15 mins' },
    { id: 2, text: 'MRI Machine Room 2 requires maintenance' }
  ]);

  return (
    <div className="fade-in-delay-3 mt-4">
      <h3 className="chart-title">Clinic Management</h3>
      <div className="row g-4">
        <div className="col-12 col-xl-6">
          <div className="glass-card p-4 h-100">
            <h4 className="mb-4" style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiThermometer style={{ color: 'var(--accent-cyan)' }}/> Staff Availability
            </h4>
            <div className="d-flex justify-content-between align-items-center p-3 rounded mb-2" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <div className="fw-bold">Dr. Sarah Jenkins (Cardiology)</div>
              <span className="badge bg-success">Available</span>
            </div>
            <div className="d-flex justify-content-between align-items-center p-3 rounded" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <div className="fw-bold">Dr. Robert Chen (Pediatrics)</div>
              <span className="badge bg-warning text-dark">In Surgery</span>
            </div>
          </div>
        </div>
        
        <div className="col-12 col-xl-6">
          <div className="glass-card p-4 h-100 border-danger border border-opacity-25">
            <h4 className="mb-4 text-danger" style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiAlertCircle /> Active Alerts
            </h4>
            {alerts.map(a => (
              <div key={a.id} className="d-flex justify-content-between align-items-center p-3 rounded mb-2" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                <span>{a.text}</span>
                <button onClick={() => setAlerts(alerts.filter(x => x.id !== a.id))} className="btn btn-sm btn-outline-danger border-0">Dismiss</button>
              </div>
            ))}
            {alerts.length === 0 && <div className="text-muted text-center py-3">No active alerts</div>}
          </div>
        </div>
      </div>
    </div>
  );
};
