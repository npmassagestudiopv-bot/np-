import { useTranslation } from 'react-i18next';
import { useState, useMemo } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import FaqAccordion from '@/components/feature/FaqAccordion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useLocalizedNav } from '@/hooks/useLocalizedNav';
import { invokeContact } from '@/lib/supabase';
import { useSeo, baseUrl } from '@/hooks/useSeo';
import {
  buildBreadcrumbSchema,
  buildLocalBusinessSchema,
  buildContactPointSchema,
  buildFaqSchema,
  buildWebPageSchema,
} from '@/lib/seoSchemas';

const FAQ_CONTACT = [
  { q: 'Как да се свържа с NP Massage Studio?', a: 'Можете да се обадите на +359 988 926 120, да пишете на npmassagestudiopv@gmail.com или да попълните формата за контакт на тази страница.' },
  { q: 'Какви са работните часове на NP Massage Studio?', a: 'Работим всеки ден: Понеделник–Петък 09:00–19:00, Събота 09:00–17:00, Неделя 10:00–16:00.' },
  { q: 'Трябва ли предварително записване за масаж?', a: 'Да, препоръчваме предварително записване за по-добра организация и персонализирано обслужване. Можете да запазите час по телефон или онлайн.' },
  { q: 'Къде се намират локациите на NP Massage Studio?', a: 'Имаме два салона: Велико Търново на бул. България 72 и Павликени на ул. Атанас Дончев 10.' },
  { q: 'Какви масажни услуги предлагате?', a: 'Предлагаме класически и релаксиращ масаж, спортен и терапевтичен масаж, антицелулитен масаж, ароматерапия и частичен масаж на гръб.' },
  { q: 'Колко струва един масаж?', a: 'Цените варират от 15 € за частичен масаж на гръб до 30 € за ароматерапия. Класическият и спортният масаж са по 25 € за 60 минути.' },
];

