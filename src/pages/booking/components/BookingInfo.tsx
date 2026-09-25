import { useTranslation } from 'react-i18next';

export default function BookingInfo() {
  const { t } = useTranslation();

  const steps = [
    {
      icon: 'ri-edit-line',
      text: t('bookingStep1') || '1. Попълнете формата с вашите данни',
    },
    {
      icon: 'ri-map-pin-line',
      text: t('bookingStep2') || '2. Изберете услуга, локация, дата и час',
    },
    {
      icon: 'ri-phone-line',
      text: t('bookingStep3') || '3. Ние потвърждаваме резервацията по телефон',
    },
    {
      icon: 'ri-sparkling-line',
      text: t('bookingStep4') || '4. Пристигате на час и се наслаждавате',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-background-100 rounded-2xl p-5 md:p-6 border border-background-200/70">
        <h3 className="font-heading text-lg font-semibold text-foreground-950 mb-4">
          {t('bookingInfoTitle') || 'Как работи?'}
        </h3>
        <ol className="space-y-3">
          {steps.map((step, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm text-foreground-600"
            >
              <div className="w-7 h-7 flex items-center justify-center bg-primary-100 rounded-full flex-shrink-0 mt-0.5">
                <i className={`${step.icon} text-primary-600 text-xs`} />
              </div>
              {step.text}
            </li>
          ))}
        </ol>
      </div>

      <div className="bg-background-100 rounded-2xl p-5 md:p-6 border border-background-200/70">
        <h3 className="font-heading text-lg font-semibold text-foreground-950 mb-3">
          {t('contactWorkingHours')}
        </h3>
        <div className="space-y-2 text-sm text-foreground-600">
          <div className="flex items-center gap-2">
            <i className="ri-calendar-line text-primary-500" />
            <span>{t('footerMonFri')}</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="ri-calendar-line text-primary-500" />
            <span>{t('footerSat')}</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="ri-calendar-line text-primary-500" />
            <span>{t('footerSun')}</span>
          </div>
        </div>
      </div>

      <div className="bg-primary-50 rounded-2xl p-5 md:p-6 border border-primary-200/50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-primary-500 rounded-full flex-shrink-0">
            <i className="ri-shield-check-line text-background-50" />
          </div>
          <div>
            <h4 className="font-medium text-foreground-900 text-sm mb-1">
              Безплатна резервация
            </h4>
            <p className="text-xs text-foreground-600 leading-relaxed">
              Запазването на час е безплатно. Плащането става на място след процедурата.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}