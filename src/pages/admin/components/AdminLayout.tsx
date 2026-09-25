import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import BottomNav from './BottomNav';

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/appointments': 'Календар',
  '/admin/blog': 'Блог',
  '/admin/messages': 'Съобщения',
  '/admin/history': 'История',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const title = Object.entries(pageTitles).find(([path]) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  })?.[1] ?? 'Admin';

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background-50">
      <header className="sticky top-0 z-40 bg-background-50/95 backdrop-blur-sm border-b border-background-200/70">
        <div className="flex items-center justify-between h-14 px-3 sm:px-4 w-full sm:max-w-lg sm:mx-auto">
          <h1 className="text-base font-semibold text-foreground-950">{title}</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-foreground-500 hover:text-foreground-700 hover:bg-background-100 transition-colors"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-logout-box-r-line"></i>
            </div>
            <span className="hidden sm:inline">Изход</span>
          </button>
        </div>
      </header>

      <main className="pb-20 sm:pb-24 w-full sm:max-w-lg sm:mx-auto px-3 sm:px-4 py-3 sm:py-4">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}