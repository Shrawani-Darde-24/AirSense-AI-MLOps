import { useState, useEffect, useCallback } from 'react';
import { getWeather } from '../services/api';

export const useWeather = (stationId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async () => {
    if (!stationId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const weather = await getWeather(stationId);
      setData(weather);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }, [stationId]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return { data, loading, error, refetch: fetchWeather };
};
