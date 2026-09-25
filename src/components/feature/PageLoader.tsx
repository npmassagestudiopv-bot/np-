import { useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

export default function PageLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPathRef = useRef(location.pathname + location.search);

  useEffect(() => {
    const currentKey = location.pathname + location.search;
    if (currentKey !== prevPathRef.current) {
      prevPathRef.current = currentKey;
      setLoading(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setLoading(false), 900);
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[3px]">
      <div className="h-full bg-primary-500 animate-page-loader" />
    </div>
  );
}