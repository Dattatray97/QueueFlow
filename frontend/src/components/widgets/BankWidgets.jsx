import React, { useState } from 'react';
import { FiDollarSign, FiActivity, FiCheck, FiX, FiRefreshCcw, FiFileText } from 'react-icons/fi';
import { toast } from 'react-toastify';

// USER WIDGET
export const BankUserWidget = () => {
  const [balance, setBalance] = useState(45210.50);
  const [loading, setLoading] = useState(false);

  const transactions = [
    { id: 1, type: 'DEBIT', amount: 1500, desc: 'ATM Withdrawal', date: 'Today, 10:30 AM' },
    { id: 2, type: 'CREDIT', amount: 12500, desc: 'Salary Credit', date: 'Yesterday, 09:00 AM' },
    { id: 3, type: 'DEBIT', amount: 450.75, desc: 'Amazon Purchase', date: 'May 30, 04:15 PM' },
  ];

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Account balances synced');
    }, 800);
  };

  return (
    <div className="fade-in-delay-3 mt-4">
      <h3 className="chart-title mb-4">Banking Services</h3>
      <div className="row g-4">
        {/* Balance Card */}
        <div className="col-12 col-md-5">
          <div className="glass-card h-100 position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.05))', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div style={{ color: 'var(--text-secondary)' }}>Savings Account</div>
                <button onClick={handleRefresh} className="btn btn-sm btn-outline-light border-0" style={{ padding: '4px' }}>
                  <FiRefreshCcw className={loading ? 'spin' : ''} />
                </button>
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981', letterSpacing: '-1px' }}>
                ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="mt-4 d-flex gap-2">
                <button className="btn btn-sm flex-grow-1" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: 'none', fontWeight: 600 }}>Send Money</button>
                <button className="btn btn-sm flex-grow-1" style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-main)', border: 'none', fontWeight: 600 }}>Pay Bills</button>
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', opacity: 0.1, color: '#10b981' }}>
              <FiDollarSign size={120} />
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="col-12 col-md-7">
          <div className="glass-card h-100 p-4">
            <h4 className="mb-4" style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiActivity style={{ color: 'var(--text-secondary)' }}/> Recent Transactions
            </h4>
            <div className="d-flex flex-column gap-3">
              {transactions.map(t => (
                <div key={t.id} className="d-flex justify-content-between align-items-center p-3 rounded" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.03)' }}>
                  <div className="d-flex align-items-center gap-3">
                    <div style={{ 
                      width: '40px', height: '40px', borderRadius: '50%', 
                      background: t.type === 'CREDIT' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: t.type === 'CREDIT' ? '#10b981' : '#ef4444',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <FiDollarSign />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{t.desc}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.date}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: t.type === 'CREDIT' ? '#10b981' : 'white' }}>
                    {t.type === 'CREDIT' ? '+' : '-'}${t.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ADMIN WIDGET
export const BankAdminWidget = () => {
  const [requests, setRequests] = useState([
    { id: 'REQ-9921', user: 'Michael Scott', type: 'Loan Approval', amount: '$50,000', status: 'PENDING' },
    { id: 'REQ-9922', user: 'Jim Halpert', type: 'Credit Card Limit Increase', amount: '$5,000', status: 'PENDING' },
    { id: 'REQ-9923', user: 'Pam Beesly', type: 'New Savings Account', amount: 'N/A', status: 'PENDING' },
  ]);

  const handleAction = (id, action) => {
    setRequests(requests.filter(r => r.id !== id));
    if (action === 'APPROVE') {
      toast.success(`Request ${id} approved successfully`);
    } else {
      toast.error(`Request ${id} rejected`);
    }
  };

  if (requests.length === 0) return null;

  return (
    <div className="fade-in-delay-3 mt-4">
      <h3 className="chart-title d-flex justify-content-between align-items-center">
        <span>Action Required: Pending Requests</span>
        <span className="badge bg-danger rounded-pill">{requests.length}</span>
      </h3>
      <div className="row g-4">
        {requests.map(req => (
          <div key={req.id} className="col-12 col-xl-4">
            <div className="glass-card p-4 h-100" style={{ borderLeft: '4px solid #f59e0b' }}>
              <div className="d-flex justify-content-between mb-2">
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{req.id}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f59e0b' }}>{req.type}</span>
              </div>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{req.user}</h4>
              <div style={{ color: 'var(--text-light)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Requested Amount: <strong style={{ color: 'white' }}>{req.amount}</strong>
              </div>
              <div className="d-flex gap-2">
                <button onClick={() => handleAction(req.id, 'APPROVE')} className="btn flex-grow-1 d-flex justify-content-center align-items-center gap-2" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', fontWeight: 600 }}>
                  <FiCheck /> Approve
                </button>
                <button onClick={() => handleAction(req.id, 'REJECT')} className="btn flex-grow-1 d-flex justify-content-center align-items-center gap-2" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', fontWeight: 600 }}>
                  <FiX /> Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
