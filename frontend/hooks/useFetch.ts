import { useState } from 'react';
import type { FetchOptions, UseFetchResult } from 'types';

function useFetch<T = any>(): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async (options: FetchOptions): Promise<T | void> => {
    const { url, method = 'GET', body, headers } = options;
    
    setLoading(true);
    setError(null);

    try {
      const config: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      };

      if (body && method !== 'GET') {
        config.body = JSON.stringify(body);
      }

      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      return result as T;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error);
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, fetchData };
}

export default useFetch;
