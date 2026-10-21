import React from 'react';
import { useDriftDetection } from '../hooks/useMonitoring';
import { LoadingState, ErrorState, DemoDataBanner } from '../components/UIComponents';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { formatDate } from '../utils/formatters';

const DriftDetection = () => {
  const { data, loading, error, refetch } = useDriftDetection();

  if (loading) return <LoadingState message="Loading drift detection analysis..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'healthy':
      case 'no drift': return 'var(--status-good-text)';
      case 'warning': return 'var(--status-moderate-text)';
      case 'critical':
      case 'drift detected': return 'var(--status-critical-text)';
      default: return 'var(--text-secondary)';
    }
  };

  const getStatusBg = (status) => {
    switch(status?.toLowerCase()) {
      case 'healthy':
      case 'no drift': return 'var(--status-good-bg)';
      case 'warning': return 'var(--status-moderate-bg)';
      case 'critical':
      case 'drift detected': return 'var(--status-critical-bg)';
      default: return 'var(--bg-main)';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Drift Detection</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Monitor feature distribution shifts and prediction drift over time</p>
        </div>
        <a href="/incidents" style={{ display: 'inline-block', padding: '8px 16px', backgroundColor: 'var(--bg-main)', color: 'var(--primary-accent)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', border: '1px solid var(--border-light)' }}>
          Create Incident
        </a>
      </div>

      <DemoDataBanner />

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Data Drift Status</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 600, color: getStatusColor(data?.summary.dataDriftStatus) }}>{data?.summary.dataDriftStatus}</div>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Prediction Drift Status</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 600, color: getStatusColor(data?.summary.predictionDriftStatus) }}>{data?.summary.predictionDriftStatus}</div>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Features Drifting</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 600, color: data?.summary.affectedFeatures > 0 ? 'var(--status-critical-text)' : 'var(--text-primary)' }}>{data?.summary.affectedFeatures}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-lg)' }}>
        
        {/* Drift Trend Chart */}
        <div className="card">
          <h2 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-md)' }}>Maximum Feature Drift Score Over Time</h2>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.trendChart || []} margin={{ top: 10, right: 30, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                <YAxis domain={[0, 0.5]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }} />
                <ReferenceLine y={0.3} stroke="var(--status-critical-text)" strokeDasharray="3 3" label={{ position: 'top', value: 'Threshold (0.3)', fill: 'var(--status-critical-text)', fontSize: 10 }} />
                <Line type="monotone" dataKey="score" name="Drift Score (JS Divergence)" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature Drift Table */}
        <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
          <h2 style={{ fontSize: '1rem', margin: 'var(--spacing-lg)', marginBottom: 'var(--spacing-sm)' }}>Feature-Level Analysis</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--bg-main)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '16px', fontWeight: 600 }}>Feature</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Drift Score</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Detection Threshold</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.table.map((row, index) => (
                <tr key={index} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>{row.feature}</td>
                  <td style={{ padding: '16px', fontWeight: row.score > row.threshold ? 600 : 400, color: row.score > row.threshold ? 'var(--status-critical-text)' : 'inherit' }}>
                    {row.score.toFixed(3)}
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{row.threshold.toFixed(2)}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.75rem', 
                      fontWeight: 600,
                      backgroundColor: getStatusBg(row.status),
                      color: getStatusColor(row.status),
                    }}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default DriftDetection;
