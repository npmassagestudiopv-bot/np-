import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const ADMIN_EMAIL = 'npmassagestudiopv@gmail.com';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user && location.pathname !== '/admin/login') {
      navigate('/admin/login', { replace: true });
      return;
    }

    if (user && user.email?.toLowerCase() !== ADMIN_EMAIL) {
      setAccessDenied(true);
      supabase.auth.signOut().then(() => {
        setTimeout(() => {
          navigate('/admin/login', { replace: true });
          setAccessDenied(false);
        }, 2000);
      });
    }
  }, [user, loading, navigate, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-foreground-500">Зареждане...</p>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-sm w-full text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
            <i className="ri-shield-cross-line text-xl text-red-600"></i>
          </div>
          <h2 className="text-base font-semibold text-red-800 mb-1">Достъпът отказан</h2>
          <p className="text-xs text-red-600">Този имейл няма администраторски права. Ще бъдеш прехвърлен към страницата за вход.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-sm text-foreground-500">Няма активна сесия</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}