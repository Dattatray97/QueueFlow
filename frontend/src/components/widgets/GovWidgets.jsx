import React, { useState } from 'react';
import { FiBriefcase, FiFileText, FiShield, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

// USER WIDGET (Citizen)
export const GovUserWidget = () => {
  return (
    <div className="fade-in-delay-3 mt-4">
      <h3 className="chart-title mb-4">Citizen Services Portal</h3>
      <div className="row g-4">
        <div className="col-12 col-md-7">
          <div className="glass-card p-4 h-100">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '12px', borderRadius: '50%' }}>
                <FiFileText size={24} />
              </div>
              <h4 className="mb-0" style={{ fontSize: '1.2rem' }}>My Applications</h4>
            </div>
            
            <div className="d-flex align-items-center justify-content-between p-3 rounded mb-3" style={{ background: 'rgba(0,0,0,0.2)', borderLeft: '4px solid #f59e0b' }}>
              <div>
                <div className="fw-bold">Passport Renewal</div>
                <div className="small text-muted">App ID: #PP-99201</div>
              </div>
              <span className="badge bg-warning text-dark">Processing</span>
            </div>
            
            <div className="d-flex align-items-center justify-content-between p-3 rounded" style={{ background: 'rgba(0,0,0,0.2)', borderLeft: '4px solid #10b981' }}>
              <div>
                <div className="fw-bold">Driving License Request</div>
                <div className="small text-muted">App ID: #DL-88321</div>
              </div>
              <span className="badge bg-success">Approved</span>
            </div>
          </div>
        </div>
        
        <div className="col-12 col-md-5">
          <div className="glass-card p-4 h-100" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(0,0,0,0.2))', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <div className="d-flex align-items-center gap-3 mb-3">
              <FiAlertTriangle className="text-danger" size={24} />
              <h4 className="mb-0 text-danger" style={{ fontSize: '1.1rem' }}>Important Deadlines</h4>
            </div>
            <p className="text-light">Property Tax Payment for Q3 is due in <strong>5 Days</strong>.</p>
            <button className="btn w-100 mt-3" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontWeight: 600 }}>Pay Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ADMIN WIDGET (Officer)
export const GovAdminWidget = () => {
  const [documents, setDocuments] = useState([
    { id: 'DOC-102', user: 'James Smith', type: 'Proof of Address', date: 'Today' },
    { id: 'DOC-103', user: 'Linda Taylor', type: 'Tax Declaration', date: 'Yesterday' }
  ]);

  const verifyDoc = (id) => {
    setDocuments(documents.filter(d => d.id !== id));
    toast.success('Document officially verified.');
  };

  return (
    <div className="fade-in-delay-3 mt-4">
      <h3 className="chart-title d-flex justify-content-between align-items-center">
        <span>Officer Dashboard</span>
        <span className="badge bg-primary">Secure Mode</span>
      </h3>
      <div className="row g-4">
        <div className="col-12">
          <div className="glass-card p-4" style={{ borderTop: '4px solid #6366f1' }}>
            <h4 className="mb-4" style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiShield style={{ color: '#6366f1' }}/> Document Verification Queue
            </h4>
            <div className="table-responsive">
              <table className="table-custom">
                <thead>
                  <tr>
                    <th>Doc ID</th>
                    <th>Citizen</th>
                    <th>Type</th>
                    <th>Submitted</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map(doc => (
                    <tr key={doc.id}>
                      <td className="fw-bold">{doc.id}</td>
                      <td>{doc.user}</td>
                      <td>{doc.type}</td>
                      <td>{doc.date}</td>
                      <td>
                        <button onClick={() => verifyDoc(doc.id)} className="btn btn-sm d-flex align-items-center gap-1" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                          <FiCheckCircle /> Verify
                        </button>
                      </td>
                    </tr>
                  ))}
                  {documents.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">No pending documents to verify.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
