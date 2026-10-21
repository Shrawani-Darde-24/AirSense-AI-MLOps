import React, { useState } from 'react';
import { useCities } from '../hooks/useCities';
import { useStations } from '../hooks/useStations';
import { useForecast } from '../hooks/useForecast';
import { LoadingState, ErrorState, DemoDataBanner } from '../components/UIComponents';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatDate } from '../utils/formatters';

const Forecasts = () => {
  const [selectedCity, setSelectedCity] = useState('city_01');
  const [selectedStation, setSelectedStation] = useState('site_5766');
  const [horizon, setHorizon] = useState('24h');

  const { data: cities, loading: citiesLoading } = useCities();
  const { data: stations } = useStations(selectedCity);
  const { data: forecastData, loading: forecastLoading, error, refetch } = useForecast(selectedStation);

  if (citiesLoading) return <LoadingState message="Loading forecasts..." />;

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setSelectedStation('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Air Quality Forecasts</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>PM2.5 prediction models and confidence intervals</p>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
          <select className="card" value={selectedCity} onChange={handleCityChange} style={{ padding: '8px', border: '1px solid var(--border-light)' }}>
            {cities.map(city => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
          
          <select className="card" value={selectedStation} onChange={(e) => setSelectedStation(e.target.value)} style={{ padding: '8px', border: '1px solid var(--border-light)' }}>
            <option value="" disabled>Select Station</option>
            {stations && stations.map(station => (
              <option key={station.id} value={station.id}>{station.name}</option>
            ))}
          </select>

          <select className="card" value={horizon} onChange={(e) => setHorizon(e.target.value)} style={{ padding: '8px', border: '1px solid var(--border-light)' }}>
            <option value="1h">+1 Hour Horizon</option>
            <option value="6h">+6 Hours Horizon</option>
            <option value="24h">+24 Hours Horizon</option>
          </select>
        </div>
      </div>

      <DemoDataBanner />

      {forecastLoading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={refetch} /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          
          {/* Main Forecast Visualization */}
          <div className="card">
            <h2 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-md)' }}>PM2.5 Forecast ({horizon})</h2>
            <div style={{ height: '400px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={forecastData?.chart || []} margin={{ top: 10, right: 30, bottom: 10, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '0.875rem' }} />
                  
                  <Area type="monotone" dataKey="upper" stroke="none" fill="rgba(249, 115, 22, 0.1)" name="Confidence Interval" />
                  <Area type="monotone" dataKey="lower" stroke="none" fill="var(--bg-card)" />
                  
                  <Line type="monotone" dataKey="actual" name="Historical Actual" stroke="var(--primary-accent)" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="forecast" name="Forecast Value" stroke="#f97316" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
            
            {/* Forecast Summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <h2 style={{ fontSize: '1rem' }}>Forecast Summary</h2>
              
              <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '4px' }}>+1 Hour</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>{forecastData?.summary.h1}</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>µg/m³</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--status-poor-text)', fontWeight: 500, fontSize: '0.875rem', marginBottom: '4px' }}>↑ 4%</div>
                  <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'var(--status-poor-bg)', color: 'var(--status-poor-text)' }}>Poor</span>
                </div>
              </div>

              <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '4px' }}>+6 Hours</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>{forecastData?.summary.h6}</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>µg/m³</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--status-critical-text)', fontWeight: 500, fontSize: '0.875rem', marginBottom: '4px' }}>↑ 12%</div>
                  <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'var(--status-critical-bg)', color: 'var(--status-critical-text)' }}>Critical</span>
                </div>
              </div>

              <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '4px' }}>+24 Hours</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>{forecastData?.summary.h24}</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>µg/m³</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--status-good-text)', fontWeight: 500, fontSize: '0.875rem', marginBottom: '4px' }}>↓ 6%</div>
                  <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'var(--status-moderate-bg)', color: 'var(--status-moderate-text)' }}>Moderate</span>
                </div>
              </div>
            </div>

            {/* Model Info & Interpretation */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <div className="card">
                <h2 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-md)' }}>Model Information</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Model Architecture</span>
                    <span style={{ fontWeight: 500 }}>XGBoost</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Target Variable</span>
                    <span style={{ fontWeight: 500 }}>PM2.5</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Supported Horizons</span>
                    <span style={{ fontWeight: 500 }}>1h / 6h / 24h</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Model Status</span>
                    <span style={{ color: 'var(--status-good-text)', fontWeight: 500 }}>Production (v1.0.0)</span>
                  </div>
                </div>
                <div style={{ marginTop: '16px', fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  Demo model information — production model integration will be connected through the FastAPI backend.
                </div>
              </div>

              <div className="card" style={{ backgroundColor: 'var(--bg-main)', border: 'none' }}>
                <h2 style={{ fontSize: '1rem', marginBottom: '8px' }}>Forecast Interpretation</h2>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  <p style={{ marginBottom: '8px' }}><strong>Current Status:</strong> PM2.5 is currently at {forecastData?.summary.current} µg/m³, which is categorized as Moderate.</p>
                  <p style={{ marginBottom: '8px' }}><strong>Short-term Risk:</strong> Over the next 6 hours, PM2.5 is expected to increase to {forecastData?.summary.h6} µg/m³, entering the Poor/Critical threshold.</p>
                  <p><strong>24h Outlook:</strong> Air quality is predicted to improve slightly back to {forecastData?.summary.h24} µg/m³ by this time tomorrow.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Forecasts;
