import { useState, useEffect } from 'react';
import { queueAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { FiUsers, FiClock, FiActivity } from 'react-icons/fi';

const QueueStatus = () => {
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQueueStatus = async () => {
    try {
      const response = await queueAPI.getStatus();
      setQueueData(response.data);
    } catch (error) {
      toast.error('Failed to load queue status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueueStatus();
    // Poll every 30 seconds for live updates
    const intervalId = setInterval(fetchQueueStatus, 30000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1 className="page-title">Live Queue Status</h1>
          <p className="page-subtitle">Track the current queue in real-time. Auto-updates every 30s.</p>
        </div>
        <div className="d-none d-md-flex align-items-center gap-2 text-success" style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
          <FiActivity className="spinner" style={{ animationDuration: '3s', width: '20px', height: '20px', border: 'none' }} /> Live
        </div>
      </div>

      <div className="glass-card mb-5 fade-in-delay-1">
        <div className="queue-display">
          <div className="queue-label text-primary mb-2">Currently Serving</div>
          <div className="queue-current-token">
            {queueData?.currentServingToken || 'None'}
          </div>
          <div className="text-secondary mt-2">
            Service: <strong>{queueData?.currentServiceName || '-'}</strong>
          </div>

          <div className="queue-info-grid mt-5">
            {queueData?.yourToken && (
              <div className="queue-info-item" style={{ background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                <div style={{ color: 'var(--accent-amber)', marginBottom: '8px' }}>
                  <FiUsers size={24} />
                </div>
                <h4 style={{ color: 'var(--accent-amber)' }}>{queueData.yourToken}</h4>
                <p>Your Token</p>
              </div>
            )}
            
            <div className="queue-info-item">
              <div className="text-primary mb-2">
                <FiUsers size={24} />
              </div>
              <h4>{queueData?.waitingTokens?.length || 0}</h4>
              <p>Total Waiting</p>
            </div>

            {queueData?.yourToken && (
              <div className="queue-info-item">
                <div className="text-info mb-2">
                  <FiUsers size={24} />
                </div>
                <h4>{queueData.waitingAhead}</h4>
                <p>People Ahead of You</p>
              </div>
            )}

            {queueData?.yourToken && (
              <div className="queue-info-item" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                <div className="text-success mb-2">
                  <FiClock size={24} />
                </div>
                <h4 className="text-success">{queueData.estimatedWaitMinutes} mins</h4>
                <p>Estimated Wait</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <h3 className="chart-title mb-4 fade-in-delay-2">Waiting List ({queueData?.waitingTokens?.length || 0})</h3>
      
      <div className="glass-card overflow-hidden fade-in-delay-2">
        <div className="table-responsive">
          <table className="table-custom">
            <thead>
              <tr>
                <th>Position</th>
                <th>Token No</th>
                <th>Service</th>
                <th>Time Slot</th>
              </tr>
            </thead>
            <tbody>
              {queueData?.waitingTokens?.length > 0 ? (
                queueData.waitingTokens.map((token, index) => (
                  <tr key={token.id} style={{ 
                    background: token.tokenNo === queueData.yourToken ? 'rgba(245, 158, 11, 0.1)' : 'transparent' 
                  }}>
                    <td>
                      <span className="badge bg-secondary rounded-pill" style={{ padding: '6px 10px' }}>
                        #{index + 1}
                      </span>
                    </td>
                    <td className="fw-bold" style={{ color: token.tokenNo === queueData.yourToken ? 'var(--accent-amber)' : 'inherit' }}>
                      {token.tokenNo} {token.tokenNo === queueData.yourToken && '(You)'}
                    </td>
                    <td>{token.serviceName}</td>
                    <td>{token.appointmentTime}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted">
                    No tokens waiting in the queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QueueStatus;
