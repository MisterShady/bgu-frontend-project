import React, { useState, useEffect } from "react";
import { AxiosError } from "axios";

interface FetchResult<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export const useFetch = <T>(fetchFunction: () => Promise<T>, dependencies: React.DependencyList = []): FetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setData(null);
      try {
        const result = await fetchFunction();
        setData(result);
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(axiosError.message || "Ошибка загрузки данных");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, error, loading };
};
