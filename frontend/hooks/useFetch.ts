import { useState } from "react";
import type { FetchOptions, UseFetchResult } from "types";

export default function useFetch<T = unknown>(): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchData({ url, method = "GET", body = null, headers = {} }: FetchOptions): Promise<T | void> {
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: body ? JSON.stringify(body) : null,
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const responseData: T = await response.json();
      setData(responseData);
      return responseData;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }

  return { data, error, loading, fetchData };
}
