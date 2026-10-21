import React, { useState } from 'react';
import { useCities } from '../hooks/useCities';
import { useStations } from '../hooks/useStations';
import { useWeather } from '../hooks/useWeather';
import { LoadingState, ErrorState, DemoDataBanner } from '../components/UIComponents';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Thermometer, Droplets, Wind, Compass, Gauge, CloudRain, Cloud } from 'lucide-react';
import { formatDate } from '../utils/formatters';

const Weather = () => {
  const [selectedCity, setSelectedCity] = useState('city_01');
  const [selectedStation, setSelectedStation] = useState('site_5766');

  const { data: cities, loading: citiesLoading } = useCities();
  const { data: stations } = useStations(selectedCity);
  const { data: weatherData, loading: weatherLoading, error, refetch } = useWeather(selectedStation);

  if (citiesLoading) return <LoadingState message="Loading weather context..." />;

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setSelectedStation('');
  };

  const WeatherCard = ({ icon: Icon, label, value, unit }) => (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ padding: '12px', backgroundColor: 'var(--bg-main)', borderRadius: '50%', color: 'var(--primary-accent)' }}>
        <Icon size={24} />
      </div>
      <div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{label}</div>
        <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{value} <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--text-secondary)' }}>{unit}</span></div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Meteorological Conditions</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Current weather context for air-quality monitoring</p>
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

      {weatherLoading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={refetch} /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          
          <div className="card" style={{ backgroundColor: 'var(--bg-main)', border: 'none', padding: '16px' }}>
            <h3 style={{ fontSize: '0.875rem', marginBottom: '8px', color: 'var(--text-primary)' }}>Air Quality + Weather Context</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Weather variables significantly impact the dispersion and concentration of pollutants. 
              Temperature, humidity, wind speed, wind direction, precipitation, pressure, and cloud cover 
              are extracted as primary contextual features for the PM2.5 XGBoost forecasting pipeline.
            </p>
          </div>

          {/* Current Conditions Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
            <WeatherCard icon={Thermometer} label="Temperature" value={weatherData?.current.temperature} unit="°C" />
            <WeatherCard icon={Droplets} label="Relative Humidity" value={weatherData?.current.humidity} unit="%" />
            <WeatherCard icon={Wind} label="Wind Speed" value={weatherData?.current.windSpeed} unit="m/s" />
            <WeatherCard icon={Wind} label="Wind Gusts" value={weatherData?.current.windGust} unit="m/s" />
            <WeatherCard icon={Compass} label="Wind Direction" value={weatherData?.current.windDirection} unit="" />
            <WeatherCard icon={Gauge} label="Pressure" value={weatherData?.current.pressure} unit="hPa" />
            <WeatherCard icon={CloudRain} label="Precipitation" value={weatherData?.current.precipitation} unit="mm" />
            <WeatherCard icon={Cloud} label="Cloud Cover" value={weatherData?.current.cloudCover} unit="%" />
          </div>

          {/* Weather Trends */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
            <div className="card">
              <h2 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-md)' }}>Temperature Trend</h2>
              <div style={{ height: '250px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weatherData?.chart || []} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }} />
                    <Line type="monotone" dataKey="temperature" name="Temp °C" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <h2 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-md)' }}>Humidity & Wind Speed</h2>
              <div style={{ height: '250px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weatherData?.chart || []} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }} />
                    <Line yAxisId="left" type="monotone" dataKey="humidity" name="Humidity %" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                    <Line yAxisId="right" type="monotone" dataKey="windSpeed" name="Wind m/s" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default Weather;
