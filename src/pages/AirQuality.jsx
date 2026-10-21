import React, { useState } from 'react';
import { useCities } from '../hooks/useCities';
import { useStations } from '../hooks/useStations';
import { useAirQuality } from '../hooks/useAirQuality';
import { useHistoricalData } from '../hooks/useHistoricalData';
import { StatCard, LoadingState, ErrorState, DemoDataBanner } from '../components/UIComponents';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDate } from '../utils/formatters';

const AirQuality = () => {
  const [selectedCity, setSelectedCity] = useState('city_01');
  const [selectedStation, setSelectedStation] = useState('site_5766');
  
  const { data: cities, loading: citiesLoading } = useCities();
  const { data: stations } = useStations(selectedCity);
  const { data: aqData, loading: aqLoading, error: aqError, refetch: aqRefetch } = useAirQuality(selectedStation);
  const { data: histData, loading: histLoading } = useHistoricalData(selectedStation, 'ALL', '24h');

  if (citiesLoading) return <LoadingState message="Loading Air Quality data..." />;

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setSelectedStation('');
  };

  const currentStation = stations?.find(s => s.id === selectedStation);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Air Quality Overview</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Current air-quality measurements and pollutant trends</p>
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
        </div>
      </div>

      <DemoDataBanner />

      {/* Station Info */}
      {currentStation && (
        <div className="card" style={{ display: 'flex', gap: '24px', alignItems: 'center', fontSize: '0.875rem' }}>
          <div><strong>Station:</strong> {currentStation.name} ({currentStation.area})</div>
          <div><strong>Status:</strong> <span style={{ color: currentStation.status === 'Online' ? 'var(--status-good-text)' : 'var(--text-secondary)' }}>{currentStation.status}</span></div>
          <div><strong>Available Parameters:</strong> {currentStation.parameters}</div>
        </div>
      )}

      {/* Pollutant Summary */}
      {aqLoading ? <LoadingState /> : aqError ? <ErrorState message={aqError} onRetry={aqRefetch} /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 'var(--spacing-md)' }}>
          {aqData && Object.entries(aqData.current).map(([key, data]) => (
            <StatCard 
              key={key} 
              title={key} 
              value={data.value} 
              unit={data.unit} 
              status={data.status} 
              change={data.change} 
            />
          ))}
        </div>
      )}

      {/* Trend Chart */}
      <div className="card">
        <h2 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-md)' }}>Historical Pollutant Trend (24h)</h2>
        {histLoading ? <LoadingState /> : (
          <div style={{ height: '350px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={histData?.chart || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)' }} />
                <Line yAxisId="left" type="monotone" dataKey="PM25" name="PM2.5" stroke="var(--primary-accent)" strokeWidth={2} dot={{ r: 3 }} />
                <Line yAxisId="left" type="monotone" dataKey="PM10" name="PM10" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                <Line yAxisId="right" type="monotone" dataKey="NO2" name="NO2" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default AirQuality;
