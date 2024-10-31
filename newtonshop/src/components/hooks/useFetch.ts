import { useState, useEffect } from "react";
import { AxiosError } from "axios";

interface FetchResult<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export const useFetch = <T>(fetchFunction: () => Promise<T>): FetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchFunction();
        setData(result);
        setLoading(false);
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(axiosError.message || "Ошибка загрузки данных");
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchFunction]);

  return { data, error, loading };
};
