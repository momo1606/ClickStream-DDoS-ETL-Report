// hooks/useFetchReport.ts
import { useState, useEffect } from 'react';

const useFetchReport = (brand: string, token: string | null) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!brand || !token) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://0uri1248ug.execute-api.us-east-2.amazonaws.com/prod/report/${brand}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            // 'Access-Control-Allow-Origin': '*',
            // 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            // 'Access-Control-Allow-Headers': 'Content-Type'
          }
        });

        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          const result = await response.json();
          setError(result.message || 'Error fetching data');
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [brand, token]);

  return { data, loading, error };
};

export default useFetchReport;
