import React from 'react';
import { useDataQuality } from '../hooks/useMonitoring';
import { LoadingState, ErrorState, DemoDataBanner } from '../components/UIComponents';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDate } from '../utils/formatters';

const DataQuality = () => {
  const { data, loading, error, refetch } = useDataQuality();

  if (loading) return <LoadingState message="Loading data quality metrics..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'healthy': return 'var(--status-good-text)';
      case 'warning': return 'var(--status-moderate-text)';
      case 'critical': return 'var(--status-critical-text)';
      default: return 'var(--text-secondary)';
    }
  };

  const getStatusBg = (status) => {
    switch(status?.toLowerCase()) {
      case 'healthy': return 'var(--status-good-bg)';
      case 'warning': return 'var(--status-moderate-bg)';
      case 'critical': return 'var(--status-critical-bg)';
      default: return 'var(--bg-main)';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Data Quality Monitoring</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Monitor the completeness and validity of incoming data streams</p>
        <a href="/incidents" style={{ display: 'inline-block', marginTop: '8px', padding: '6px 12px', backgroundColor: 'var(--bg-main)', color: 'var(--primary-accent)', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', fontWeight: 500, textDecoration: 'none', border: '1px solid var(--border-light)' }}>
          Report Data Issue
        </a>
      </div>

      <DemoDataBanner />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-lg)' }}>
        
        {/* Completeness Chart */}
        <div className="card">
          <h2 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-md)' }}>Data Completeness Over Time (%)</h2>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.completeness || []} margin={{ top: 10, right: 30, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                <YAxis domain={[90, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }} />
                <Line type="monotone" dataKey="percentage" name="Completeness %" stroke="var(--primary-accent)" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quality Table */}
        <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--bg-main)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '16px', fontWeight: 600 }}>Parameter</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Total Records</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Missing (%)</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Outliers Detected</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px', fontWeight: 600 }}>Last Ingestion</th>
              </tr>
            </thead>
            <tbody>
              {data?.table.map((row, index) => (
                <tr key={index} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>{row.parameter}</td>
                  <td style={{ padding: '16px' }}>{row.records.toLocaleString()}</td>
                  <td style={{ padding: '16px' }}>{row.missingPercent}%</td>
                  <td style={{ padding: '16px' }}>{row.outliers}</td>
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
                  <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{formatDate(new Date(), { hour: '2-digit', minute: '2-digit' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default DataQuality;
