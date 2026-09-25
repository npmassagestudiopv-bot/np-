import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const ADMIN_EMAIL = 'npmassagestudiopv@gmail.com';

export default function AdminLoginPage() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Navigate in an effect, never during render (avoids React/StrictMode bugs).
  useEffect(() => {
    if (user) {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  if (user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Моля, попълни всички полета.');
      return;
    }

    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setError('Само администраторският акаунт има достъп до този панел.');
      return;
    }

    setLoading(true);
    // Safety net so the button can never stay stuck on "Зареждане...".
    const safety = setTimeout(() => setLoading(false), 20000);

    try {
      const { error: err } = await signIn(email.trim(), password);
      if (err) {
        if (err.message.includes('Invalid login') || err.message.includes('Invalid email')) {
          setError('Грешен имейл или парола.');
        } else if (err.message.includes('Email not confirmed')) {
          setError('Моля, потвърди имейла си първо.');
        } else {
          setError(err.message);
        }
      } else {
        // Redirect happens through the effect watching the auth user.
        navigate('/admin', { replace: true });
      }
    } catch {
      setError('Нещо се обърка. Опитай отново.');
    } finally {
      clearTimeout(safety);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-xl font-semibold text-foreground-950 mb-1">NP Massage Studio</h1>
          <p className="text-sm text-foreground-500">Администраторски панел</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-background-50 border border-background-200/70 rounded-xl p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground-700 mb-1">Имейл</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-3 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              placeholder="admin@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground-700 mb-1">Парола</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-3 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              placeholder="••••••"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-primary-500 text-background-50 rounded-lg text-sm font-medium hover:bg-primary-600 disabled:opacity-50 transition-colors whitespace-nowrap cursor-pointer"
          >
            {loading ? 'Зареждане...' : 'Влез'}
          </button>
        </form>

        <p className="text-center text-xs text-foreground-400 mt-4">
          Администраторският акаунт се създава само през{' '}
          <strong className="text-foreground-600">Supabase Dashboard</strong>. Ако нямаш достъп, свържи се с администратора.
        </p>
      </div>
    </div>
  );
}