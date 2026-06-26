import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const Analytics = () => {
  const [dailyData, setDailyData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [dailyRes, serviceRes] = await Promise.all([
          adminAPI.getDailyBookings(),
          adminAPI.getServicePopularity()
        ]);
        setDailyData(dailyRes.data);
        setServiceData(serviceRes.data);
      } catch (error) {
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#06b6d4'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-primary">
          <p className="mb-1 fw-bold text-white">{label}</p>
          <p className="mb-0 text-primary">
            Bookings: <strong>{payload[0].value}</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-secondary">
          <p className="mb-1 fw-bold text-white">{payload[0].name}</p>
          <p className="mb-0" style={{ color: payload[0].payload.fill }}>
            Count: <strong>{payload[0].value}</strong> ({payload[0].payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Analytics Dashboard</h1>
        <p className="page-subtitle">Visual insights into bookings and service popularity.</p>
      </div>

      <div className="row g-4">
        {/* Daily Bookings Chart */}
        <div className="col-12 fade-in-delay-1">
          <div className="chart-container">
            <h3 className="chart-title">Daily Bookings (Last 7 Days)</h3>
            <div style={{ height: '350px', width: '100%' }}>
              <ResponsiveContainer>
                <BarChart data={dailyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                  <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} allowDecimals={false} />
                  <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                  <Bar dataKey="bookings" fill="url(#colorBlue)" radius={[4, 4, 0, 0]} barSize={40}>
                    {dailyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="url(#colorBlue)" />
                    ))}
                  </Bar>
                  <defs>
                    <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Service Popularity Chart */}
        <div className="col-12 col-lg-6 fade-in-delay-2">
          <div className="chart-container">
            <h3 className="chart-title">Service Popularity (Last 30 Days)</h3>
            {serviceData.length > 0 ? (
              <div style={{ height: '350px', width: '100%' }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={serviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="count"
                      stroke="none"
                    >
                      {serviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomPieTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconType="circle"
                      formatter={(value, entry) => (
                        <span style={{ color: 'var(--text-secondary)' }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="d-flex justify-content-center align-items-center" style={{ height: '350px' }}>
                <p className="text-muted">No data available for the last 30 days.</p>
              </div>
            )}
          </div>
        </div>

        {/* Summary Details */}
        <div className="col-12 col-lg-6 fade-in-delay-3">
          <div className="chart-container" style={{ height: '100%', minHeight: '430px' }}>
            <h3 className="chart-title">Service Breakdown</h3>
            <div className="table-responsive">
              <table className="table-custom">
                <thead>
                  <tr>
                    <th>Service Name</th>
                    <th className="text-end">Bookings</th>
                    <th className="text-end">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceData.length > 0 ? (
                    serviceData.map((service, index) => (
                      <tr key={service.name}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div style={{ 
                              width: '12px', height: '12px', borderRadius: '50%', 
                              backgroundColor: COLORS[index % COLORS.length] 
                            }}></div>
                            {service.name}
                          </div>
                        </td>
                        <td className="text-end fw-bold">{service.count}</td>
                        <td className="text-end">{service.percentage}%</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-4 text-muted">No data available</td>
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

export default Analytics;
