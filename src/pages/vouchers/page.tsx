import { useState, useRef, useMemo } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useLocalizedNav } from '@/hooks/useLocalizedNav';
import { useSeo, baseUrl } from '@/hooks/useSeo';
import {
  buildBreadcrumbSchema,
  buildLocalBusinessSchema,
  buildWebPageSchema,
  buildFaqSchema,
  buildProductSchema,
} from '@/lib/seoSchemas';

const VOUCHER_OPTIONS = [
  {
    id: 'relaxing',
    name: 'Релаксиращ масаж',
    nameEn: 'Relaxing Massage',
    price: '25 €',
    duration: '60 мин',
    durationEn: '60 min',
    icon: 'ri-leaf-line',
    color: 'primary',
    popular: false,
  },
  {
    id: 'sport',
    name: 'Спортен масаж',
    nameEn: 'Sports Massage',
    price: '25 €',
    duration: '60 мин',
    durationEn: '60 min',
    icon: 'ri-run-line',
    color: 'accent',
    popular: false,
  },
  {
    id: 'anticellulite',
    name: 'Антицелулитен масаж',
    nameEn: 'Anticellulite Massage',
    price: '20 €',
    duration: '40 мин',
    durationEn: '40 min',
    icon: 'ri-heart-pulse-line',
    color: 'secondary',
    popular: false,
  },
  {
    id: 'aroma',
    name: 'Ароматерапия',
    nameEn: 'Aromatherapy',
    price: '30 €',
    duration: '60 мин',
    durationEn: '60 min',
    icon: 'ri-flower-line',
    color: 'primary',
    popular: true,
  },
  {
    id: 'back',
    name: 'Масаж на гръб',
    nameEn: 'Back Massage',
    price: '15 €',
    duration: '40 мин',
    durationEn: '40 min',
    icon: 'ri-body-scan-line',
    color: 'accent',
    popular: false,
  },
  {
    id: 'pack',
    name: 'Антицелулитен пакет',
    nameEn: 'Anticellulite Package',
    price: '175 €',
    duration: '10 процедури',
    durationEn: '10 sessions',
    icon: 'ri-gift-2-line',
    color: 'secondary',
    popular: false,
  },
];

const VOUCHER_FAQ = [
  { q: 'Как работят подаръчните ваучери?', a: 'Попълвате формата с избраната услуга и данните на получателя. Свързваме се с вас за потвърждение и изпращане на ваучера.' },
  { q: 'Колко важи ваучерът?', a: 'Подаръчните ваучери важат 6 месеца от датата на издаване. В рамките на тези 6 месеца ваучерът може да бъде използван за всяко запазване на час.' },
  { q: 'Може ли ваучерът да се използва в двете локации?', a: 'Да, ваучерите важат за двете ни локации — Велико Търново (бул. България 72) и Павликени (ул. Атанас Дончев 10).' },
  { q: 'Как получавам ваучера?', a: 'Изпращаме ваучера по имейл в PDF формат, подходящ за разпечатване или изпращане по съобщение. При желание може да го вземете и на хартия директно от салона.' },
  { q: 'Мога ли да поръчам ваучер по телефон?', a: 'Да, можете да се обадите на +359 988 926 120 и ще ви помогнем да оформите ваучера директно по телефон.' },
];

const PRODUCT_SCHEMAS = [
  buildProductSchema('Подаръчен ваучер Релаксиращ масаж', 'Подаръчен ваучер за релаксиращ масаж в NP Massage Studio Велико Търново.', '25', 'EUR', undefined, 'vaucher-relaksirast'),
  buildProductSchema('Подаръчен ваучер Ароматерапия', 'Подаръчен ваучер за ароматерапия в NP Massage Studio Велико Търново.', '30', 'EUR', undefined, 'vaucher-aromaterapiya'),
  buildProductSchema('Подаръчен ваучер Антицелулитен пакет', 'Подаръчен ваучер за антицелулитен пакет 10 процедури в NP Massage Studio.', '175', 'EUR', undefined, 'vaucher-anticeluliten-paket'),
];

