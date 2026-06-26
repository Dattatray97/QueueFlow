import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaHospital, 
  FaBuilding, 
  FaGraduationCap, 
  FaLandmark, 
  FaWrench 
} from 'react-icons/fa';

export const industries = [
  {
    id: 'CLINIC',
    title: 'Clinics & Hospitals',
    description: 'Book Doctor Appointments, Tests, and Checkups',
    icon: <FaHospital size={40} />,
    color: 'var(--primary)',
    gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
  },
  {
    id: 'BANK',
    title: 'Banks & Financial',
    description: 'Schedule Cash Deposits, Loans, and Inquiries',
    icon: <FaBuilding size={40} />,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #34d399)',
  },
  {
    id: 'COLLEGE',
    title: 'Colleges & Universities',
    description: 'Admissions, Document Verification, and Helpdesk',
    icon: <FaGraduationCap size={40} />,
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
  },
  {
    id: 'GOVERNMENT',
    title: 'Government Offices',
    description: 'License Renewal, Taxes, and Public Services',
    icon: <FaLandmark size={40} />,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
  },
  {
    id: 'SERVICE_CENTER',
    title: 'Service Centers',
    description: 'Device Repair, Tech Support, and Maintenance',
    icon: <FaWrench size={40} />,
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444, #f87171)',
  }
];

const IndustrySelection = () => {
  const { setIndustry, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSelect = (industryId) => {
    setIndustry(industryId);
    if (isAdmin()) {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Welcome to QueueFlow</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto' }}>
          Please select the service category you want to access today. This will customize your experience.
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        {industries.map((ind) => (
          <div 
            key={ind.id}
            onClick={() => handleSelect(ind.id)}
            style={{
              background: 'var(--card-bg)',
              borderRadius: '16px',
              padding: '2rem',
              cursor: 'pointer',
              boxShadow: 'var(--shadow)',
              transition: 'all 0.3s ease',
              border: '1px solid var(--border-color)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow)';
            }}
          >
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: ind.gradient,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              boxShadow: '0 4px 14px 0 rgba(0,0,0,0.2)'
            }}>
              {ind.icon}
            </div>

            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>{ind.title}</h3>
            <p style={{ color: 'var(--text-light)', lineHeight: '1.5' }}>{ind.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndustrySelection;
