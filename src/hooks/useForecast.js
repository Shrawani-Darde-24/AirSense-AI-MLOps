import { useState, useEffect, useCallback } from 'react';
import { getForecast } from '../services/api';

export const useForecast = (stationId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchForecast = useCallback(async () => {
    if (!stationId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const forecast = await getForecast(stationId);
      setData(forecast);
    } catch (err) {
      setError(err.message || 'Failed to fetch forecast');
    } finally {
      setLoading(false);
    }
  }, [stationId]);

  useEffect(() => {
    fetchForecast();
  }, [fetchForecast]);

  return { data, loading, error, refetch: fetchForecast };
};
