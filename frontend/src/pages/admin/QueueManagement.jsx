import { useState, useEffect, useRef } from 'react';
import { queueAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { FiPlay, FiSkipForward, FiCheck, FiX, FiRefreshCw, FiAlertTriangle, FiClock } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const QueueManagement = () => {
  const { selectedIndustry } = useAuth();
  const [currentServing, setCurrentServing] = useState(null);
  const [waitingTokens, setWaitingTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const intervalRef = useRef(null);
  const countdownRef = useRef(null);

  const fetchQueueData = async (silent = false) => {
    try {
      const [currentRes, waitingRes] = await Promise.all([
        queueAPI.getCurrent(selectedIndustry),
        queueAPI.getWaiting(selectedIndustry)
      ]);
      setCurrentServing(currentRes.data);
      setWaitingTokens(waitingRes.data);
    } catch (error) {
      if (!silent) toast.error('Failed to load queue data');
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 10 seconds
  useEffect(() => {
    fetchQueueData();

    intervalRef.current = setInterval(() => {
      fetchQueueData(true);
      setCountdown(10);
    }, 10000);

    countdownRef.current = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 10));
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(countdownRef.current);
    };
  }, [selectedIndustry]);

  // Calculate estimated wait for a token at given position
  const getEstimatedWait = (index) => {
    let totalMins = 0;
    for (let i = 0; i < index; i++) {
      // Use service duration from each token ahead, default 10 mins
      totalMins += (waitingTokens[i]?.estimatedWaitMinutes || 10);
    }
    return totalMins;
  };

let audioCtx = null;

const playDingDong = () => {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // === BELL STRIKE 1 (classic service bell "ting!") ===
    const playBellStrike = (startTime) => {
      const masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.6, startTime);
      masterGain.connect(audioCtx.destination);

      // Bell harmonics — real bells have inharmonic overtones
      const harmonics = [
        { freq: 830,  gain: 1.0,  decay: 1.8 },  // Fundamental
        { freq: 1245, gain: 0.6,  decay: 1.4 },  // ~1.5x (minor third)
        { freq: 1660, gain: 0.35, decay: 1.0 },  // ~2x (octave-ish)
        { freq: 2490, gain: 0.2,  decay: 0.7 },  // ~3x
        { freq: 3320, gain: 0.1,  decay: 0.5 },  // ~4x (shimmer)
        { freq: 4150, gain: 0.05, decay: 0.3 },  // ~5x (sparkle)
      ];

      harmonics.forEach(({ freq, gain: vol, decay }) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        // Slight detuning for natural shimmer
        osc.detune.setValueAtTime(Math.random() * 6 - 3, startTime);

        // Sharp attack, natural exponential decay (like a struck bell)
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(vol, startTime + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + decay);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(startTime);
        osc.stop(startTime + decay + 0.1);
      });

      // Add metallic "click" of the striker hitting the bell
      const clickDuration = 0.02;
      const bufferSize = audioCtx.sampleRate * clickDuration;
      const clickBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const clickData = clickBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        clickData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
      }

      const clickSource = audioCtx.createBufferSource();
      clickSource.buffer = clickBuffer;

      const clickFilter = audioCtx.createBiquadFilter();
      clickFilter.type = 'bandpass';
      clickFilter.frequency.setValueAtTime(4000, startTime);
      clickFilter.Q.setValueAtTime(2, startTime);

      const clickGain = audioCtx.createGain();
      clickGain.gain.setValueAtTime(0.3, startTime);

      clickSource.connect(clickFilter);
      clickFilter.connect(clickGain);
      clickGain.connect(masterGain);

      clickSource.start(startTime);
    };

    // Play two bell strikes — classic "ding... ding!"
    playBellStrike(now);
    playBellStrike(now + 0.6);

  } catch (e) {
    console.error('Audio playback failed', e);
  }
};

  const handleAction = async (action, id = null) => {
    setActionLoading(true);
    try {
      let response;
      switch (action) {
        case 'NEXT':
          response = await queueAPI.callNext(selectedIndustry);
          toast.success(`Calling Token ${response.data.tokenNo}`);
          playDingDong();
          break;
        case 'COMPLETE':
          response = await queueAPI.complete(id);
          toast.success(`Token ${response.data.tokenNo} marked completed`);
          break;
        case 'SKIP':
          response = await queueAPI.skip(id, selectedIndustry);
          toast.success(`Token skipped. Calling ${response.data.tokenNo}`);
          break;
        case 'CANCEL':
          if (window.confirm('Are you sure you want to cancel this token?')) {
            response = await queueAPI.cancel(id);
            toast.success(`Token ${response.data.tokenNo} cancelled`);
          }
          break;
      }
      fetchQueueData();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to perform action`);
    } finally {
      setActionLoading(false);
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
    <div className="fade-in">
      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1 className="page-title">Queue Management</h1>
          <p className="page-subtitle">Control the active queue and manage waiting tokens.</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <span className="badge bg-secondary py-2 px-3" style={{ fontSize: '0.8rem' }}>
            <FiClock className="me-1" /> Auto-refresh in {countdown}s
          </span>
          <button className="btn-secondary-custom" onClick={() => { fetchQueueData(); setCountdown(10); }} disabled={actionLoading}>
            <FiRefreshCw className={actionLoading ? 'spinner border-0' : ''} /> Refresh
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Current Token Control */}
        <div className="col-12 col-lg-5 fade-in-delay-1">
          <h3 className="chart-title">Current Serving</h3>
          <div className="glass-card p-4 p-xl-5 text-center h-100 d-flex flex-column justify-content-center">
            {currentServing ? (
              <>
                <div className="queue-label text-primary">Token Number</div>
                <div className="queue-current-token my-3" style={{ fontSize: '4rem' }}>
                  {currentServing.tokenNo}
                </div>
                
                <div className="mb-4 text-start p-3 rounded" style={{ background: 'rgba(30, 41, 59, 0.5)' }}>
                  <div className="row">
                    <div className="col-6 text-muted small">User:</div>
                    <div className="col-6 fw-bold text-end">{currentServing.userName}</div>
                    <div className="col-6 text-muted small">Service:</div>
                    <div className="col-6 fw-bold text-end">{currentServing.serviceName}</div>
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-2 justify-content-center">
                  <button 
                    className="btn-success-custom flex-grow-1"
                    onClick={() => handleAction('COMPLETE', currentServing.id)}
                    disabled={actionLoading}
                  >
                    <FiCheck /> Complete
                  </button>
                  <button 
                    className="btn-warning-custom flex-grow-1"
                    onClick={() => handleAction('SKIP', currentServing.id)}
                    disabled={actionLoading}
                  >
                    <FiSkipForward /> Skip
                  </button>
                </div>
              </>
            ) : (
              <div className="py-5">
                <div className="text-muted mb-4">No active token</div>
                <button 
                  className="btn-primary-custom" 
                  style={{ fontSize: '1.2rem', padding: '15px 30px' }}
                  onClick={() => handleAction('NEXT')}
                  disabled={actionLoading || waitingTokens.length === 0}
                >
                  <FiPlay size={24} /> Call Next Token
                </button>
                {waitingTokens.length === 0 && (
                  <div className="text-muted small mt-3">Queue is empty</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Waiting List */}
        <div className="col-12 col-lg-7 fade-in-delay-2">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="chart-title mb-0">Waiting List ({waitingTokens.length})</h3>
            {currentServing && waitingTokens.length > 0 && (
              <button 
                className="btn-primary-custom"
                style={{ padding: '6px 12px', fontSize: 'var(--font-size-xs)' }}
                onClick={() => handleAction('NEXT')}
                disabled={actionLoading}
              >
                Call Next <FiPlay />
              </button>
            )}
          </div>
          
          <div className="glass-card overflow-hidden">
            <div className="table-responsive" style={{ maxHeight: '600px' }}>
              <table className="table-custom">
                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                  <tr>
                    <th>Pos</th>
                    <th>Token</th>
                    <th>Service</th>
                    <th>Est. Wait</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {waitingTokens.length > 0 ? (
                    waitingTokens.map((token, index) => {
                      const estWait = getEstimatedWait(index);
                      const isLongWait = estWait > 10;
                      return (
                        <tr key={token.id} style={isLongWait ? { background: 'rgba(239, 68, 68, 0.08)', borderLeft: '3px solid #ef4444' } : {}}>
                          <td>
                            <span className={`badge ${isLongWait ? 'bg-danger' : 'bg-secondary'}`}>#{index + 1}</span>
                          </td>
                          <td className="fw-bold">{token.tokenNo}</td>
                          <td>
                            <div>{token.serviceName}</div>
                            <div className="text-muted small">{token.userName}</div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-1" style={{ color: isLongWait ? '#ef4444' : 'var(--accent-emerald)', fontWeight: 600, fontSize: '0.85rem' }}>
                              {isLongWait && <FiAlertTriangle size={14} />}
                              ~{estWait} min
                            </div>
                            {isLongWait && (
                              <div style={{ fontSize: '0.7rem', color: '#ef4444' }}>Long wait!</div>
                            )}
                          </td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline-danger" 
                              style={{ padding: '2px 8px', fontSize: '12px' }}
                              onClick={() => handleAction('CANCEL', token.id)}
                              disabled={actionLoading}
                              title="Cancel Token"
                            >
                              <FiX /> Cancel
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-5 text-muted">
                        No tokens waiting in the queue.
                      </td>
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

export default QueueManagement;
