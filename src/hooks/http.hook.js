import { useState, useCallback } from "react";

export const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // воспользуем useCallback поскольку данный метод мы будем помещать
  // внутри нашего приложения (в том числе она может передавать во внутрь доч.компон.)
  const request = useCallback(
    async (
      url,
      method = "GET",
      body = null,
      headers = { "Content-Type": "application/json" }
    ) => {
      setLoading(true);
      // данный запрос необходимо обработать
      try {
        // запрос с объектом настроек
        const response = await fetch(url, {method, body, headers});

        if (!response.ok) {
          throw new Error(`Could not fetch ${url}, status: ${response.status}`);
        }

        const data = await response.json();
        setLoading(false);
        return data;
      } catch(e) {
        setLoading(false);
        setError(true);
        throw e;
      }
    },
    []
  );
  // очистка ошибок
  const clearError = useCallback(() => setError(false), []);

  return {loading, request, error, clearError};
};