export default function VouchersPage() {
  const { handleNav, isEn } = useLocalizedNav();
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  useSeo(useMemo(() => ({
    title: 'Подаръчни ваучери за масаж | NP Масажно студио — Велико Търново и Павликени',
    description: 'Подарете незабравимо преживяване! Подаръчни ваучери за класически, спортен, антицелулитен масаж, ароматерапия и масаж на гръб в NP Масажно студио. Две локации: Велико Търново и Павликени. Тел: +359 988 926 120.',
    keywords: 'подаръчен ваучер масаж, ваучер за масаж Велико Търново, подарък масаж Търново, ваучер ароматерапия, ваучер спортен масаж, NP Масажно студио ваучери',
    canonical: isEn ? '/en/vouchers' : '/vaucheri',
    lastModified: '2026-08-06',
    hreflangs: [
      { lang: 'bg', url: '/vaucheri' },
      { lang: 'en', url: '/en/vouchers' },
      { lang: 'x-default', url: '/vaucheri' },
    ],
    og: {
      title: 'Подаръчни ваучери за масаж | NP Massage Studio',
      description: 'Подарете незабравимо преживяване с ваучер за масаж от NP Massage Studio.',
    },
    schemas: [
      buildWebPageSchema(
        'Подаръчни ваучери за масаж | NP Massage Studio',
        'Подаръчни ваучери за масаж в NP Massage Studio — Велико Търново и Павликени.',
        '/vaucheri',
        'WebPage'
      ),
      buildBreadcrumbSchema([
        { name: 'Начало', url: '/' },
        { name: 'Подаръчни ваучери', url: '/vaucheri' },
      ]),
      buildLocalBusinessSchema(),
      buildFaqSchema(VOUCHER_FAQ),
      ...PRODUCT_SCHEMAS,
    ],
  }), [isEn]));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedVoucher) return;

    setFormStatus('sending');

    const form = e.currentTarget;
    const data = new URLSearchParams();
    new FormData(form).forEach((value, key) => {
      data.append(key, value.toString());
    });
    const voucher = VOUCHER_OPTIONS.find((v) => v.id === selectedVoucher);
    if (voucher) {
      data.append('voucher_name', voucher.name);
      data.append('voucher_price', voucher.price);
    }

    try {
      const res = await fetch('https://readdy.ai/api/form/d8g1np0bnl4r5i43cmqg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data.toString(),
      });
      if (res.ok) {
        setFormStatus('success');
        form.reset();
        setSelectedVoucher(null);
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-background-50">
      <Navbar />
      <main className="pt-20 md:pt-24">
        <HeroSection isEn={isEn} />

        <section className="w-full px-4 md:px-6 lg:px-10 py-14 md:py-20">
          <div className="max-w-5xl mx-auto">
            <HowItWorks isEn={isEn} />

            <VoucherSelector
              selected={selectedVoucher}
              onSelect={setSelectedVoucher}
              isEn={isEn}
            />

            <OrderForm
              ref={formRef}
              selectedVoucher={selectedVoucher}
              onSubmit={handleSubmit}
              formStatus={formStatus}
              onStatusReset={() => setFormStatus('idle')}
              isEn={isEn}
            />

            <FaqSection isEn={isEn} />

            <div className="mt-16 text-center">
              <p className="text-sm text-foreground-500 mb-3">
                {isEn ? 'Questions? Call us:' : 'Въпроси? Обадете ни се:'}
              </p>
              <a
                href="tel:+359988926120"
                className="inline-flex items-center gap-2 text-lg font-semibold text-primary-600 hover:text-primary-700 transition-colors cursor-pointer"
              >
                <i className="ri-phone-line" />
                +359 988 926 120
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function HeroSection({ isEn }: { isEn: boolean }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section className="relative w-full h-[340px] md:h-[420px] overflow-hidden">
      <img
        src="https://readdy.ai/api/search-image?query=Elegant%20gift%20voucher%20presentation%20with%20ribbon%2C%20luxury%20spa%20atmosphere%2C%20warm%20golden%20light%2C%20candles%2C%20soft%20towels%2C%20massage%20oils%20on%20marble%20surface%2C%20serene%20and%20relaxing%20spa%20environment%2C%20premium%20gift%20concept%2C%20muted%20warm%20tones%2C%20editorial%20photography&width=1600&height=840&seq=voucher-hero-2026&orientation=landscape"
        alt="Подаръчни ваучери за масаж NP Massage Studio Велико Търново"
        className="w-full h-full object-cover object-top"
        loading="eager"
        decoding="async"
        width="1600"
        height="840"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/50" />
      <div
        ref={ref}
        className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-background-50/15 backdrop-blur-sm border border-background-50/25 rounded-full text-xs font-medium text-background-50/90 mb-5 tracking-wide uppercase">
          <i className="ri-gift-line text-accent-300" />
          {isEn ? 'Gift Vouchers' : 'Подаръчни ваучери'}
        </span>
        <h1 className="font-heading text-3xl md:text-5xl font-semibold text-background-50 mb-4 leading-tight max-w-2xl">
          {isEn ? 'Give the Gift of Relaxation' : 'Подарете истинска релаксация'}
        </h1>
        <p className="text-base md:text-lg text-background-50/85 max-w-xl leading-relaxed">
          {isEn
            ? 'A gift voucher for a massage in Veliko Tarnovo is the perfect present for any occasion.'
            : 'Ваучер за масаж в Велико Търново — идеалният подарък за всеки повод.'}
        </p>
      </div>
    </section>
  );
}

