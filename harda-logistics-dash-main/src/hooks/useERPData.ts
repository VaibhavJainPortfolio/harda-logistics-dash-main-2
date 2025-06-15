import { useEffect, useState } from 'react';
import { MockERPData } from 'src/types';

export const useERPData = (pollInterval = 10000) => { // default every 10s
  const [data, setData] = useState<MockERPData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchERPData = async () => {
    try {
      const res = await fetch('http://192.168.1.5:5000/api/data');
      if (!res.ok) throw new Error('Failed to fetch data');
      const json: MockERPData = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchERPData(); // initial load

    const interval = setInterval(fetchERPData, pollInterval);

    return () => clearInterval(interval); // cleanup
  }, [pollInterval]);

  return { data, loading, error };
};
