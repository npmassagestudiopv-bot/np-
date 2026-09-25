import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/pages/admin/components/AdminLayout';

// ── Types ──────────────────────────────────────────────
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

// ── Constants ──────────────────────────────────────────
const serviceLabels: Record<string, string> = {
  classical: 'Класически',
  sport: 'Спортен',
  anticellulite: 'Антицелулитен',
  aromatherapy: 'Ароматерапия',
  back: 'Масаж гръб',
};

const serviceIcons: Record<string, string> = {
  classical: 'ri-user-heart-line',
  sport: 'ri-run-line',
  anticellulite: 'ri-body-scan-line',
  aromatherapy: 'ri-plant-line',
  back: 'ri-user-received-line',
};

const locationLabels: Record<string, string> = {
  vt: 'ВТ',
  pv: 'ПВ',
};

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

const statusIcons: Record<string, string> = {
  pending: 'ri-time-line',
  confirmed: 'ri-check-double-line',
  completed: 'ri-check-line',
  cancelled: 'ri-close-line',
};

const statusLabels: Record<string, string> = {
  pending: 'Чака',
  confirmed: 'Потв.',
  completed: 'Готов',
  cancelled: 'Отказ',
};

const VALID_TIMES = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
const ALLOWED_SERVICES = ['classical', 'sport', 'anticellulite', 'aromatherapy', 'back'];
const BG_WEEKDAYS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'нд'];
const BG_MONTHS = ['Януари','Февруари','Март','Април','Май','Юни','Юли','Август','Септември','Октомври','Ноември','Декември'];

