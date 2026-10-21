import { useState, useEffect, useCallback } from 'react';
import { getAirQuality } from '../services/api';

export const useAirQuality = (stationId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAirQuality = useCallback(async () => {
    if (!stationId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const aqData = await getAirQuality(stationId);
      setData(aqData);
    } catch (err) {
      setError(err.message || 'Failed to fetch air quality data');
    } finally {
      setLoading(false);
    }
  }, [stationId]);

  useEffect(() => {
    fetchAirQuality();
  }, [fetchAirQuality]);

  return { data, loading, error, refetch: fetchAirQuality };
};
