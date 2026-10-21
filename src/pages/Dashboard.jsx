import React, { useState } from 'react';
import { useCities } from '../hooks/useCities';
import { useStations } from '../hooks/useStations';
import { useAirQuality } from '../hooks/useAirQuality';
import { useForecast } from '../hooks/useForecast';
import { useWeather } from '../hooks/useWeather';
import { StatCard, LoadingState, ErrorState, DemoDataBanner } from '../components/UIComponents';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from 'recharts';
import { Thermometer, Droplets, Wind, Compass, Gauge, CloudRain, Cloud, Navigation } from 'lucide-react';
import { formatDate } from '../utils/formatters';

const Dashboard = () => {
  const [selectedCity, setSelectedCity] = useState('city_01'); // Default to Pune
  const [selectedStation, setSelectedStation] = useState('site_5766'); // Default to Katraj Dairy

  const { data: cities, loading: citiesLoading } = useCities();
  const { data: stations } = useStations(selectedCity);
  const { data: aqData, loading: aqLoading, error: aqError, refetch: aqRefetch } = useAirQuality(selectedStation);
  const { data: forecastData, loading: forecastLoading } = useForecast(selectedStation);
  const { data: weatherData, loading: weatherLoading } = useWeather(selectedStation);

  if (citiesLoading) return <LoadingState message="Loading dashboard..." />;

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setSelectedStation(''); // reset station on city change
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Air quality monitoring and forecasting for major Indian cities</p>
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
          
          <select className="card" style={{ padding: '8px', border: '1px solid var(--border-light)' }}>
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
          </select>
        </div>
      </div>

      <DemoDataBanner />

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

      {/* Main Charts & Side Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--spacing-lg)' }}>
        {/* PM2.5 Trend + Forecast */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-md)' }}>PM2.5 Trend & Forecast</h2>
          {forecastLoading ? <LoadingState /> : (
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={forecastData?.chart || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '0.75rem' }} />
                  <Area type="monotone" dataKey="upper" stroke="none" fill="rgba(249, 115, 22, 0.1)" />
                  <Area type="monotone" dataKey="lower" stroke="none" fill="var(--bg-card)" />
                  <Line type="monotone" dataKey="actual" name="Historical" stroke="var(--primary-accent)" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="forecast" name="Forecast" stroke="#f97316" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Right Column: Forecast & Weather Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          
          {/* Forecast Card */}
          <div className="card">
            <h2 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-md)' }}>PM2.5 Forecast</h2>
            {forecastLoading ? <LoadingState /> : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border-light)' }}>
                  <div><div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>+1 Hour</div><div style={{ fontWeight: 600 }}>{forecastData?.summary.h1} µg/m³</div></div>
                  <div style={{ color: 'var(--status-poor-text)', fontSize: '0.75rem', alignSelf: 'flex-end' }}>↑ 4%</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border-light)' }}>
                  <div><div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>+6 Hours</div><div style={{ fontWeight: 600 }}>{forecastData?.summary.h6} µg/m³</div></div>
                  <div style={{ color: 'var(--status-critical-text)', fontSize: '0.75rem', alignSelf: 'flex-end' }}>↑ 12%</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div><div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>+24 Hours</div><div style={{ fontWeight: 600 }}>{forecastData?.summary.h24} µg/m³</div></div>
                  <div style={{ color: 'var(--status-good-text)', fontSize: '0.75rem', alignSelf: 'flex-end' }}>↓ 6%</div>
                </div>
                <div style={{ backgroundColor: 'var(--bg-main)', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Model</span>
                    <span style={{ fontWeight: 500 }}>{forecastData?.model.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Last Trained</span>
                    <span style={{ fontWeight: 500 }}>{formatDate(forecastData?.model.lastTrained, { hour: undefined, minute: undefined })}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Forecast Generated</span>
                    <span style={{ fontWeight: 500 }}>{formatDate(forecastData?.model.forecastGenerated)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Weather Card */}
          <div className="card">
            <h2 style={{ fontSize: '1rem', marginBottom: '4px' }}>Weather Conditions</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>Pune, Katraj Dairy</p>
            {weatherLoading ? <LoadingState /> : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Thermometer size={16} color="var(--text-secondary)" /><div style={{ fontSize: '0.875rem' }}>{weatherData?.current.temperature}°C</div></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Droplets size={16} color="var(--text-secondary)" /><div style={{ fontSize: '0.875rem' }}>{weatherData?.current.humidity}%</div></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Wind size={16} color="var(--text-secondary)" /><div style={{ fontSize: '0.875rem' }}>{weatherData?.current.windSpeed} m/s</div></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Compass size={16} color="var(--text-secondary)" /><div style={{ fontSize: '0.875rem' }}>{weatherData?.current.windDirection}</div></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Gauge size={16} color="var(--text-secondary)" /><div style={{ fontSize: '0.875rem' }}>{weatherData?.current.pressure} hPa</div></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CloudRain size={16} color="var(--text-secondary)" /><div style={{ fontSize: '0.875rem' }}>{weatherData?.current.precipitation} mm</div></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Cloud size={16} color="var(--text-secondary)" /><div style={{ fontSize: '0.875rem' }}>{weatherData?.current.cloudCover}%</div></div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* City Overview Table */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <h2 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-md)' }}>City Overview</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '12px 8px', fontWeight: 500 }}>City</th>
              <th style={{ padding: '12px 8px', fontWeight: 500 }}>Current PM2.5</th>
              <th style={{ padding: '12px 8px', fontWeight: 500 }}>Forecast +6h</th>
              <th style={{ padding: '12px 8px', fontWeight: 500 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {cities.map(city => (
              <tr key={city.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '12px 8px', fontWeight: 500 }}>{city.name}</td>
                <td style={{ padding: '12px 8px' }}>{city.currentPM25}</td>
                <td style={{ padding: '12px 8px' }}>{city.forecastPM25}</td>
                <td style={{ padding: '12px 8px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '0.75rem', 
                    fontWeight: 600,
                    backgroundColor: city.status === 'Normal' ? 'var(--status-good-bg)' : city.status === 'Monitoring' ? 'var(--status-moderate-bg)' : 'var(--status-poor-bg)',
                    color: city.status === 'Normal' ? 'var(--status-good-text)' : city.status === 'Monitoring' ? 'var(--status-moderate-text)' : 'var(--status-poor-text)',
                  }}>
                    {city.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Dashboard;
