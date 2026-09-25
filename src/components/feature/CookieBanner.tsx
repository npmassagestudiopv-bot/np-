import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { invokeCookieConsent } from '@/lib/supabase';

interface ConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  accepted: boolean;
}

export default function CookieBanner() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
    accepted: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem('np_cookie_consent');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.accepted) {
        setConsent(parsed);
        return;
      }
    }
    setVisible(true);
  }, []);

  const saveConsent = async (type: 'full' | 'minimal' | 'custom') => {
    const newConsent: ConsentState = {
      necessary: true,
      analytics: type === 'full' || (type === 'custom' && consent.analytics),
      marketing: type === 'full' || (type === 'custom' && consent.marketing),
      preferences: type === 'full' || (type === 'custom' && consent.preferences),
      accepted: true,
    };
    setConsent(newConsent);
    localStorage.setItem('np_cookie_consent', JSON.stringify(newConsent));
    setVisible(false);

    try {
      await invokeCookieConsent({
        consent_type: type,
        necessary: true,
        analytics: newConsent.analytics,
        marketing: newConsent.marketing,
        preferences: newConsent.preferences,
        user_agent: navigator.userAgent.substring(0, 500),
      });
    } catch {
      // Silent fail — consent is still saved locally
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-background-50 border-t border-background-200/70 shadow-lg">
      <div className="w-full px-4 md:px-6 lg:px-10 py-4 md:py-5">
        <div className="max-w-5xl mx-auto">
          {!showDetails ? (
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-1">
                <p className="text-sm text-foreground-800 leading-relaxed">
                  {t('cookieBannerText')}
                </p>
                <div className="flex flex-wrap gap-3 mt-2">
                  <a href="/politika-biskvitki" onClick={(e) => { e.preventDefault(); navigate('/politika-biskvitki'); }} className="text-xs text-primary-600 hover:text-primary-700 underline cursor-pointer">
                    {t('cookiePolicyLink')}
                  </a>
                  <a href="/politika-poveritelnost" onClick={(e) => { e.preventDefault(); navigate('/politika-poveritelnost'); }} className="text-xs text-primary-600 hover:text-primary-700 underline cursor-pointer">
                    {t('privacyPolicyLink')}
                  </a>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowDetails(true)}
                  className="px-4 py-2.5 text-sm font-medium text-foreground-700 border border-background-300 rounded-full hover:bg-background-100 transition-colors duration-300 cursor-pointer whitespace-nowrap"
                >
                  {t('cookieCustomize')}
                </button>
                <button
                  onClick={() => saveConsent('minimal')}
                  className="px-4 py-2.5 text-sm font-medium text-foreground-700 border border-background-300 rounded-full hover:bg-background-100 transition-colors duration-300 cursor-pointer whitespace-nowrap"
                >
                  {t('cookieNecessaryOnly')}
                </button>
                <button
                  onClick={() => saveConsent('full')}
                  className="px-4 py-2.5 text-sm font-medium bg-primary-500 text-background-50 rounded-full hover:bg-primary-600 transition-colors duration-300 cursor-pointer whitespace-nowrap"
                >
                  {t('cookieAcceptAll')}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-background-200/50">
                  <div>
                    <p className="text-sm font-medium text-foreground-800">{t('cookieNecessary')}</p>
                    <p className="text-xs text-foreground-500">{t('cookieNecessaryDesc')}</p>
                  </div>
                  <div className="w-11 h-6 bg-primary-500 rounded-full flex items-center justify-end px-1">
                    <div className="w-4 h-4 bg-background-50 rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-background-200/50">
                  <div>
                    <p className="text-sm font-medium text-foreground-800">{t('cookieAnalytics')}</p>
                    <p className="text-xs text-foreground-500">{t('cookieAnalyticsDesc')}</p>
                  </div>
                  <button
                    onClick={() => setConsent((c) => ({ ...c, analytics: !c.analytics }))}
                    className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors duration-300 cursor-pointer ${
                      consent.analytics ? 'bg-primary-500 justify-end' : 'bg-background-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-background-50 rounded-full" />
                  </button>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-background-200/50">
                  <div>
                    <p className="text-sm font-medium text-foreground-800">{t('cookieMarketing')}</p>
                    <p className="text-xs text-foreground-500">{t('cookieMarketingDesc')}</p>
                  </div>
                  <button
                    onClick={() => setConsent((c) => ({ ...c, marketing: !c.marketing }))}
                    className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors duration-300 cursor-pointer ${
                      consent.marketing ? 'bg-primary-500 justify-end' : 'bg-background-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-background-50 rounded-full" />
                  </button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground-800">{t('cookiePreferences')}</p>
                    <p className="text-xs text-foreground-500">{t('cookiePreferencesDesc')}</p>
                  </div>
                  <button
                    onClick={() => setConsent((c) => ({ ...c, preferences: !c.preferences }))}
                    className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors duration-300 cursor-pointer ${
                      consent.preferences ? 'bg-primary-500 justify-end' : 'bg-background-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-background-50 rounded-full" />
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2.5 text-sm font-medium text-foreground-700 border border-background-300 rounded-full hover:bg-background-100 transition-colors duration-300 cursor-pointer whitespace-nowrap"
                >
                  {t('cookieBack')}
                </button>
                <button
                  onClick={() => saveConsent('custom')}
                  className="px-4 py-2.5 text-sm font-medium bg-primary-500 text-background-50 rounded-full hover:bg-primary-600 transition-colors duration-300 cursor-pointer whitespace-nowrap"
                >
                  {t('cookieSave')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}