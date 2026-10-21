import { useState, useEffect, useCallback } from 'react';
import { getCities } from '../services/api';

export const useCities = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const cities = await getCities();
      setData(cities);
    } catch (err) {
      setError(err.message || 'Failed to fetch cities');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  return { data, loading, error, refetch: fetchCities };
};
