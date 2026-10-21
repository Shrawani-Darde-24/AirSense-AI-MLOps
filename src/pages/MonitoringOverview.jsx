import React from 'react';
import { useMonitoringOverview } from '../hooks/useMonitoring';
import { LoadingState, ErrorState, DemoDataBanner } from '../components/UIComponents';
import { formatDate } from '../utils/formatters';
import { ArrowRight, Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const MonitoringOverview = () => {
  const { data, loading, error, refetch } = useMonitoringOverview();

  if (loading) return <LoadingState message="Loading MLOps metrics..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'healthy': return 'var(--status-good-text)';
      case 'warning': return 'var(--status-moderate-text)';
      case 'critical': return 'var(--status-critical-text)';
      default: return 'var(--text-secondary)';
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'healthy': return <CheckCircle size={16} color="var(--status-good-text)" />;
      case 'warning': return <AlertTriangle size={16} color="var(--status-moderate-text)" />;
      case 'critical': return <AlertTriangle size={16} color="var(--status-critical-text)" />;
      default: return <Activity size={16} color="var(--text-secondary)" />;
    }
  };

  const MonitoringCard = ({ title, dataObj, link }) => (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 500 }}>{title}</h3>
        {link && <a href={link} style={{ color: 'var(--primary-accent)', fontSize: '0.875rem' }}>View Details</a>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem', fontWeight: 600, color: getStatusColor(dataObj.status) }}>
        {getStatusIcon(dataObj.status)}
        {dataObj.status}
      </div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{dataObj.explanation}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
        <Clock size={12} /> Last updated: {formatDate(dataObj.timestamp, { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>MLOps Monitoring</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Monitor data quality, model performance, prediction behavior and system health.</p>
      </div>

      <DemoDataBanner />

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-md)' }}>
        <MonitoringCard title="Data Quality" dataObj={data?.dataQuality} link="/monitoring/data-quality" />
        <MonitoringCard title="Model Performance" dataObj={data?.modelPerformance} link="/monitoring/model-performance" />
        <MonitoringCard title="Data Drift" dataObj={data?.dataDrift} link="/monitoring/drift" />
        <MonitoringCard title="Prediction Drift" dataObj={data?.predictionDrift} link="/monitoring/drift" />
        <MonitoringCard title="Pipeline Status" dataObj={data?.pipelineStatus} />
        <MonitoringCard title="Last Analysis" dataObj={data?.lastAnalysis} />
      </div>

      {/* Planned Flow */}
      <div className="card">
        <h2 style={{ fontSize: '1rem', marginBottom: '16px' }}>Planned Production MLOps Flow</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>Live Data</div>
          <ArrowRight size={16} />
          <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>Validation</div>
          <ArrowRight size={16} />
          <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>Feature Processing</div>
          <ArrowRight size={16} />
          <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>Prediction</div>
          <ArrowRight size={16} />
          <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', color: 'var(--primary-accent)', border: '1px solid var(--primary-accent)' }}>Monitoring</div>
          <ArrowRight size={16} />
          <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>Drift Detection</div>
          <ArrowRight size={16} />
          <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>Incident</div>
          <ArrowRight size={16} />
          <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>Retraining</div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringOverview;
