import { useState, useEffect, useCallback } from 'react';
import { getIncidents, startRetraining } from '../services/api';

export const useIncidents = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIncidents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const incidents = await getIncidents();
      setData(incidents);
    } catch (err) {
      setError(err.message || 'Failed to fetch incidents');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  return { data, loading, error, refetch: fetchIncidents };
};

export const useRetraining = () => {
  const [status, setStatus] = useState('Recommended');
  const [loading, setLoading] = useState(false);

  const triggerRetraining = async () => {
    setLoading(true);
    setStatus('In Progress');
    try {
      await startRetraining();
      setStatus('Completed');
    } catch (e) {
      setStatus('Failed');
    } finally {
      setLoading(false);
    }
  };

  return { status, loading, triggerRetraining };
};
