import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { path: '/admin', icon: 'ri-dashboard-line', label: 'Dashboard' },
  { path: '/admin/appointments', icon: 'ri-calendar-line', label: 'Календар' },
  { path: '/admin/blog', icon: 'ri-article-line', label: 'Блог' },
  { path: '/admin/messages', icon: 'ri-mail-line', label: 'Съобщения' },
  { path: '/admin/history', icon: 'ri-history-line', label: 'История' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background-50 border-t border-background-200/70 z-50 safe-area-bottom">
      <div className="flex items-center justify-around h-14 sm:h-16 px-1 w-full sm:max-w-lg sm:mx-auto">
        {navItems.slice(0, 4).map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-0 px-1 sm:px-2 py-1 rounded-lg transition-colors ${
              isActive(item.path)
                ? 'text-primary-500'
                : 'text-foreground-400 hover:text-foreground-600'
            }`}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <i className={`${item.icon} text-base sm:text-lg`}></i>
            </div>
            <span className="text-[9px] sm:text-[10px] leading-tight whitespace-nowrap">{item.label}</span>
          </button>
        ))}
        <button
          onClick={() => navigate('/admin/appointments')}
          className="flex flex-col items-center justify-center gap-0.5 min-w-0 px-1 sm:px-2 py-1 rounded-lg bg-primary-500 text-background-50 -mt-3 sm:-mt-5 h-11 w-11 sm:h-14 sm:w-14 rounded-full shadow-lg hover:bg-primary-600 transition-colors"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-add-line text-lg sm:text-xl"></i>
          </div>
          <span className="text-[9px] leading-tight whitespace-nowrap">Нов час</span>
        </button>
        {navItems.slice(4).map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-0 px-1 sm:px-2 py-1 rounded-lg transition-colors ${
              isActive(item.path)
                ? 'text-primary-500'
                : 'text-foreground-400 hover:text-foreground-600'
            }`}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <i className={`${item.icon} text-base sm:text-lg`}></i>
            </div>
            <span className="text-[9px] sm:text-[10px] leading-tight whitespace-nowrap">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}