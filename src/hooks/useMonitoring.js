import { useState, useEffect, useCallback } from 'react';
import { getMonitoringMetrics, getDataQuality, getModelPerformance, getDriftData } from '../services/api';

export const useMonitoringOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMonitoring = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const metrics = await getMonitoringMetrics();
      setData(metrics);
    } catch (err) {
      setError(err.message || 'Failed to fetch monitoring metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonitoring();
  }, [fetchMonitoring]);

  return { data, loading, error, refetch: fetchMonitoring };
};

export const useDataQuality = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const quality = await getDataQuality();
      setData(quality);
    } catch (err) {
      setError(err.message || 'Failed to fetch data quality metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export const useModelPerformance = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const performance = await getModelPerformance();
      setData(performance);
    } catch (err) {
      setError(err.message || 'Failed to fetch model performance');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export const useDriftDetection = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const drift = await getDriftData();
      setData(drift);
    } catch (err) {
      setError(err.message || 'Failed to fetch drift data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
