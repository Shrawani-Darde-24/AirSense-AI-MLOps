import { useState, useEffect, useCallback } from 'react';
import { getHistoricalData } from '../services/api';

export const useHistoricalData = (stationId, pollutant, timeRange) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistorical = useCallback(async () => {
    if (!stationId || !pollutant || !timeRange) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const historical = await getHistoricalData(stationId, pollutant, timeRange);
      setData(historical);
    } catch (err) {
      setError(err.message || 'Failed to fetch historical data');
    } finally {
      setLoading(false);
    }
  }, [stationId, pollutant, timeRange]);

  useEffect(() => {
    fetchHistorical();
  }, [fetchHistorical]);

  return { data, loading, error, refetch: fetchHistorical };
};
