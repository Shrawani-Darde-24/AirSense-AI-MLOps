import React, { useState } from 'react';
import { useCities } from '../hooks/useCities';
import { useStations } from '../hooks/useStations';
import { LoadingState, ErrorState, DemoDataBanner } from '../components/UIComponents';
import { Search } from 'lucide-react';
import { formatDate } from '../utils/formatters';

const Stations = () => {
  const [selectedCity, setSelectedCity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data: cities, loading: citiesLoading } = useCities();
  // Fetch all stations if no city selected, else filter by city
  const { data: stations, loading: stationsLoading, error, refetch } = useStations(selectedCity || null);

  if (citiesLoading || stationsLoading) return <LoadingState message="Loading stations..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  let filteredStations = stations || [];
  
  if (searchTerm) {
    filteredStations = filteredStations.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.area.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (statusFilter) {
    filteredStations = filteredStations.filter(s => s.status === statusFilter);
  }

  const getCityName = (cityId) => {
    return cities?.find(c => c.id === cityId)?.name || 'Unknown';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Monitoring Stations</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Detailed list of all deployed monitoring stations</p>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search station..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ padding: '8px 12px 8px 32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', width: '200px' }}
            />
          </div>
          <select 
            className="card" 
            value={selectedCity} 
            onChange={(e) => setSelectedCity(e.target.value)} 
            style={{ padding: '8px', border: '1px solid var(--border-light)' }}
          >
            <option value="">All Cities</option>
            {cities?.map(city => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
          <select 
            className="card" 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)} 
            style={{ padding: '8px', border: '1px solid var(--border-light)' }}
          >
            <option value="">All Statuses</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>
        </div>
      </div>

      <DemoDataBanner />

      <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--bg-main)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '16px', fontWeight: 600 }}>Station Name</th>
              <th style={{ padding: '16px', fontWeight: 600 }}>City</th>
              <th style={{ padding: '16px', fontWeight: 600 }}>Area</th>
              <th style={{ padding: '16px', fontWeight: 600 }}>PM2.5</th>
              <th style={{ padding: '16px', fontWeight: 600 }}>PM10</th>
              <th style={{ padding: '16px', fontWeight: 600 }}>NO₂</th>
              <th style={{ padding: '16px', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '16px', fontWeight: 600, textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStations.map(station => (
              <tr key={station.id} style={{ borderBottom: '1px solid var(--border-light)', transition: 'background-color 0.2s' }} className="table-row-hover">
                <td style={{ padding: '16px', fontWeight: 500 }}>{station.name}</td>
                <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{getCityName(station.cityId)}</td>
                <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{station.area}</td>
                <td style={{ padding: '16px', fontWeight: 500 }}>{station.pm25 || '-'}</td>
                <td style={{ padding: '16px', fontWeight: 500 }}>{station.pm10 || '-'}</td>
                <td style={{ padding: '16px', fontWeight: 500 }}>{station.no2 || '-'}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '0.75rem', 
                    fontWeight: 600,
                    backgroundColor: station.status === 'Online' ? 'var(--status-good-bg)' : 'var(--status-poor-bg)',
                    color: station.status === 'Online' ? 'var(--status-good-text)' : 'var(--status-poor-text)',
                  }}>
                    {station.status}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <a href="/air-quality" style={{ color: 'var(--primary-accent)', fontWeight: 500, fontSize: '0.875rem' }}>View Details</a>
                </td>
              </tr>
            ))}
            {filteredStations.length === 0 && (
              <tr>
                <td colSpan="8" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No stations match your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <style>{`.table-row-hover:hover { background-color: var(--bg-main); }`}</style>
      </div>
    </div>
  );
};

export default Stations;
