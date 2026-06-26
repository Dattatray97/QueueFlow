import React, { useState } from 'react';
import { FiBook, FiAward, FiCheckSquare, FiUsers, FiCheck, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

// USER WIDGET (Student)
export const CollegeUserWidget = () => {
  return (
    <div className="fade-in-delay-3 mt-4">
      <h3 className="chart-title mb-4">Student Academic Portal</h3>
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <div className="glass-card p-4 h-100" style={{ borderLeft: '4px solid #8b5cf6' }}>
            <div className="d-flex align-items-center gap-3 mb-4">
              <div style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', padding: '12px', borderRadius: '50%' }}>
                <FiAward size={24} />
              </div>
              <div>
                <h4 className="mb-0" style={{ fontSize: '1.2rem' }}>Current Semester Grades</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Fall 2026</div>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span>Data Structures & Algorithms</span>
              <span className="badge bg-success">A-</span>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span>Database Management</span>
              <span className="badge bg-primary">B+</span>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span>Web Technologies</span>
              <span className="badge bg-success">A</span>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="glass-card p-4 h-100" style={{ borderLeft: '4px solid #f59e0b' }}>
            <div className="d-flex align-items-center gap-3 mb-4">
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '12px', borderRadius: '50%' }}>
                <FiCheckSquare size={24} />
              </div>
              <h4 className="mb-0" style={{ fontSize: '1.2rem' }}>Pending Assignments</h4>
            </div>
            <div className="d-flex justify-content-between align-items-center p-3 rounded mb-2" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <div>
                <div className="fw-bold">React Project</div>
                <div style={{ fontSize: '0.8rem', color: '#ef4444' }}>Due Tomorrow</div>
              </div>
              <button className="btn btn-sm btn-outline-light border-0">Submit</button>
            </div>
            <div className="d-flex justify-content-between align-items-center p-3 rounded" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <div>
                <div className="fw-bold">SQL Lab Report</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Due in 3 days</div>
              </div>
              <button className="btn btn-sm btn-outline-light border-0">Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ADMIN WIDGET (Admissions / Faculty)
export const CollegeAdminWidget = () => {
  const [applications, setApplications] = useState([
    { id: 'APP-2026-01', student: 'Alex Johnson', program: 'BSc Computer Science', gpa: '3.8' },
    { id: 'APP-2026-02', student: 'Maria Garcia', program: 'MSc Data Science', gpa: '3.9' }
  ]);

  const handleAction = (id, action) => {
    setApplications(applications.filter(a => a.id !== id));
    toast.success(`Application ${id} ${action === 'APPROVE' ? 'Approved' : 'Rejected'}`);
  };

  return (
    <div className="fade-in-delay-3 mt-4">
      <h3 className="chart-title">Admissions & Faculty Console</h3>
      <div className="row g-4">
        <div className="col-12 col-xl-7">
          <div className="glass-card p-4 h-100">
            <h4 className="mb-4" style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiUsers style={{ color: 'var(--accent-violet)' }}/> Pending Applications
            </h4>
            {applications.length > 0 ? applications.map(app => (
              <div key={app.id} className="d-flex flex-column flex-md-row justify-content-between align-items-md-center p-3 rounded mb-3" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="mb-3 mb-md-0">
                  <div className="fw-bold fs-5">{app.student}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{app.program} • GPA: <strong className="text-white">{app.gpa}</strong></div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{app.id}</div>
                </div>
                <div className="d-flex gap-2">
                  <button onClick={() => handleAction(app.id, 'APPROVE')} className="btn btn-sm d-flex align-items-center gap-1" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}><FiCheck/> Accept</button>
                  <button onClick={() => handleAction(app.id, 'REJECT')} className="btn btn-sm d-flex align-items-center gap-1" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}><FiX/> Decline</button>
                </div>
              </div>
            )) : (
              <div className="text-center text-muted p-4">All applications processed.</div>
            )}
          </div>
        </div>
        <div className="col-12 col-xl-5">
          <div className="glass-card p-4 h-100" style={{ borderTop: '4px solid #3b82f6' }}>
            <h4 className="mb-4" style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiBook style={{ color: '#3b82f6' }}/> Today's Faculty Schedule
            </h4>
            <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
              <div>
                <div className="fw-bold">Prof. Alan Turing</div>
                <div className="text-muted small">CS-101 (Room 402)</div>
              </div>
              <span className="badge bg-primary">10:00 AM</span>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="fw-bold">Prof. Ada Lovelace</div>
                <div className="text-muted small">CS-205 (Room 305)</div>
              </div>
              <span className="badge bg-secondary text-dark">02:00 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
