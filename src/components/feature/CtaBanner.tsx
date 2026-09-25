import { useTranslation } from 'react-i18next';
import { useLocalizedNav } from '@/hooks/useLocalizedNav';

interface CtaBannerProps {
  variant?: 'primary' | 'light';
}

export default function CtaBanner({ variant = 'primary' }: CtaBannerProps) {
  const { t } = useTranslation();
  const { handleNav } = useLocalizedNav();

  if (variant === 'primary') {
    return (
      <div className="bg-primary-500 rounded-2xl p-6 md:p-10 text-center">
        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-background-50 mb-3">
          {t('ctaTitle')}
        </h2>
        <p className="text-sm text-background-200/90 mb-6 max-w-lg mx-auto leading-relaxed">
          {t('ctaSubtitle')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/rezervaciya"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/rezervaciya');
            }}
            className="inline-flex items-center justify-center px-8 py-4 bg-background-50 text-primary-700 font-medium text-sm rounded-full hover:bg-background-100 active:scale-[0.98] transition-all duration-300 whitespace-nowrap cursor-pointer shadow-sm min-h-[48px]"
          >
            {t('ctaButton')}
          </a>
          <div className="flex items-center gap-2 text-sm text-background-200/90">
            <span>{t('ctaPhone')}</span>
            <a
              href="tel:+359988926120"
              className="font-semibold text-background-50 hover:text-background-100 transition-colors cursor-pointer"
            >
              +359 988 926 120
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-100 rounded-2xl p-6 md:p-10 text-center border border-background-200/70">
      <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground-950 mb-3">
        {t('ctaTitle')}
      </h2>
      <p className="text-sm text-foreground-600 mb-6 max-w-lg mx-auto leading-relaxed">
        {t('ctaSubtitle')}
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href="/rezervaciya"
          onClick={(e) => {
            e.preventDefault();
            handleNav('/rezervaciya');
          }}
          className="inline-flex items-center justify-center px-8 py-4 bg-primary-500 text-background-50 font-medium text-sm rounded-full hover:bg-primary-600 active:scale-[0.98] transition-all duration-300 whitespace-nowrap cursor-pointer shadow-sm min-h-[48px]"
        >
          {t('ctaButton')}
        </a>
        <div className="flex items-center gap-2 text-sm text-foreground-600">
          <span>{t('ctaPhone')}</span>
          <a
            href="tel:+359988926120"
            className="font-semibold text-primary-600 hover:text-primary-700 transition-colors cursor-pointer"
          >
            +359 988 926 120
          </a>
        </div>
      </div>
    </div>
  );
}