import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/pages/admin/components/AdminLayout';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  location: string;
  message: string;
  created_at: string;
}

const serviceLabels: Record<string, string> = {
  classical: 'Класически',
  sport: 'Спортен',
  anticellulite: 'Антицелулитен',
  aromatherapy: 'Ароматерапия',
  back: 'Масаж гръб',
};

const locationLabels: Record<string, string> = {
  vt: 'Велико Търново',
  pv: 'Павликени',
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { loadMessages(); }, []);

  async function loadMessages() {
    setLoading(true);
    setError('');
    try {
      const { data, error: err } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (err) throw err;
      setMessages(data ?? []);
    } catch {
      setError('Грешка при зареждане.');
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Изтрий това съобщение?')) return;
    try {
      const { error: err } = await supabase.from('contact_messages').delete().eq('id', id);
      if (err) throw err;
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch {
      setError('Грешка при изтриване.');
    }
  }

  const serviceTypes = ['all', ...new Set(messages.map((m) => m.service))];
  const filtered = filter === 'all' ? messages : messages.filter((m) => m.service === filter);

  return (
    <AdminLayout>
      {/* Service filter tabs */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
        {serviceTypes.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
              filter === s
                ? 'bg-primary-500 text-background-50'
                : 'bg-background-100 text-foreground-600 hover:bg-background-200/70'
            }`}
          >
            {s === 'all' ? 'Всички' : serviceLabels[s] || s}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
          <p className="text-xs text-red-700">{error}</p>
          <button onClick={() => setError('')} className="mt-1 text-xs text-red-600 underline cursor-pointer">Затвори</button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-6">
          <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-background-100 flex items-center justify-center">
            <div className="w-7 h-7 flex items-center justify-center text-foreground-400"><i className="ri-mail-line text-2xl"></i></div>
          </div>
          <p className="text-sm text-foreground-500">Няма съобщения</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
              className="bg-background-50 border border-background-200/70 rounded-xl p-3 cursor-pointer hover:border-background-300/60 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground-950">{msg.name}</p>
                  <p className="text-xs text-foreground-500">{msg.phone} · {msg.email}</p>
                  <div className="flex gap-1.5 mt-1 flex-wrap">
                    <span className="text-[10px] bg-secondary-100 text-secondary-700 px-1.5 py-0.5 rounded">
                      {serviceLabels[msg.service] || msg.service}
                    </span>
                    <span className="text-[10px] bg-background-100 text-foreground-500 px-1.5 py-0.5 rounded">
                      {locationLabels[msg.location] || msg.location}
                    </span>
                    <span className="text-[10px] text-foreground-400">
                      {new Date(msg.created_at).toLocaleDateString('bg-BG')}
                    </span>
                  </div>
                </div>
                <div className="w-5 h-5 flex items-center justify-center text-foreground-400">
                  <i className={`ri-${expandedId === msg.id ? 'arrow-up-s' : 'arrow-down-s'}-line`}></i>
                </div>
              </div>

              {expandedId === msg.id && (
                <div className="mt-3 pt-3 border-t border-background-200/70">
                  <p className="text-sm text-foreground-800 whitespace-pre-wrap">{msg.message || '(няма съобщение)'}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                    className="mt-3 px-3 py-1.5 text-[11px] font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Изтрий
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}