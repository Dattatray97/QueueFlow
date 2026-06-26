import React, { useState } from 'react';
import { FiTool, FiBox, FiCpu, FiMonitor } from 'react-icons/fi';
import { toast } from 'react-toastify';

// USER WIDGET (Customer)
export const ServiceUserWidget = () => {
  return (
    <div className="fade-in-delay-3 mt-4">
      <h3 className="chart-title mb-4">Repair Tracking</h3>
      <div className="glass-card p-4">
        <div className="d-flex align-items-center gap-3 mb-4">
          <div style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', padding: '12px', borderRadius: '50%' }}>
            <FiCpu size={24} />
          </div>
          <div>
            <h4 className="mb-0" style={{ fontSize: '1.2rem' }}>MacBook Pro 16" (2021)</h4>
            <div className="text-muted small">Service ID: #RPR-7749</div>
          </div>
        </div>
        
        {/* Progress Tracker */}
        <div className="position-relative mt-5 mb-4 px-2">
          <div className="progress" style={{ height: '4px', background: 'rgba(255,255,255,0.1)', overflow: 'visible' }}>
            <div className="progress-bar" role="progressbar" style={{ width: '50%', background: '#ec4899' }}></div>
          </div>
          
          <div className="d-flex justify-content-between position-absolute w-100" style={{ top: '-12px', left: 0 }}>
            <div className="d-flex flex-column align-items-center" style={{ width: '20%' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#ec4899', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>✓</div>
              <div className="text-center mt-2 small fw-bold">Dropped Off</div>
            </div>
            <div className="d-flex flex-column align-items-center" style={{ width: '20%' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#ec4899', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>✓</div>
              <div className="text-center mt-2 small fw-bold">Diagnostics</div>
            </div>
            <div className="d-flex flex-column align-items-center" style={{ width: '20%' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#ec4899', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', border: '3px solid #1e293b' }}>3</div>
              <div className="text-center mt-2 small fw-bold" style={{ color: '#ec4899' }}>In Repair</div>
            </div>
            <div className="d-flex flex-column align-items-center" style={{ width: '20%' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#334155', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', border: '3px solid #1e293b' }}>4</div>
              <div className="text-center mt-2 small text-muted">Ready</div>
            </div>
          </div>
        </div>

        <div className="mt-5 p-3 rounded" style={{ background: 'rgba(236, 72, 153, 0.05)', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
          <strong style={{ color: '#ec4899' }}>Latest Update:</strong> The replacement motherboard has arrived and is currently being installed by our technicians.
        </div>
      </div>
    </div>
  );
};

// ADMIN WIDGET (Technician)
export const ServiceAdminWidget = () => {
  return (
    <div className="fade-in-delay-3 mt-4">
      <h3 className="chart-title">Technician Workbench</h3>
      <div className="row g-4">
        <div className="col-12 col-xl-6">
          <div className="glass-card p-4 h-100" style={{ borderTop: '4px solid #ec4899' }}>
            <h4 className="mb-4" style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiTool style={{ color: '#ec4899' }}/> My Assigned Repairs
            </h4>
            <div className="d-flex align-items-center gap-3 p-3 rounded mb-3" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <FiMonitor size={24} className="text-muted" />
              <div className="flex-grow-1">
                <div className="fw-bold">Dell XPS 13 Screen Replacement</div>
                <div className="small text-muted">Customer: John D.</div>
              </div>
              <button className="btn btn-sm btn-primary" style={{ background: '#ec4899', border: 'none' }}>Start</button>
            </div>
            <div className="d-flex align-items-center gap-3 p-3 rounded" style={{ background: 'rgba(236, 72, 153, 0.1)', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
              <FiCpu size={24} style={{ color: '#ec4899' }} />
              <div className="flex-grow-1">
                <div className="fw-bold" style={{ color: '#ec4899' }}>MacBook Pro Motherboard</div>
                <div className="small text-muted">Customer: Sarah W.</div>
              </div>
              <span className="badge bg-secondary">In Progress</span>
            </div>
          </div>
        </div>
        
        <div className="col-12 col-xl-6">
          <div className="glass-card p-4 h-100">
            <h4 className="mb-4" style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiBox className="text-warning" /> Parts Inventory Alerts
            </h4>
            <ul className="list-unstyled">
              <li className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom" style={{ borderColor: 'rgba(255,255,255,0.05) !important' }}>
                <span>iPhone 13 Batteries</span>
                <span className="text-danger fw-bold">Low (2 left)</span>
              </li>
              <li className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom" style={{ borderColor: 'rgba(255,255,255,0.05) !important' }}>
                <span>Samsung S22 Screens</span>
                <span className="text-success fw-bold">In Stock (15)</span>
              </li>
              <li className="d-flex justify-content-between align-items-center">
                <span>Thermal Paste Tubes</span>
                <span className="text-danger fw-bold">Out of Stock</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
