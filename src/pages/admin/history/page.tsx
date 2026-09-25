import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/pages/admin/components/AdminLayout';

interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  location: string;
  appointment_date: string;
  appointment_time: string;
  message: string;
  status: string;
  created_at: string;
}

const serviceLabels: Record<string, string> = {
  classical: 'Класически',
  sport: 'Спортен',
  anticellulite: 'Антицелулитен',
  aromatherapy: 'Ароматерапия',
  back: 'Масаж гръб',
};

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-primary-100 text-primary-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  pending: 'Чака',
  confirmed: 'Потвърден',
  completed: 'Завършен',
  cancelled: 'Отказан',
};

export default function AdminHistoryPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: err } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: false })
        .order('appointment_time', { ascending: false })
        .limit(200);

      if (err) throw err;
      setAppointments(data ?? []);
    } catch {
      setError('Грешка при зареждане.');
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const statuses = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

  const filtered = appointments.filter((a) => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        a.name.toLowerCase().includes(q) ||
        a.phone.includes(q) ||
        a.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Stats
  const totalAll = appointments.filter((a) => a.status !== 'cancelled').length;
  const totalCompleted = appointments.filter((a) => a.status === 'completed').length;
  const totalCancelled = appointments.filter((a) => a.status === 'cancelled').length;

  return (
    <AdminLayout>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-background-50 border border-background-200/70 rounded-xl p-3 text-center">
          <p className="text-lg font-semibold text-foreground-950">{totalAll}</p>
          <p className="text-[10px] text-foreground-500">Общо</p>
        </div>
        <div className="bg-background-50 border border-background-200/70 rounded-xl p-3 text-center">
          <p className="text-lg font-semibold text-green-600">{totalCompleted}</p>
          <p className="text-[10px] text-foreground-500">Завършени</p>
        </div>
        <div className="bg-background-50 border border-background-200/70 rounded-xl p-3 text-center">
          <p className="text-lg font-semibold text-red-600">{totalCancelled}</p>
          <p className="text-[10px] text-foreground-500">Отказани</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-foreground-400">
          <i className="ri-search-line"></i>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          className="w-full h-10 pl-9 pr-3 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
          placeholder="Търси по име, телефон или имейл..."
        />
      </div>

      {/* Status filter */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(0); }}
            className={`px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === s
                ? 'bg-primary-500 text-background-50'
                : 'bg-background-100 text-foreground-600 hover:bg-background-200/70'
            }`}
          >
            {s === 'all' ? 'Всички' : statusLabels[s]}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-6">
          <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : paged.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-background-100 flex items-center justify-center">
            <div className="w-7 h-7 flex items-center justify-center text-foreground-400"><i className="ri-history-line text-2xl"></i></div>
          </div>
          <p className="text-sm text-foreground-500">Няма намерени резервации</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {paged.map((a) => (
              <div key={a.id} className="bg-background-50 border border-background-200/70 rounded-xl p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-foreground-950">{a.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${statusColors[a.status]}`}>
                        {statusLabels[a.status]}
                      </span>
                    </div>
                    <p className="text-xs text-foreground-500">{a.phone}</p>
                    <p className="text-xs text-foreground-500">
                      {new Date(a.appointment_date).toLocaleDateString('bg-BG')} · {a.appointment_time} · {serviceLabels[a.service] || a.service}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-background-200/70 disabled:opacity-30 cursor-pointer"
              >
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-left-s-line"></i></div>
              </button>
              <span className="text-xs text-foreground-500">{page + 1} / {totalPages}</span>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-background-200/70 disabled:opacity-30 cursor-pointer"
              >
                <div className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-right-s-line"></i></div>
              </button>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}