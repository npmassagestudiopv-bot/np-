import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/pages/admin/components/AdminLayout';

interface Stats {
  todayAppointments: number;
  pendingAppointments: number;
  totalThisMonth: number;
  unreadMessages: number;
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({ todayAppointments: 0, pendingAppointments: 0, totalThisMonth: 0, unreadMessages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    setLoading(true);
    setError('');
    try {
      const today = new Date().toISOString().split('T')[0];
      const firstOfMonth = `${today.slice(0, 7)}-01`;

      const [{ count: todayCount }, { count: pendingCount }, { count: monthCount }, { count: msgCount }] = await Promise.all([
        supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('appointment_date', today).neq('status', 'cancelled'),
        supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('appointments').select('*', { count: 'exact', head: true }).gte('appointment_date', firstOfMonth).neq('status', 'cancelled'),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        todayAppointments: todayCount ?? 0,
        pendingAppointments: pendingCount ?? 0,
        totalThisMonth: monthCount ?? 0,
        unreadMessages: msgCount ?? 0,
      });
    } catch {
      setError('Грешка при зареждане на статистиките.');
    }
    setLoading(false);
  }

  const statCards = [
    { label: 'Днес', value: stats.todayAppointments, icon: 'ri-calendar-check-line', color: 'bg-primary-100 text-primary-700', onClick: () => navigate('/admin/appointments') },
    { label: 'Чакащи', value: stats.pendingAppointments, icon: 'ri-time-line', color: 'bg-amber-100 text-amber-700', onClick: () => navigate('/admin/appointments') },
    { label: 'Този месец', value: stats.totalThisMonth, icon: 'ri-bar-chart-line', color: 'bg-green-100 text-green-700', onClick: () => navigate('/admin/history') },
    { label: 'Съобщения', value: stats.unreadMessages, icon: 'ri-mail-unread-line', color: 'bg-secondary-100 text-secondary-700', onClick: () => navigate('/admin/messages') },
  ];

  return (
    <AdminLayout>
      {loading ? (
        <div className="flex justify-center py-6">
          <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={loadStats} className="mt-2 text-xs text-red-600 underline cursor-pointer">Опитай отново</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {statCards.map((card) => (
              <button
                key={card.label}
                onClick={card.onClick}
                className="bg-background-50 border border-background-200/70 rounded-xl p-4 text-left hover:border-background-300/60 transition-colors cursor-pointer"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${card.color}`}>
                  <i className={`${card.icon} text-base`}></i>
                </div>
                <p className="text-2xl font-semibold text-foreground-950">{card.value}</p>
                <p className="text-xs text-foreground-500 mt-0.5">{card.label}</p>
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/admin/appointments')}
              className="w-full flex items-center gap-3 bg-primary-500 text-background-50 rounded-xl p-4 hover:bg-primary-600 transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-background-50/20 rounded-lg">
                <i className="ri-add-line text-xl"></i>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Нов час</p>
                <p className="text-xs opacity-80">Запази час за клиент</p>
              </div>
              <div className="ml-auto w-5 h-5 flex items-center justify-center">
                <i className="ri-arrow-right-s-line"></i>
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/blog')}
              className="w-full flex items-center gap-3 bg-background-50 border border-background-200/70 rounded-xl p-4 hover:border-background-300/60 transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-secondary-100 rounded-lg">
                <i className="ri-article-line text-secondary-600 text-lg"></i>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground-950">Управление на блог</p>
                <p className="text-xs text-foreground-500">Нови статии, редакция</p>
              </div>
              <div className="ml-auto w-5 h-5 flex items-center justify-center text-foreground-400">
                <i className="ri-arrow-right-s-line"></i>
              </div>
            </button>
          </div>
        </>
      )}
    </AdminLayout>
  );
}