// ── Component ──────────────────────────────────────────
export default function AdminAppointmentsPage() {
  // Core state
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(today);

  // Data
  const [monthAppts, setMonthAppts] = useState<Appointment[]>([]);
  const [dayAppts, setDayAppts] = useState<Appointment[]>([]);
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set());
  const [dayLoading, setDayLoading] = useState(false);
  const [monthLoading, setMonthLoading] = useState(true);
  const [error, setError] = useState('');

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  // New appointment modal
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newService, setNewService] = useState('classical');
  const [newLocation, setNewLocation] = useState('vt');
  const [newDate, setNewDate] = useState(today);
  const [newTime, setNewTime] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Single action loading
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Block/unblock day loading
  const [blockLoading, setBlockLoading] = useState(false);

  // ── Calendar helpers ────────────────────────────────
  const daysInMonth = useMemo(() => new Date(currentYear, currentMonth + 1, 0).getDate(), [currentYear, currentMonth]);
  const firstDayJS = useMemo(() => new Date(currentYear, currentMonth, 1).getDay(), [currentYear, currentMonth]);
  const startOffset = useMemo(() => (firstDayJS === 0 ? 6 : firstDayJS - 1), [firstDayJS]);
  const totalCells = useMemo(() => Math.ceil((startOffset + daysInMonth) / 7) * 7, [startOffset, daysInMonth]);

  // Group month appointments by date (for dots)
  const monthApptMap = useMemo(() => {
    const map: Record<string, number> = {};
    monthAppts.forEach((a) => {
      if (a.status === 'cancelled') return;
      map[a.appointment_date] = (map[a.appointment_date] || 0) + 1;
    });
    return map;
  }, [monthAppts]);

  // ── Load month data ─────────────────────────────────
  const loadMonthData = useCallback(async () => {
    setMonthLoading(true);
    try {
      const firstDay = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
      const lastDay = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;

      const [apptRes, blockedRes] = await Promise.all([
        supabase.from('appointments').select('id,status,appointment_date').gte('appointment_date', firstDay).lte('appointment_date', lastDay),
        supabase.from('blocked_dates').select('blocked_date'),
      ]);

      setMonthAppts((apptRes.data ?? []) as Appointment[]);
      setBlockedDates(new Set((blockedRes.data ?? []).map((r: any) => r.blocked_date)));
    } catch {
      setError('Грешка при зареждане на месеца.');
    }
    setMonthLoading(false);
  }, [currentYear, currentMonth, daysInMonth]);

  // ── Load selected day ───────────────────────────────
  const loadDayAppts = useCallback(async () => {
    setDayLoading(true);
    try {
      const { data } = await supabase
        .from('appointments')
        .select('*')
        .eq('appointment_date', selectedDate)
        .order('appointment_time', { ascending: true });
      setDayAppts(data ?? []);
    } catch {
      setError('Грешка при зареждане.');
    }
    setDayLoading(false);
  }, [selectedDate]);

  // ── Load taken slots for form ───────────────────────
  const loadTakenSlots = useCallback(async (d: string, loc: string) => {
    try {
      const otherLoc = loc === 'vt' ? 'pv' : 'vt';
      const [localRes, otherRes] = await Promise.all([
        supabase.from('appointments').select('appointment_time').eq('appointment_date', d).eq('location', loc).neq('status', 'cancelled'),
        supabase.from('appointments').select('appointment_time').eq('appointment_date', d).eq('location', otherLoc).neq('status', 'cancelled'),
      ]);
      const taken = new Set<string>();
      (localRes.data ?? []).forEach((r: any) => taken.add(r.appointment_time));
      (otherRes.data ?? []).forEach((r: any) => {
        taken.add(r.appointment_time);
        const [h, m] = r.appointment_time.split(':').map(Number);
        const nextH = h + 1;
        if (nextH <= 18) taken.add(`${String(nextH).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      });
      setTakenSlots(Array.from(taken));
    } catch {
      setTakenSlots([]);
    }
  }, []);

  useEffect(() => { loadMonthData(); }, [loadMonthData]);
  useEffect(() => { loadDayAppts(); setSelectedIds(new Set()); }, [loadDayAppts]);
  useEffect(() => {
    if (showNewForm) { loadTakenSlots(newDate, newLocation); setNewTime(''); }
  }, [showNewForm, newDate, newLocation, loadTakenSlots]);

  // ── Navigation ──────────────────────────────────────
  function changeMonth(delta: number) {
    let m = currentMonth + delta;
    let y = currentYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setCurrentMonth(m);
    setCurrentYear(y);
  }

  function goToToday() {
    const now = new Date();
    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
    setSelectedDate(today);
  }

  function selectDate(dateStr: string) {
    setSelectedDate(dateStr);
  }

  // ── Block / Unblock day ─────────────────────────────
  async function toggleBlockDay() {
    const isBlocked = blockedDates.has(selectedDate);
    setBlockLoading(true);
    try {
      if (isBlocked) {
        // Unblock
        const { error: unblockErr } = await supabase.from('blocked_dates').delete().eq('blocked_date', selectedDate);
        if (unblockErr) {
          console.error('Unblock error:', unblockErr.message, unblockErr.code, unblockErr.details);
          setError(`Грешка при отблокиране: ${unblockErr.message}`);
          return;
        }
        setBlockedDates((prev) => {
          const next = new Set(prev);
          next.delete(selectedDate);
          return next;
        });
      } else {
        // Block
        const dayApptsCount = dayAppts.filter((a) => a.status !== 'cancelled').length;
        if (dayApptsCount > 0) {
          if (!confirm(`Има ${dayApptsCount} активни резервации за този ден. Сигурен ли си, че искаш да блокираш?`)) {
            setBlockLoading(false);
            return;
          }
        }
        const { error: blockErr } = await supabase.from('blocked_dates').insert({ blocked_date: selectedDate, reason: '' });
        if (blockErr) {
          console.error('Block error:', blockErr.message, blockErr.code, blockErr.details);
          setError(`Грешка при блокиране: ${blockErr.message}`);
          return;
        }
        setBlockedDates((prev) => new Set(prev).add(selectedDate));
      }
    } catch (err: any) {
      console.error('toggleBlockDay exception:', err);
      setError(`Неочаквана грешка: ${err?.message || 'Непозната грешка'}`);
    } finally {
      setBlockLoading(false);
    }
  }

  // ── Single actions ──────────────────────────────────
  async function updateStatus(id: string, status: string) {
    setActionLoading(id);
    try {
      await supabase.from('appointments').update({ status }).eq('id', id);
      setDayAppts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      // Refresh month dots
      loadMonthData();
    } catch {
      setError('Грешка при обновяване.');
    }
    setActionLoading(null);
  }

  async function handleDeleteOne(id: string) {
    if (!confirm('Изтрий тази резервация?')) return;
    setActionLoading(id);
    try {
      await supabase.from('appointments').delete().eq('id', id);
      setDayAppts((prev) => prev.filter((a) => a.id !== id));
      loadMonthData();
    } catch {
      setError('Грешка при изтриване.');
    }
    setActionLoading(null);
  }

  // ── Bulk actions ────────────────────────────────────
  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    const allIds = dayAppts.map((a) => a.id);
    setSelectedIds(new Set(allIds));
  }

  function deselectAll() {
    setSelectedIds(new Set());
  }

  async function bulkUpdateStatus(status: string) {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    setBulkLoading(true);
    try {
      for (const id of ids) {
        await supabase.from('appointments').update({ status }).eq('id', id);
      }
      setDayAppts((prev) => prev.map((a) => (ids.includes(a.id) ? { ...a, status } : a)));
      setSelectedIds(new Set());
      loadMonthData();
    } catch {
      setError('Грешка при масова операция.');
    }
    setBulkLoading(false);
  }

  async function bulkDelete() {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    if (!confirm(`Изтрий ${ids.length} резервации?`)) return;
    setBulkLoading(true);
    try {
      for (const id of ids) {
        await supabase.from('appointments').delete().eq('id', id);
      }
      setDayAppts((prev) => prev.filter((a) => !ids.includes(a.id)));
      setSelectedIds(new Set());
      loadMonthData();
    } catch {
      setError('Грешка при изтриване.');
    }
    setBulkLoading(false);
  }

  // ── Create appointment ──────────────────────────────
  async function handleCreateAppointment(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    if (!newName || !newPhone || !newTime) { setFormError('Име, телефон и час са задължителни.'); return; }
    if (blockedDates.has(newDate)) { setFormError('Този ден е блокиран (почивен).'); return; }
    if (takenSlots.includes(newTime)) { setFormError('Този час вече е зает.'); return; }

    setFormLoading(true);
    try {
      const { error: err } = await supabase.from('appointments').insert({
        name: newName.trim(), email: newEmail.trim() || 'admin@npstudio.com',
        phone: newPhone.trim(), service: newService, location: newLocation,
        appointment_date: newDate, appointment_time: newTime,
        message: newMessage.trim(), status: 'confirmed',
      });
      if (err) { setFormError(err.code === '23505' ? 'Този час току-що беше зает.' : err.message); setFormLoading(false); return; }

      setShowNewForm(false);
      resetForm();
      if (newDate === selectedDate) loadDayAppts();
      else { setSelectedDate(newDate); setCurrentMonth(new Date(newDate).getMonth()); setCurrentYear(new Date(newDate).getFullYear()); }
      loadMonthData();
    } catch {
      setFormError('Грешка при запазване.');
    }
    setFormLoading(false);
  }

  function resetForm() {
    setNewName(''); setNewPhone(''); setNewEmail(''); setNewService('classical');
    setNewLocation('vt'); setNewDate(today); setNewTime(''); setNewMessage('');
  }

  function openNewFormWithDate(d: string) {
    setNewDate(d);
    setShowNewForm(true);
    loadTakenSlots(d, 'vt');
  }

  // ── Calendar cells ──────────────────────────────────
  const calendarCells = useMemo(() => {
    const cells: Array<{ day: number | null; dateStr: string }> = [];
    // Leading blanks
    for (let i = 0; i < startOffset; i++) {
      cells.push({ day: null, dateStr: '' });
    }
    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ day: d, dateStr });
    }
    // Trailing blanks
    while (cells.length < totalCells) {
      cells.push({ day: null, dateStr: '' });
    }
    return cells;
  }, [currentYear, currentMonth, daysInMonth, startOffset, totalCells]);

  // ── Render ──────────────────────────────────────────
  const isBlocked = blockedDates.has(selectedDate);
  const selDateDisplay = selectedDate === today
    ? 'Днес'
    : new Date(selectedDate).toLocaleDateString('bg-BG', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <AdminLayout>
      {/* ── Month Calendar ──────────────────────────── */}
      <div className="bg-background-50 border border-background-200/70 rounded-2xl overflow-hidden mb-4">
        {/* Month header */}
        <div className="flex items-center justify-between px-3 py-3 border-b border-background-200/70">
          <button onClick={() => changeMonth(-1)} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-background-100 transition-colors cursor-pointer">
            <div className="w-5 h-5 flex items-center justify-center text-foreground-600"><i className="ri-arrow-left-s-line text-lg"></i></div>
          </button>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground-950">{BG_MONTHS[currentMonth]} {currentYear}</p>
            <button onClick={goToToday} className="text-[10px] text-primary-500 hover:underline cursor-pointer">Днес</button>
          </div>
          <button onClick={() => changeMonth(1)} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-background-100 transition-colors cursor-pointer">
            <div className="w-5 h-5 flex items-center justify-center text-foreground-600"><i className="ri-arrow-right-s-line text-lg"></i></div>
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 px-1 pt-2 pb-1">
          {BG_WEEKDAYS.map((wd) => (
            <div key={wd} className="text-center text-[10px] font-medium text-foreground-400 uppercase py-1">{wd}</div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 px-1 pb-2 gap-y-0.5">
          {calendarCells.map((cell, idx) => {
            if (cell.day === null) {
              return <div key={`empty-${idx}`} className="aspect-square" />;
            }
            const isToday = cell.dateStr === today;
            const isSel = cell.dateStr === selectedDate;
            const isBlk = blockedDates.has(cell.dateStr);
            const count = monthApptMap[cell.dateStr] || 0;

            return (
              <button
                key={cell.dateStr}
                onClick={() => selectDate(cell.dateStr)}
                className={`aspect-square flex flex-col items-center justify-center rounded-xl text-xs transition-all cursor-pointer relative ${
                  isSel
                    ? 'bg-primary-500 text-background-50 shadow-sm'
                    : isBlk
                      ? 'bg-red-50 text-red-400'
                      : isToday
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-foreground-700 hover:bg-background-100'
                }`}
              >
                <span className={`font-medium ${isSel ? 'text-background-50' : isBlk ? 'text-red-400' : ''}`}>{cell.day}</span>
                {count > 0 && (
                  <div className={`flex gap-0.5 mt-0.5 ${isSel ? '' : ''}`}>
                    {count <= 3 ? (
                      Array.from({ length: count }).map((_, i) => (
                        <span key={i} className={`w-1 h-1 rounded-full ${isSel ? 'bg-background-50' : isBlk ? 'bg-red-300' : 'bg-primary-400'}`} />
                      ))
                    ) : (
                      <span className={`text-[8px] font-bold ${isSel ? 'text-background-50' : isBlk ? 'text-red-400' : 'text-primary-500'}`}>{count}</span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected day info bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-background-200/70 bg-background-50">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground-950 capitalize">{selDateDisplay}</span>
            {isBlocked && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Почивен</span>}
          </div>
          <button
            onClick={toggleBlockDay}
            disabled={blockLoading}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
              blockLoading
                ? 'bg-background-100 text-foreground-400 cursor-not-allowed'
                : isBlocked
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-red-50 text-red-600 hover:bg-red-100'
            }`}
          >
            {blockLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-foreground-400 border-t-transparent rounded-full animate-spin"></div>
                Зареждане...
              </>
            ) : (
              <>
                <div className="w-3.5 h-3.5 flex items-center justify-center">
                  <i className={`${isBlocked ? 'ri-check-line' : 'ri-close-line'} text-sm`}></i>
                </div>
                {isBlocked ? 'Работен' : 'Почивен'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Error ────────────────────────────────────── */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-start justify-between gap-2">
          <p className="text-xs text-red-700">{error}</p>
          <button onClick={() => setError('')} className="w-5 h-5 flex items-center justify-center text-red-400 hover:text-red-600 flex-shrink-0 cursor-pointer">
            <i className="ri-close-line"></i>
          </button>
        </div>
      )}

      {/* ── Day appointments ─────────────────────────── */}
      {dayLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-7 h-7 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : dayAppts.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-background-100 flex items-center justify-center">
            <div className="w-6 h-6 flex items-center justify-center text-foreground-300"><i className="ri-calendar-line text-xl"></i></div>
          </div>
          <p className="text-sm text-foreground-500">Няма резервации</p>
          {isBlocked && <p className="text-xs text-red-400 mt-1">Денят е почивен</p>}
          <button
            onClick={() => openNewFormWithDate(selectedDate)}
            disabled={isBlocked}
            className={`mt-3 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
              isBlocked
                ? 'bg-background-100 text-foreground-400 cursor-not-allowed'
                : 'bg-primary-500 text-background-50 hover:bg-primary-600'
            }`}
          >
            <div className="w-4 h-4 flex items-center justify-center inline mr-1"><i className="ri-add-line"></i></div>
            Запази час за {selDateDisplay.split(',')[0]}
          </button>
        </div>
      ) : (
        <>
          {/* Select all bar */}
          {dayAppts.length > 1 && (
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={selectedIds.size === dayAppts.length ? deselectAll : selectAll}
                className="text-[11px] text-foreground-500 hover:text-foreground-700 underline cursor-pointer"
              >
                {selectedIds.size === dayAppts.length ? 'Махни всички' : 'Избери всички'}
              </button>
              {selectedIds.size > 0 && (
                <span className="text-[11px] text-primary-500 font-medium">{selectedIds.size} избрани</span>
              )}
            </div>
          )}

          {/* Appointments list */}
          <div className="space-y-2">
            {dayAppts.map((apt) => (
              <div
                key={apt.id}
                className={`relative bg-background-50 border rounded-xl p-3 transition-all ${
                  selectedIds.has(apt.id)
                    ? 'border-primary-400 bg-primary-50/50 ring-1 ring-primary-300'
                    : 'border-background-200/70'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleSelect(apt.id)}
                    className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${
                      selectedIds.has(apt.id)
                        ? 'bg-primary-500 border-primary-500'
                        : 'border-background-300/60 hover:border-primary-300'
                    }`}
                  >
                    {selectedIds.has(apt.id) && (
                      <div className="w-3 h-3 flex items-center justify-center text-background-50"><i className="ri-check-line text-xs"></i></div>
                    )}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-semibold text-foreground-950">{apt.appointment_time}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${statusColors[apt.status]}`}>
                        {statusLabels[apt.status]}
                      </span>
                      <span className="text-[10px] bg-background-100 text-foreground-500 px-1.5 py-0.5 rounded-full">
                        {locationLabels[apt.location]}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground-900">{apt.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-foreground-500">{apt.phone}</span>
                      <span className="text-[10px] text-foreground-400 flex items-center gap-0.5">
                        <div className="w-3 h-3 flex items-center justify-center"><i className={`${serviceIcons[apt.service] || 'ri-price-tag-3-line'} text-[10px]`}></i></div>
                        {serviceLabels[apt.service]}
                      </span>
                    </div>
                    {apt.message && (
                      <p className="text-xs text-foreground-400 mt-1 italic line-clamp-1">{apt.message}</p>
                    )}

                    {/* Quick actions */}
                    <div className="flex gap-1.5 mt-2.5 flex-wrap">
                      {apt.status === 'pending' && (
                        <>
                          <button onClick={() => updateStatus(apt.id, 'confirmed')} disabled={actionLoading === apt.id}
                            className="px-3 py-1.5 text-[11px] font-medium rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 disabled:opacity-50 transition-colors whitespace-nowrap cursor-pointer">
                            Потвърди
                          </button>
                          <button onClick={() => updateStatus(apt.id, 'cancelled')} disabled={actionLoading === apt.id}
                            className="px-3 py-1.5 text-[11px] font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 transition-colors whitespace-nowrap cursor-pointer">
                            Откажи
                          </button>
                        </>
                      )}
                      {apt.status === 'confirmed' && (
                        <>
                          <button onClick={() => updateStatus(apt.id, 'completed')} disabled={actionLoading === apt.id}
                            className="px-3 py-1.5 text-[11px] font-medium rounded-lg bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50 transition-colors whitespace-nowrap cursor-pointer">
                            Завърши
                          </button>
                          <button onClick={() => updateStatus(apt.id, 'cancelled')} disabled={actionLoading === apt.id}
                            className="px-3 py-1.5 text-[11px] font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 transition-colors whitespace-nowrap cursor-pointer">
                            Откажи
                          </button>
                        </>
                      )}
                      {(apt.status === 'completed' || apt.status === 'cancelled') && (
                        <button onClick={() => handleDeleteOne(apt.id)} disabled={actionLoading === apt.id}
                          className="px-3 py-1.5 text-[11px] font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 transition-colors whitespace-nowrap cursor-pointer">
                          Изтрий
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Bulk action bar ──────────────────────────── */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-[72px] left-0 right-0 z-40 px-4">
          <div className="max-w-lg mx-auto bg-foreground-950 rounded-2xl p-3 shadow-lg flex items-center gap-2 flex-wrap">
            <span className="text-xs text-background-50 font-medium mr-1">{selectedIds.size} избрани</span>
            <button
              onClick={() => bulkUpdateStatus('confirmed')}
              disabled={bulkLoading}
              className="px-3 py-1.5 text-[11px] font-medium rounded-lg bg-emerald-500 text-background-50 hover:bg-emerald-600 disabled:opacity-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              Всички потв.
            </button>
            <button
              onClick={() => bulkUpdateStatus('completed')}
              disabled={bulkLoading}
              className="px-3 py-1.5 text-[11px] font-medium rounded-lg bg-green-500 text-background-50 hover:bg-green-600 disabled:opacity-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              Всички готови
            </button>
            <button
              onClick={() => bulkUpdateStatus('cancelled')}
              disabled={bulkLoading}
              className="px-3 py-1.5 text-[11px] font-medium rounded-lg bg-amber-500 text-background-50 hover:bg-amber-600 disabled:opacity-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              Всички отказ
            </button>
            <button
              onClick={bulkDelete}
              disabled={bulkLoading}
              className="px-3 py-1.5 text-[11px] font-medium rounded-lg bg-red-500 text-background-50 hover:bg-red-600 disabled:opacity-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              Изтрий
            </button>
            <button onClick={deselectAll} className="ml-auto w-7 h-7 flex items-center justify-center rounded-lg bg-background-50/10 text-background-50 hover:bg-background-50/20 cursor-pointer">
              <div className="w-4 h-4 flex items-center justify-center"><i className="ri-close-line"></i></div>
            </button>
          </div>
        </div>
      )}

      {/* ── Sticky "Запази час" button ────────────────── */}
      <button
        onClick={() => openNewFormWithDate(selectedDate)}
        disabled={isBlocked}
        className={`fixed bottom-[72px] right-4 z-30 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-lg transition-all whitespace-nowrap cursor-pointer ${
          isBlocked
            ? 'bg-background-200 text-foreground-400 cursor-not-allowed shadow-none'
            : 'bg-primary-500 text-background-50 hover:bg-primary-600 hover:shadow-xl active:scale-95'
        } ${selectedIds.size > 0 ? 'opacity-0 pointer-events-none' : ''}`}
      >
        <div className="w-5 h-5 flex items-center justify-center"><i className="ri-add-line text-lg"></i></div>
        <span className="text-sm font-semibold">Запази час</span>
      </button>

      {/* ── New Appointment Modal ─────────────────────── */}
      {showNewForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center" onClick={() => { setShowNewForm(false); resetForm(); }}>
          <div className="bg-background-50 w-full max-w-lg max-h-[90vh] rounded-t-2xl sm:rounded-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 bg-background-50 border-b border-background-200/70 px-4 py-3.5 flex items-center justify-between z-10">
              <div>
                <h2 className="text-base font-semibold text-foreground-950">Нов час</h2>
                <p className="text-xs text-foreground-500">{new Date(newDate).toLocaleDateString('bg-BG', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              </div>
              <button onClick={() => { setShowNewForm(false); resetForm(); }} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-background-100 cursor-pointer">
                <div className="w-5 h-5 flex items-center justify-center text-foreground-600"><i className="ri-close-line text-lg"></i></div>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateAppointment} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground-700 mb-1.5">Име *</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder:text-foreground-300"
                  placeholder="Име на клиент" autoComplete="off" />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground-700 mb-1.5">Телефон *</label>
                <input type="tel" value={newPhone} onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder:text-foreground-300"
                  placeholder="0888 123 456" autoComplete="off" />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground-700 mb-1.5">Имейл (по желание)</label>
                <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder:text-foreground-300"
                  placeholder="client@example.com" autoComplete="off" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground-700 mb-1.5">Услуга</label>
                  <select value={newService} onChange={(e) => setNewService(e.target.value)}
                    className="w-full h-12 px-3 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400 cursor-pointer">
                    {ALLOWED_SERVICES.map((s) => <option key={s} value={s}>{serviceLabels[s]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground-700 mb-1.5">Локация</label>
                  <select value={newLocation} onChange={(e) => { setNewLocation(e.target.value); loadTakenSlots(newDate, e.target.value); }}
                    className="w-full h-12 px-3 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400 cursor-pointer">
                    <option value="vt">Велико Търново</option>
                    <option value="pv">Павликени</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground-700 mb-1.5">Дата</label>
                <input type="date" value={newDate} onChange={(e) => { setNewDate(e.target.value); loadTakenSlots(e.target.value, newLocation); }}
                  className="w-full h-12 px-4 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400 cursor-pointer" />
                {blockedDates.has(newDate) && (
                  <p className="text-xs text-red-500 mt-1">Внимание: този ден е почивен!</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground-700 mb-1.5">Час * ({takenSlots.length}/10 заети)</label>
                <div className="grid grid-cols-5 gap-2">
                  {VALID_TIMES.map((t) => {
                    const isTaken = takenSlots.includes(t);
                    return (
                      <button key={t} type="button" disabled={isTaken}
                        onClick={() => setNewTime(t)}
                        className={`h-11 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                          isTaken
                            ? 'bg-red-50 text-red-300 border border-red-200 cursor-not-allowed opacity-60'
                            : newTime === t
                              ? 'bg-primary-500 text-background-50 border border-primary-500 shadow-sm'
                              : 'bg-background-50 border border-background-200/70 text-foreground-700 hover:border-primary-400 hover:bg-primary-50'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground-700 mb-1.5">Бележка</label>
                <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-background-200/70 bg-background-50 text-sm text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none placeholder:text-foreground-300"
                  placeholder="Допълнителна информация..." />
              </div>

              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-xs text-red-700">{formError}</p>
                </div>
              )}

              <button type="submit" disabled={formLoading}
                className="w-full h-12 bg-primary-500 text-background-50 rounded-xl text-sm font-semibold hover:bg-primary-600 disabled:opacity-50 transition-all whitespace-nowrap cursor-pointer active:scale-[0.98]">
                {formLoading ? 'Запазване...' : 'Запази час'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}