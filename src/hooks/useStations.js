import { useState, useEffect, useCallback } from 'react';
import { getStations } from '../services/api';

export const useStations = (cityId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStations = useCallback(async () => {
    if (!cityId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const stations = await getStations(cityId);
      setData(stations);
    } catch (err) {
      setError(err.message || 'Failed to fetch stations');
    } finally {
      setLoading(false);
    }
  }, [cityId]);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  return { data, loading, error, refetch: fetchStations };
};
