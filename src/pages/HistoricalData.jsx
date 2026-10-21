import React, { useState } from 'react';
import { useCities } from '../hooks/useCities';
import { useStations } from '../hooks/useStations';
import { useHistoricalData } from '../hooks/useHistoricalData';
import { LoadingState, ErrorState, DemoDataBanner } from '../components/UIComponents';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const HistoricalData = () => {
  const [selectedCity, setSelectedCity] = useState('city_01');
  const [selectedStation, setSelectedStation] = useState('site_5766');
  const [pollutant, setPollutant] = useState('PM25');
  const [timeRange, setTimeRange] = useState('24h');

  const { data: cities, loading: citiesLoading } = useCities();
  const { data: stations } = useStations(selectedCity);
  const { data: histData, loading: histLoading, error, refetch } = useHistoricalData(selectedStation, pollutant, timeRange);

  if (citiesLoading) return <LoadingState message="Loading historical context..." />;

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setSelectedStation('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {/* Page Header & Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Historical Data</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Analyze past air-quality trends</p>
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

          <select className="card" value={pollutant} onChange={(e) => setPollutant(e.target.value)} style={{ padding: '8px', border: '1px solid var(--border-light)' }}>
            <option value="PM25">PM2.5</option>
            <option value="PM10">PM10</option>
            <option value="NO2">NO2</option>
            <option value="SO2">SO2</option>
            <option value="CO">CO</option>
            <option value="O3">O3</option>
          </select>

          <select className="card" value={timeRange} onChange={(e) => setTimeRange(e.target.value)} style={{ padding: '8px', border: '1px solid var(--border-light)' }}>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>

      <DemoDataBanner />

      {/* Summary Cards */}
      {!histLoading && histData && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--spacing-md)' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Average</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{histData.summary.average}</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Minimum</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{histData.summary.min}</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Maximum</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{histData.summary.max}</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Observations</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{histData.summary.observations}</div>
          </div>
        </div>
      )}

      {/* Main Chart */}
      <div className="card">
        <h2 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-md)' }}>{pollutant} Trend</h2>
        {histLoading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={refetch} /> : (
          <div style={{ height: '400px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={histData?.chart || []} margin={{ top: 10, right: 30, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }} />
                <Line type="monotone" dataKey={pollutant} name={pollutant} stroke="var(--primary-accent)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoricalData;
