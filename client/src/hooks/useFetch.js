import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (body = null, methodOverride = null) => {
    setLoading(true);
    setError(null);
    try {
      const method = methodOverride || options.method || 'GET';
      const config = {
        method,
        url,
        ...(body ? { data: body } : {}),
      };
      
      const response = await axiosInstance(config);
      setData(response.data);
      return response.data;
    } catch (err) {
      const errMessage = err.response?.data?.message || err.response?.data?.errors?.join(', ') || err.message;
      setError(errMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, options.method]);

  useEffect(() => {
    if (options.immediate !== false) {
      fetchData();
    }
  }, [fetchData, options.immediate]);

  return { data, loading, error, execute: fetchData };
};

export default useFetch;
