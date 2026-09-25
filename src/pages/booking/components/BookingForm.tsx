import { useTranslation } from 'react-i18next';
import { useEffect, useState, useMemo, useRef } from 'react';
import { getBookingOps } from '@/lib/supabase';

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00',
];

const services = [
  {
    key: 'classical',
    icon: 'ri-body-scan-line',
    price: '25 €',
    duration: '60 мин',
  },
  {
    key: 'sport',
    icon: 'ri-run-line',
    price: '25 €',
    duration: '60 мин',
  },
  {
    key: 'anticellulite',
    icon: 'ri-heart-pulse-line',
    price: '20 €',
    duration: '40 мин',
  },
  {
    key: 'aromatherapy',
    icon: 'ri-leaf-line',
    price: '30 €',
    duration: '60 мин',
  },
  {
    key: 'back',
    icon: 'ri-armchair-line',
    price: '15 €',
    duration: '40 мин',
  },
];

const locations = [
  { key: 'vt', icon: 'ri-building-line', color: 'primary' },
  { key: 'pv', icon: 'ri-home-smile-line', color: 'accent' },
];

export default function BookingForm() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    location: '',
    appointment_date: '',
    appointment_time: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'slotTaken'>('idle');
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [dayBlocked, setDayBlocked] = useState(false);

  // Cached lazy-loaded booking operations
  const bookingOpsRef = useRef<Awaited<ReturnType<typeof getBookingOps>> | null>(null);

  const ensureBookingOps = async () => {
    if (!bookingOpsRef.current) {
      bookingOpsRef.current = await getBookingOps();
    }
    return bookingOpsRef.current;
  };

  // Fetch available slots when date and location are selected
  useEffect(() => {
    const { appointment_date, location } = formData;
    if (!appointment_date || !location) {
      setTakenSlots([]);
      setDayBlocked(false);
      return;
    }
    let cancelled = false;
    setLoadingSlots(true);
    ensureBookingOps()
      .then((ops) => ops.fetchAvailableSlots(appointment_date, location))
      .then(({ takenSlots: slots, blocked }) => {
        if (cancelled) return;
        setTakenSlots(slots);
        setDayBlocked(blocked);
        if (blocked) {
          setFormData((prev) => ({ ...prev, appointment_time: '' }));
        }
      })
      .catch(() => {
        if (!cancelled) { setTakenSlots([]); setDayBlocked(false); }
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });
    return () => { cancelled = true; };
  }, [formData.appointment_date, formData.location]);

  // Clear selected time if it becomes taken
  useEffect(() => {
    if (formData.appointment_time && takenSlots.includes(formData.appointment_time)) {
      setFormData((prev) => ({ ...prev, appointment_time: '' }));
    }
  }, [takenSlots, formData.appointment_time]);

  const validate = (field?: string) => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = t('contactRequired');
    if (!formData.phone.trim()) newErrors.phone = t('contactRequired');
    if (!formData.email.trim()) newErrors.email = t('contactRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t('contactInvalidEmail');
    if (!formData.service) newErrors.service = t('contactRequired');
    if (!formData.location) newErrors.location = t('contactRequired');
    if (!formData.appointment_date) newErrors.appointment_date = t('contactRequired');
    if (!formData.appointment_time) newErrors.appointment_time = t('contactRequired');
    if (formData.appointment_time && takenSlots.includes(formData.appointment_time)) {
      newErrors.appointment_time = 'Този час вече е зает. Моля, изберете друг.';
    }
    if (formData.message.length > 500) newErrors.message = 'Max 500 characters';
    if (field) {
      return newErrors[field] || '';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setStatus('idle');
    try {
      const ops = await ensureBookingOps();
      const result = await ops.invokeBooking({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        location: formData.location,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        message: formData.message,
      });
      if (result?.error === 'Slot already taken') {
        setStatus('slotTaken');
        const { takenSlots: slots } = await ops.fetchAvailableSlots(formData.appointment_date, formData.location);
        setTakenSlots(slots);
        setErrors((prev) => ({ ...prev, appointment_time: 'Този час вече е зает. Моля, изберете друг.' }));
      } else if (result?.error === 'Day is blocked') {
        setDayBlocked(true);
        setFormData((prev) => ({ ...prev, appointment_time: '' }));
        setErrors((prev) => ({ ...prev, appointment_date: 'Този ден е почивен. Моля, изберете друга дата.' }));
      } else {
        setStatus('success');
        setFormData({
          name: '', email: '', phone: '', service: '', location: '',
          appointment_date: '', appointment_time: '', message: '',
        });
        setTouched({});
        setErrors({});
        setTakenSlots([]);
      }
    } catch {
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (errors[field]) {
      setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
    }
    if (status === 'slotTaken') setStatus('idle');
  };

  const minDate = useMemo(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  const inputBase = 'w-full px-4 py-3 rounded-lg border text-base md:text-sm bg-background-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-400/50';

  const getInputClasses = (field: string) => {
    const hasError = touched[field] && errors[field];
    return `${inputBase} ${hasError ? 'border-red-300 bg-red-50/30' : 'border-background-200 hover:border-background-300'}`;
  };

  return (
    <div>
      {/* Status Messages */}
      {status === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6 flex items-start gap-3 animate-fade-in">
          <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full flex-shrink-0">
            <i className="ri-checkbox-circle-line text-green-600" />
          </div>
          <div>
            <p className="font-medium text-green-800 text-sm">Резервацията е получена!</p>
            <p className="text-sm text-green-600 mt-0.5">{t('bookingSuccess') || 'Ще се свържем с вас за потвърждение.'}</p>
          </div>
        </div>
      )}

      {status === 'slotTaken' && (
        <div className="bg-accent-50 border border-accent-200 rounded-xl p-5 mb-6 flex items-start gap-3 animate-fade-in">
          <div className="w-10 h-10 flex items-center justify-center bg-accent-100 rounded-full flex-shrink-0">
            <i className="ri-time-line text-accent-600" />
          </div>
          <div>
            <p className="font-medium text-accent-800 text-sm">Часът вече е зает</p>
            <p className="text-sm text-accent-600 mt-0.5">Този час току-що беше резервиран от друг клиент. Моля, изберете друг час от списъка.</p>
          </div>
        </div>
      )}

      {dayBlocked && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 flex items-start gap-3 animate-fade-in">
          <div className="w-10 h-10 flex items-center justify-center bg-red-100 rounded-full flex-shrink-0">
            <i className="ri-close-circle-line text-red-600" />
          </div>
          <div>
            <p className="font-medium text-red-800 text-sm">Почивен ден</p>
            <p className="text-sm text-red-600 mt-0.5">Студиото не работи на тази дата. Моля, изберете друга дата за вашия час.</p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 flex items-start gap-3 animate-fade-in">
          <div className="w-10 h-10 flex items-center justify-center bg-red-100 rounded-full flex-shrink-0">
            <i className="ri-error-warning-line text-red-600" />
          </div>
          <div>
            <p className="font-medium text-red-800 text-sm">Възникна грешка</p>
            <p className="text-sm text-red-600 mt-0.5">{t('bookingError') || 'Моля, обадете се на +359 988 926 120.'}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Personal Data */}
        <div className="bg-background-100 rounded-2xl p-5 md:p-6 border border-background-200/70">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 flex items-center justify-center bg-primary-500 rounded-full">
              <span className="text-background-50 text-sm font-semibold">1</span>
            </div>
            <h3 className="font-heading text-base font-semibold text-foreground-950">Вашите данни</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="booking-name" className="block text-sm font-medium text-foreground-800 mb-1.5">
                {t('contactName')} *
              </label>
              <input
                id="booking-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => validate('name')}
                className={getInputClasses('name')}
                placeholder="Вашето име"
                autoComplete="name"
              />
              {touched.name && errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="booking-phone" className="block text-sm font-medium text-foreground-800 mb-1.5">
                {t('contactPhone')} *
              </label>
              <input
                id="booking-phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                onBlur={() => validate('phone')}
                className={getInputClasses('phone')}
                placeholder="+359 888 123 456"
                autoComplete="tel"
              />
              {touched.phone && errors.phone && (
                <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="booking-email" className="block text-sm font-medium text-foreground-800 mb-1.5">
              {t('contactEmail')} *
            </label>
            <input
              id="booking-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => validate('email')}
              className={getInputClasses('email')}
              placeholder="email@abv.bg"
              autoComplete="email"
            />
            {touched.email && errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Step 2: Service Selection */}
        <div className="bg-background-100 rounded-2xl p-5 md:p-6 border border-background-200/70">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 flex items-center justify-center bg-primary-500 rounded-full">
              <span className="text-background-50 text-sm font-semibold">2</span>
            </div>
            <h3 className="font-heading text-base font-semibold text-foreground-950">Изберете услуга</h3>
          </div>

          {touched.service && errors.service && (
            <p className="text-xs text-red-500 mb-3">{errors.service}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {services.map((service) => {
              const isSelected = formData.service === service.key;
              const labelKey = `service${service.key.charAt(0).toUpperCase() + service.key.slice(1)}` as const;
              const descKey = `${labelKey}Desc` as const;
              return (
                <button
                  key={service.key}
                  type="button"
                  onClick={() => handleChange('service', service.key)}
                  className={`relative text-left p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'border-primary-400 bg-primary-50/50 ring-1 ring-primary-400/30'
                      : 'border-background-200 hover:border-background-300 hover:bg-background-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0 ${
                      isSelected ? 'bg-primary-500 text-background-50' : 'bg-background-200/70 text-foreground-500'
                    }`}>
                      <i className={`${service.icon} text-lg`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${isSelected ? 'text-primary-700' : 'text-foreground-800'}`}>
                        {t(labelKey)}
                      </p>
                      <p className="text-xs text-foreground-500 mt-0.5 line-clamp-2">{t(descKey)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs font-semibold ${isSelected ? 'text-primary-600' : 'text-foreground-600'}`}>
                          {service.price}
                        </span>
                        <span className="text-xs text-foreground-400">· {service.duration}</span>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 flex items-center justify-center bg-primary-500 rounded-full flex-shrink-0">
                        <i className="ri-check-line text-background-50 text-xs" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Location, Date, Time */}
        <div className="bg-background-100 rounded-2xl p-5 md:p-6 border border-background-200/70">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 flex items-center justify-center bg-primary-500 rounded-full">
              <span className="text-background-50 text-sm font-semibold">3</span>
            </div>
            <h3 className="font-heading text-base font-semibold text-foreground-950">Локация, дата и час</h3>
          </div>

          {/* Location Cards */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-foreground-800 mb-2">
              {t('contactLocation')} *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {locations.map((loc) => {
                const isSelected = formData.location === loc.key;
                const titleKey = `location${loc.key === 'vt' ? 'Vt' : 'Pv'}Title` as const;
                const addressKey = `location${loc.key === 'vt' ? 'Vt' : 'Pv'}Address` as const;
                return (
                  <button
                    key={loc.key}
                    type="button"
                    onClick={() => handleChange('location', loc.key)}
                    className={`relative text-left p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? loc.color === 'primary'
                          ? 'border-primary-400 bg-primary-50/50 ring-1 ring-primary-400/30'
                          : 'border-accent-400 bg-accent-50/50 ring-1 ring-accent-400/30'
                        : 'border-background-200 hover:border-background-300 hover:bg-background-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0 ${
                        isSelected
                          ? loc.color === 'primary' ? 'bg-primary-500 text-background-50' : 'bg-accent-500 text-background-50'
                          : 'bg-background-200/70 text-foreground-500'
                      }`}>
                        <i className={`${loc.icon} text-lg`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${isSelected ? 'text-foreground-900' : 'text-foreground-800'}`}>
                          {t(titleKey)}
                        </p>
                        <p className="text-xs text-foreground-500 truncate">{t(addressKey)}</p>
                      </div>
                      {isSelected && (
                        <div className={`w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0 ${
                          loc.color === 'primary' ? 'bg-primary-500' : 'bg-accent-500'
                        }`}>
                          <i className="ri-check-line text-background-50 text-xs" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            {touched.location && errors.location && (
              <p className="text-xs text-red-500 mt-1.5">{errors.location}</p>
            )}
          </div>

          {/* Date */}
          <div className="mb-5">
            <label htmlFor="booking-date" className="block text-sm font-medium text-foreground-800 mb-1.5">
              {t('bookingDate') || 'Дата'} *
            </label>
            <input
              id="booking-date"
              type="date"
              name="appointment_date"
              value={formData.appointment_date}
              onChange={(e) => handleChange('appointment_date', e.target.value)}
              onBlur={() => validate('appointment_date')}
              className={getInputClasses('appointment_date')}
              min={minDate}
            />
            {touched.appointment_date && errors.appointment_date && (
              <p className="text-xs text-red-500 mt-1">{errors.appointment_date}</p>
            )}
          </div>

          {/* Time Slots */}
          <div>
            <label className="block text-sm font-medium text-foreground-800 mb-2 flex items-center gap-2">
              {t('bookingTime') || 'Час'} *
              {loadingSlots && (
                <span className="inline-flex items-center gap-1 text-xs text-foreground-400">
                  <i className="ri-loader-4-line animate-spin" />
                  Зареждане...
                </span>
              )}
              {takenSlots.length > 0 && !loadingSlots && (
                <span className="text-xs text-accent-600 bg-accent-50 px-2 py-0.5 rounded-full">
                  {takenSlots.length} заети
                </span>
              )}
            </label>

            {!formData.appointment_date || !formData.location ? (
              <p className="text-sm text-foreground-400 bg-background-50 rounded-lg p-4 border border-dashed border-background-300">
                <i className="ri-information-line mr-1" />
                Първо изберете локация и дата, за да видите наличните часове
              </p>
            ) : dayBlocked ? (
              <p className="text-sm text-red-500 bg-red-50 rounded-lg p-4 border border-dashed border-red-200">
                <i className="ri-close-circle-line mr-1" />
                Този ден е почивен. Моля, изберете друга дата.
              </p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {timeSlots.map((slot) => {
                  const isTaken = takenSlots.includes(slot);
                  const isSelected = formData.appointment_time === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isTaken}
                      onClick={() => handleChange('appointment_time', slot)}
                      className={`relative py-2.5 px-2 rounded-lg text-sm font-medium transition-all duration-200 border cursor-pointer whitespace-nowrap ${
                        isTaken
                          ? 'bg-background-200/50 border-background-200 text-foreground-400 cursor-not-allowed line-through'
                          : isSelected
                            ? 'bg-primary-500 border-primary-500 text-background-50 shadow-md shadow-primary-500/20'
                            : 'bg-background-50 border-background-200 hover:border-primary-300 hover:bg-primary-50/30 text-foreground-700'
                      }`}
                    >
                      {slot}
                      {isTaken && (
                        <span className="sr-only">зает</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {formData.appointment_date && formData.location && takenSlots.length === 0 && !loadingSlots && !dayBlocked && (
              <p className="text-xs text-green-600 mt-2">
                <i className="ri-check-line mr-1" />
                Всички часове са свободни за този ден
              </p>
            )}
            {touched.appointment_time && errors.appointment_time && (
              <p className="text-xs text-red-500 mt-2">{errors.appointment_time}</p>
            )}
          </div>
        </div>

        {/* Step 4: Message */}
        <div className="bg-background-100 rounded-2xl p-5 md:p-6 border border-background-200/70">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 flex items-center justify-center bg-primary-500 rounded-full">
              <span className="text-background-50 text-sm font-semibold">4</span>
            </div>
            <h3 className="font-heading text-base font-semibold text-foreground-950">Допълнителна информация</h3>
          </div>

          <label htmlFor="booking-message" className="block text-sm font-medium text-foreground-800 mb-1.5">
            {t('contactMessage')}
          </label>
          <textarea
            id="booking-message"
            name="message"
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            rows={4}
            maxLength={500}
            className="w-full px-4 py-3 rounded-lg border text-base md:text-sm bg-background-50 border-background-200 hover:border-background-300 focus:outline-none focus:ring-2 focus:ring-primary-400/50 transition-colors duration-300 resize-none"
            placeholder="Допълнителна информация (алергии, предпочитания, въпроси)..."
          />
          <div className="flex justify-between mt-1">
            {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
            <p className={`text-xs ml-auto ${formData.message.length > 450 ? 'text-accent-600' : 'text-foreground-400'}`}>
              {formData.message.length}/500
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button
            type="submit"
            disabled={submitting || dayBlocked}
            className="w-full sm:w-auto px-10 py-3.5 bg-primary-500 text-background-50 font-medium text-sm rounded-full hover:bg-primary-600 active:scale-[0.98] transition-all duration-300 whitespace-nowrap cursor-pointer disabled:opacity-60 btn-premium"
          >
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <i className="ri-loader-4-line animate-spin" />
                {t('bookingSubmit') || 'Запазване...'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <i className="ri-calendar-check-line" />
                {t('bookingSubmit') || 'Запази час'}
              </span>
            )}
          </button>
          <p className="text-xs text-foreground-500">
            <i className="ri-lock-line mr-1" />
            Вашите данни са защитени и се използват само за резервация
          </p>
        </div>
      </form>
    </div>
  );
}