export default function ContactPage() {
  const { t } = useTranslation();
  const { handleNav, isEn } = useLocalizedNav();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    location: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const { ref: formRef, isVisible: formVisible } = useScrollReveal({ threshold: 0.1 });
  const { ref: infoRef, isVisible: infoVisible } = useScrollReveal({ threshold: 0.1 });

  useSeo(useMemo(() => ({
    title: 'Контакти и резервации | NP Масажно студио — Велико Търново и Павликени',
    description: 'Свържете се с NP Масажно студио за професионален масаж във Велико Търново и Павликени. Телефон: +359 988 926 120. Email: npmassagestudiopv@gmail.com. Локации: бул. България 72 (Велико Търново) и ул. Атанас Дончев 10 (Павликени). Онлайн резервация 24/7.',
    keywords: 'контакти масажно студио, резервация масаж Велико Търново, запази час масаж Търново, телефон масажист Павликени, NP Масажно студио контакти',
    canonical: isEn ? '/en/contact' : '/kontakti',
    lastModified: '2026-06-08',
    hreflangs: [
      { lang: 'bg', url: '/kontakti' },
      { lang: 'en', url: '/en/contact' },
      { lang: 'x-default', url: '/kontakti' },
    ],
    og: {
      title: 'Контакти | NP Масажно студио',
      description: 'Свържете се с нас: +359 988 926 120. Две локации — Велико Търново и Павликени. Онлайн резервация 24/7.',
      type: 'website',
      locale: 'bg_BG',
      localeAlternate: ['en_US'],
    },
    schemas: [
      buildWebPageSchema('Контакти | NP Massage Studio', 'Контактна страница на NP Massage Studio.', '/kontakti', 'ContactPage'),
      buildBreadcrumbSchema([{ name: 'Начало', url: '/' }, { name: 'Контакти', url: '/kontakti' }]),
      buildLocalBusinessSchema(),
      buildContactPointSchema(),
      buildFaqSchema(FAQ_CONTACT),
    ],
  }), [isEn]));

  const validate = (field?: string) => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = t('contactRequired');
    if (!formData.phone.trim()) newErrors.phone = t('contactRequired');
    if (!formData.email.trim()) newErrors.email = t('contactRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t('contactInvalidEmail');
    if (!formData.service) newErrors.service = t('contactRequired');
    if (!formData.location) newErrors.location = t('contactRequired');
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
      await invokeContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        location: formData.location,
        message: formData.message,
      });
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', service: '', location: '', message: '' });
      setTouched({});
      setErrors({});
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
  };


  const breadcrumbItems = [
    { label: t('breadcrumbHome'), path: '/' },
    { label: t('breadcrumbContact') },
  ];

  const inputClasses = (field: string) => {
    const hasError = touched[field] && errors[field];
    return `w-full px-4 py-2.5 rounded-lg border text-sm bg-background-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-400/50 ${
      hasError ? 'border-red-300 bg-red-50/30' : 'border-background-200 hover:border-background-300'
    }`;
  };

  return (
    <div className="min-h-screen bg-background-50">
      <Navbar />
      <main className="pt-20 md:pt-24">
        <section className="w-full px-4 md:px-6 lg:px-10 py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground-950 mb-4">
              {t('contactTitle')}
            </h1>
            <p className="text-base text-foreground-600 mb-10 max-w-2xl leading-relaxed">
              {t('contactSubtitle')}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-10">
              <div
                ref={formRef}
                className={`lg:col-span-3 transition-all duration-700 ${formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              >
                {status === 'success' && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-start gap-3 animate-fade-in">
                    <i className="ri-checkbox-circle-line text-green-600 mt-0.5" />
                    <p className="text-sm text-green-800">{t('contactSuccess')}</p>
                  </div>
                )}
                {status === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3 animate-fade-in">
                    <i className="ri-error-warning-line text-red-600 mt-0.5" />
                    <p className="text-sm text-red-800">{t('contactError')}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="bg-background-100 rounded-2xl p-5 md:p-6 border border-background-200/70">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-medium text-foreground-800 mb-1.5">{t('contactName')} *</label>
                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        onBlur={() => validate('name')}
                        className={inputClasses('name')}
                        placeholder="Вашето име"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        autoComplete="name"
                      />
                      {touched.name && errors.name && <p id="name-error" className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="contact-phone" className="block text-sm font-medium text-foreground-800 mb-1.5">{t('contactPhone')} *</label>
                      <input
                        id="contact-phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        onBlur={() => validate('phone')}
                        className={inputClasses('phone')}
                        placeholder="+359 888 123 456"
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                        autoComplete="tel"
                      />
                      {touched.phone && errors.phone && <p id="phone-error" className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="contact-email" className="block text-sm font-medium text-foreground-800 mb-1.5">{t('contactEmail')} *</label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      onBlur={() => validate('email')}
                      className={inputClasses('email')}
                      placeholder="email@abv.bg"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      autoComplete="email"
                    />
                    {touched.email && errors.email && <p id="email-error" className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="contact-service" className="block text-sm font-medium text-foreground-800 mb-1.5">{t('contactService')} *</label>
                      <select
                        id="contact-service"
                        name="service"
                        value={formData.service}
                        onChange={(e) => handleChange('service', e.target.value)}
                        onBlur={() => validate('service')}
                        className={inputClasses('service')}
                        aria-invalid={!!errors.service}
                        aria-describedby={errors.service ? 'service-error' : undefined}
                      >
                        <option value="">{t('contactSelectService')}</option>
                        <option value="classical">{t('serviceClassical')}</option>
                        <option value="sport">{t('serviceSport')}</option>
                        <option value="anticellulite">{t('serviceAnticellulite')}</option>
                        <option value="aromatherapy">{t('serviceAromatherapy')}</option>
                        <option value="back">{t('serviceBack')}</option>
                      </select>
                      {touched.service && errors.service && <p id="service-error" className="text-xs text-red-500 mt-1">{errors.service}</p>}
                    </div>
                    <div>
                      <label htmlFor="contact-location" className="block text-sm font-medium text-foreground-800 mb-1.5">{t('contactLocation')} *</label>
                      <select
                        id="contact-location"
                        name="location"
                        value={formData.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                        onBlur={() => validate('location')}
                        className={inputClasses('location')}
                        aria-invalid={!!errors.location}
                        aria-describedby={errors.location ? 'location-error' : undefined}
                      >
                        <option value="">{t('contactSelectLocation')}</option>
                        <option value="vt">{t('locationVtTitle')}</option>
                        <option value="pv">{t('locationPvTitle')}</option>
                      </select>
                      {touched.location && errors.location && <p id="location-error" className="text-xs text-red-500 mt-1">{errors.location}</p>}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="contact-message" className="block text-sm font-medium text-foreground-800 mb-1.5">{t('contactMessage')}</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      rows={4}
                      maxLength={500}
                      className="w-full px-4 py-2.5 rounded-lg border text-sm bg-background-50 border-background-200 hover:border-background-300 focus:outline-none focus:ring-2 focus:ring-primary-400/50 transition-colors duration-300 resize-none"
                      placeholder="Допълнителна информация..."
                    />
                    <div className="flex justify-between mt-1">
                      {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
                      <p className={`text-xs ml-auto ${formData.message.length > 450 ? 'text-accent-600' : 'text-foreground-400'}`}>
                        {formData.message.length}/500
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-8 py-3.5 bg-primary-500 text-background-50 font-medium text-sm rounded-full hover:bg-primary-600 active:scale-[0.98] transition-all duration-300 whitespace-nowrap cursor-pointer disabled:opacity-60 btn-premium"
                  >
                    {submitting ? (
                      <span className="inline-flex items-center gap-2">
                        <i className="ri-loader-4-line animate-spin" />
                        {t('contactSubmit')}
                      </span>
                    ) : (
                      t('contactSubmit')
                    )}
                  </button>
                </form>
              </div>

              <div
                ref={infoRef}
                className={`lg:col-span-2 transition-all duration-700 ${infoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: '150ms' }}
              >
                <div className="bg-background-100 rounded-2xl p-5 md:p-6 border border-background-200/70 mb-4">
                  <h3 className="font-heading text-lg font-semibold text-foreground-950 mb-4">{t('contactInfoTitle')}</h3>
                  <p className="text-sm text-foreground-600 mb-4 leading-relaxed">{t('contactInfoText')}</p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 flex items-center justify-center bg-primary-100 rounded-full">
                        <i className="ri-phone-line text-primary-600" />
                      </div>
                      <a href="tel:+359988926120" className="text-primary-600 hover:text-primary-700 transition-colors duration-300 cursor-pointer">+359 988 926 120</a>
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 flex items-center justify-center bg-primary-100 rounded-full">
                        <i className="ri-mail-line text-primary-600" />
                      </div>
                      <a href="mailto:npmassagestudiopv@gmail.com" className="text-primary-600 hover:text-primary-700 transition-colors duration-300 cursor-pointer">npmassagestudiopv@gmail.com</a>
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 flex items-center justify-center bg-primary-100 rounded-full">
                        <i className="ri-map-pin-line text-primary-600" />
                      </div>
                      <span className="text-foreground-600">{t('locationVtAddress')}</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 flex items-center justify-center bg-primary-100 rounded-full">
                        <i className="ri-map-pin-line text-primary-600" />
                      </div>
                      <span className="text-foreground-600">{t('locationPvAddress')}</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-background-100 rounded-2xl p-5 md:p-6 border border-background-200/70 mb-4">
                  <h3 className="font-heading text-lg font-semibold text-foreground-950 mb-3">{t('contactWorkingHours')}</h3>
                  <p className="text-sm text-foreground-600 leading-relaxed">{t('contactWorkingHoursText')}</p>
                </div>
                <div className="bg-background-100 rounded-2xl p-5 md:p-6 border border-background-200/70">
                  <h3 className="font-heading text-lg font-semibold text-foreground-950 mb-3">{t('contactSocialTitle')}</h3>
                  <p className="text-sm text-foreground-600 mb-4 leading-relaxed">{t('contactSocialText')}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <a href="https://www.facebook.com/profile.php?id=61569758628011" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 bg-background-50 rounded-full border border-background-200/70 text-sm text-foreground-700 hover:text-primary-600 hover:border-primary-300 transition-all duration-300 cursor-pointer">
                      <i className="ri-facebook-fill text-lg" />
                      <span className="hidden sm:inline">{t('contactSocialFb')}</span>
                    </a>
                    <a href="https://www.instagram.com/np_massage_studio/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 bg-background-50 rounded-full border border-background-200/70 text-sm text-foreground-700 hover:text-primary-600 hover:border-primary-300 transition-all duration-300 cursor-pointer">
                      <i className="ri-instagram-fill text-lg" />
                      <span className="hidden sm:inline">{t('contactSocialIg')}</span>
                    </a>
                    <a href="https://www.tiktok.com/@npmassagestudio" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 bg-background-50 rounded-full border border-background-200/70 text-sm text-foreground-700 hover:text-primary-600 hover:border-primary-300 transition-all duration-300 cursor-pointer">
                      <i className="ri-tiktok-fill text-lg" />
                      <span className="hidden sm:inline">{t('contactSocialTt')}</span>
                    </a>
                  </div>
                </div>

                <div className="bg-background-100 rounded-2xl p-5 md:p-6 border border-background-200/70">
                  <h3 className="font-heading text-lg font-semibold text-foreground-950 mb-3">{t('contactGoogleTitle')}</h3>
                  <p className="text-sm text-foreground-600 mb-4 leading-relaxed">{t('contactGoogleText')}</p>
                  <a
                    href="https://www.google.com/maps/place/NP+Massage+Studio+%7C+%D0%9C%D0%B0%D1%81%D0%B0%D0%B6%D0%BD%D0%BE+%D1%81%D1%82%D1%83%D0%B4%D0%B8%D0%BE+%D0%92%D0%B5%D0%BB%D0%B8%D0%BA%D0%BE+%D0%A2%D1%8A%D1%80%D0%BD%D0%BE%D0%B2%D0%BE/@43.080935,25.6127656,17z"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 w-full px-4 py-3 bg-background-50 rounded-xl border border-background-200/70 hover:border-primary-300 hover:bg-primary-50/30 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <i className="ri-google-fill text-primary-600 text-lg" />
                    </div>
                    <div className="text-left min-w-0">
                      <div className="flex items-center gap-1">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <div key={star} className="w-3 h-3 flex items-center justify-center">
                              <i className="ri-star-fill text-yellow-400 text-[11px]" />
                            </div>
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-foreground-800">5.0</span>
                      </div>
                      <span className="text-xs text-foreground-500">32 {t('contactGoogleReviews')}</span>
                    </div>
                    <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 ml-auto">
                      <i className="ri-arrow-right-up-line text-foreground-400 text-sm group-hover:text-primary-600 transition-colors" />
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full px-4 md:px-6 lg:px-10 pb-16 md:pb-24">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground-950 mb-3">
                {t('faqTitle')}
              </h2>
              <p className="text-sm text-foreground-600">Отговори на най-популярните въпроси за контакт с NP Massage Studio</p>
            </div>
            <FaqAccordion items={FAQ_CONTACT.map((item) => ({ q: item.q, a: item.a }))} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}