function HowItWorks({ isEn }: { isEn: boolean }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const steps = [
    {
      icon: 'ri-gift-2-line',
      title: isEn ? 'Choose a service' : 'Изберете услуга',
      desc: isEn ? 'Pick the massage or package you want to gift.' : 'Изберете масажа или пакета, който искате да подарите.',
    },
    {
      icon: 'ri-file-text-line',
      title: isEn ? 'Fill the form' : 'Попълнете формата',
      desc: isEn ? 'Enter your details and a personal message for the recipient.' : 'Въведете данните си и лично послание към получателя.',
    },
    {
      icon: 'ri-mail-send-line',
      title: isEn ? 'Receive the voucher' : 'Получете ваучера',
      desc: isEn ? 'We send the voucher by email within a few hours.' : 'Изпращаме ваучера по имейл в рамките на часове.',
    },
    {
      icon: 'ri-calendar-check-line',
      title: isEn ? 'Book an appointment' : 'Запазете час',
      desc: isEn ? 'The recipient books their appointment at a convenient time.' : 'Получателят запазва час в удобно за него време.',
    },
  ];

  return (
    <div
      ref={ref}
      className={`mb-14 md:mb-18 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      <div className="text-center mb-8 md:mb-10 mt-10">
        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground-950 mb-3">
          {isEn ? 'How it works' : 'Как работи'}
        </h2>
        <p className="text-sm text-foreground-500 max-w-xl mx-auto">
          {isEn
            ? 'Ordering a gift voucher for a massage in Veliko Tarnovo takes just a few minutes.'
            : 'Поръчването на подаръчен ваучер за масаж в Търново отнема само няколко минути.'}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {steps.map((step, i) => (
          <div
            key={i}
            className="bg-background-100 rounded-2xl p-5 border border-background-200/70 flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-3">
              <i className={`${step.icon} text-primary-600 text-xl`} />
            </div>
            <span className="text-xs font-semibold text-primary-500 uppercase tracking-wider mb-1">
              {i + 1}
            </span>
            <h3 className="font-heading text-sm font-semibold text-foreground-950 mb-2">{step.title}</h3>
            <p className="text-xs text-foreground-500 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function VoucherSelector({
  selected,
  onSelect,
  isEn,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
  isEn: boolean;
}) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`mb-12 md:mb-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground-950 mb-3">
        {isEn ? 'Choose a voucher' : 'Изберете ваучер'}
      </h2>
      <p className="text-sm text-foreground-500 mb-7">
        {isEn ? 'Select the service you want to gift.' : 'Изберете услугата, която искате да подарите.'}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {VOUCHER_OPTIONS.map((v) => {
          const isSelected = selected === v.id;
          return (
            <button
              key={v.id}
              onClick={() => onSelect(v.id)}
              className={`relative flex flex-col items-start p-5 rounded-2xl border-2 text-left cursor-pointer transition-all duration-300 whitespace-nowrap ${
                isSelected
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-background-200/70 bg-background-100 hover:border-primary-300 hover:bg-primary-50/40'
              }`}
            >
              {v.popular && (
                <span className="absolute top-3 right-3 px-2.5 py-0.5 bg-accent-500 text-background-50 text-xs font-semibold rounded-full">
                  {isEn ? 'Popular' : 'Популярен'}
                </span>
              )}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
                  isSelected ? 'bg-primary-500 text-background-50' : 'bg-primary-100 text-primary-600'
                }`}
              >
                <i className={`${v.icon} text-lg`} />
              </div>
              <h3 className="font-heading text-sm font-semibold text-foreground-950 mb-1 whitespace-normal">
                {isEn ? v.nameEn : v.name}
              </h3>
              <p className="text-xs text-foreground-500 mb-3">
                {isEn ? v.durationEn : v.duration}
              </p>
              <div className="flex items-center justify-between w-full">
                <span className="text-base font-bold text-primary-600">{v.price}</span>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                    <i className="ri-check-line text-background-50 text-xs" />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface OrderFormProps {
  selectedVoucher: string | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  formStatus: 'idle' | 'sending' | 'success' | 'error';
  onStatusReset: () => void;
  isEn: boolean;
}

const OrderForm = ({
  selectedVoucher,
  onSubmit,
  formStatus,
  onStatusReset,
  isEn,
}: OrderFormProps) => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const voucher = VOUCHER_OPTIONS.find((v) => v.id === selectedVoucher);

  return (
    <div
      ref={ref}
      className={`mb-14 md:mb-18 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground-950 mb-3">
        {isEn ? 'Order the voucher' : 'Поръчайте ваучера'}
      </h2>
      <p className="text-sm text-foreground-500 mb-7">
        {isEn
          ? 'Fill in your details and we will contact you for confirmation.'
          : 'Попълнете данните си и ще се свържем с вас за потвърждение.'}
      </p>

      {voucher && (
        <div className="flex items-center gap-3 mb-6 p-4 bg-primary-50 border border-primary-200/60 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            <i className={`${voucher.icon} text-primary-600 text-lg`} />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground-950">{isEn ? voucher.nameEn : voucher.name}</p>
            <p className="text-xs text-foreground-500">{isEn ? voucher.durationEn : voucher.duration} · {voucher.price}</p>
          </div>
          <span className="ml-auto text-lg font-bold text-primary-600">{voucher.price}</span>
        </div>
      )}

      {formStatus === 'success' ? (
        <div className="bg-primary-50 border border-primary-200/60 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
            <i className="ri-check-line text-primary-600 text-2xl" />
          </div>
          <h3 className="font-heading text-xl font-semibold text-foreground-950 mb-2">
            {isEn ? 'Request received!' : 'Заявката е получена!'}
          </h3>
          <p className="text-sm text-foreground-600 mb-5 max-w-md mx-auto">
            {isEn
              ? 'We will contact you within a few hours to confirm and send the voucher.'
              : 'Ще се свържем с вас в рамките на часове за потвърждение и изпращане на ваучера.'}
          </p>
          <button
            onClick={onStatusReset}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-background-50 text-sm font-medium rounded-full hover:bg-primary-600 transition-all cursor-pointer whitespace-nowrap"
          >
            {isEn ? 'Order another voucher' : 'Поръчайте още ваучер'}
          </button>
        </div>
      ) : (
        <form
          data-readdy-form
          id="voucher-request-form"
          onSubmit={onSubmit}
          className="bg-background-100 rounded-2xl p-6 md:p-8 border border-background-200/70 space-y-5"
        >
          {!selectedVoucher && (
            <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200/60 rounded-xl px-4 py-3 flex items-center gap-2">
              <i className="ri-information-line" />
              {isEn ? 'Please select a voucher above first.' : 'Моля, изберете ваучер по-горе.'}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground-700 mb-1.5">
                {isEn ? 'Your name' : 'Вашето име'} <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="sender_name"
                required
                placeholder={isEn ? 'Ivan Petrov' : 'Иван Петров'}
                className="w-full px-4 py-3 text-sm bg-background-50 border border-background-200 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-300/40 transition-all placeholder:text-foreground-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground-700 mb-1.5">
                {isEn ? 'Your phone' : 'Вашият телефон'} <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                name="sender_phone"
                required
                placeholder="+359 8XX XXX XXX"
                className="w-full px-4 py-3 text-sm bg-background-50 border border-background-200 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-300/40 transition-all placeholder:text-foreground-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground-700 mb-1.5">
              {isEn ? 'Your email' : 'Вашият имейл'} <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder={isEn ? 'your@email.com' : 'вашият@имейл.com'}
              className="w-full px-4 py-3 text-sm bg-background-50 border border-background-200 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-300/40 transition-all placeholder:text-foreground-300"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground-700 mb-1.5">
              {isEn ? "Recipient's name" : 'Името на получателя'}
            </label>
            <input
              type="text"
              name="recipient_name"
              placeholder={isEn ? 'Maria Ivanova' : 'Мария Иванова'}
              className="w-full px-4 py-3 text-sm bg-background-50 border border-background-200 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-300/40 transition-all placeholder:text-foreground-300"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground-700 mb-1.5">
              {isEn ? 'Location' : 'Локация'}
            </label>
            <select
              name="location"
              className="w-full px-4 py-3 text-sm bg-background-50 border border-background-200 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-300/40 transition-all cursor-pointer"
            >
              <option value="any">{isEn ? 'Any location' : 'Всяка локация'}</option>
              <option value="vt">{isEn ? 'Veliko Tarnovo' : 'Велико Търново'}</option>
              <option value="pavlikeni">{isEn ? 'Pavlikeni' : 'Павликени'}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground-700 mb-1.5">
              {isEn ? 'Personal message (optional)' : 'Лично послание (незадължително)'}
            </label>
            <textarea
              name="personal_message"
              rows={3}
              maxLength={500}
              placeholder={isEn ? 'E.g. Happy birthday! This is a gift for you...' : 'Напр. Честит рожден ден! Това е подарък за теб...'}
              className="w-full px-4 py-3 text-sm bg-background-50 border border-background-200 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-300/40 transition-all resize-none placeholder:text-foreground-300"
            />
            <p className="text-xs text-foreground-400 mt-1">
              {isEn ? 'Max 500 characters' : 'Макс. 500 символа'}
            </p>
          </div>

          {formStatus === 'error' && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200/60 rounded-xl px-4 py-3 flex items-center gap-2">
              <i className="ri-error-warning-line" />
              {isEn ? 'An error occurred. Please try again or call us.' : 'Възникна грешка. Опитайте отново или се обадете ни.'}
            </p>
          )}

          <button
            type="submit"
            disabled={!selectedVoucher || formStatus === 'sending'}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary-500 text-background-50 text-sm font-semibold rounded-xl hover:bg-primary-600 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap min-h-[52px]"
          >
            {formStatus === 'sending' ? (
              <>
                <i className="ri-loader-4-line animate-spin" />
                {isEn ? 'Sending...' : 'Изпращане...'}
              </>
            ) : (
              <>
                <i className="ri-gift-2-line" />
                {isEn ? 'Order voucher' : 'Поръчай ваучер'}
              </>
            )}
          </button>

          <p className="text-xs text-foreground-400 text-center">
            {isEn
              ? 'After submitting, we will contact you for confirmation within a few hours.'
              : 'След изпращане ще се свържем с вас за потвърждение в рамките на часове.'}
          </p>
        </form>
      )}
    </div>
  );
};

function FaqSection({ isEn }: { isEn: boolean }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div
      ref={ref}
      className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground-950 mb-3">
        {isEn ? 'Frequently asked questions' : 'Често задавани въпроси'}
      </h2>
      <p className="text-sm text-foreground-500 mb-7">
        {isEn ? 'Everything you need to know about gift vouchers.' : 'Всичко, което трябва да знаете за подаръчните ваучери.'}
      </p>
      <div className="space-y-3">
        {VOUCHER_FAQ.map((item, i) => (
          <div
            key={i}
            className="bg-background-100 rounded-xl border border-background-200/70 overflow-hidden"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer group"
            >
              <span className="text-sm font-medium text-foreground-900 group-hover:text-primary-600 transition-colors pr-4">
                {item.q}
              </span>
              <i
                className={`ri-arrow-down-s-line text-foreground-400 flex-shrink-0 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${open === i ? 'max-h-48 pb-4' : 'max-h-0'}`}
            >
              <p className="px-5 text-sm text-foreground-600 leading-relaxed">{item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}