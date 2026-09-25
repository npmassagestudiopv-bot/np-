import { useTranslation } from 'react-i18next';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { googleReviews, GOOGLE_REVIEWS_URL, GOOGLE_RATING, GOOGLE_REVIEW_COUNT } from '@/mocks/googleReviews';

export default function TestimonialsSection() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 });

  return (
    <section className="py-20 md:py-28 bg-background-50">
      <div className="w-full px-4 md:px-6 lg:px-10">
        <div
          ref={ref}
          className={`text-center mb-12 md:mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent-600 mb-3">
            {t('testimonialsLabel')}
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground-950">
            {t('testimonialsTitle')}
          </h2>
          <p className="text-sm text-foreground-600 mt-3 max-w-lg mx-auto">
            {t('testimonialsSubtitle')}
          </p>

          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 mt-5 px-5 py-2.5 bg-background-100 border border-background-200/70 rounded-full hover:bg-background-200/50 active:scale-[0.98] transition-all duration-300 cursor-pointer group"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-google-fill text-foreground-700 text-lg" />
            </div>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} className="w-3.5 h-3.5 flex items-center justify-center">
                  <i className="ri-star-fill text-yellow-400 text-xs" />
                </div>
              ))}
            </div>
            <span className="text-sm font-semibold text-foreground-800 whitespace-nowrap">
              {GOOGLE_RATING.toFixed(1)}
            </span>
            <span className="text-xs text-foreground-500 whitespace-nowrap">
              · {GOOGLE_REVIEW_COUNT} {isEn ? 'reviews' : 'отзива'}
            </span>
            <div className="w-3.5 h-3.5 flex items-center justify-center">
              <i className="ri-arrow-right-up-line text-foreground-400 text-xs group-hover:text-foreground-600 transition-colors" />
            </div>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-4xl mx-auto">
          {googleReviews.map((review, index) => {
            const displayText = isEn ? review.en.text : review.bg.text;
            const displayDate = isEn ? review.en.date : review.bg.date;

            return (
              <div
                key={review.name}
                className={`bg-background-100 rounded-2xl p-6 md:p-8 border border-background-200/60 transition-all duration-700 hover:border-background-300/80 hover:bg-background-200/30 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-3 mb-5">
                  <div className="w-11 h-11 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-heading font-semibold text-sm flex-shrink-0">
                    {review.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground-800">
                      {review.name}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap mt-0.5">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div key={star} className="w-3 h-3 flex items-center justify-center">
                            <i
                              className={`text-[11px] ${
                                star <= review.rating
                                  ? 'ri-star-fill text-yellow-400'
                                  : 'ri-star-line text-background-300'
                              }`}
                            />
                          </div>
                        ))}
                      </div>
                      {review.isLocalGuide && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-foreground-500 bg-background-200/70 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                          <div className="w-3 h-3 flex items-center justify-center">
                            <i className="ri-map-pin-line text-[10px]" />
                          </div>
                          {isEn ? 'Local Guide' : 'Локален експерт'} · {review.localGuideReviews}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-4 h-4 flex items-center justify-center flex-shrink-0" title="Google Review">
                    <i className="ri-google-fill text-foreground-400 text-sm" />
                  </div>
                </div>
                <div className="h-px bg-background-200/60 mb-5" />
                <p className="text-sm text-foreground-600 leading-relaxed italic">
                  &ldquo;{displayText}&rdquo;
                </p>
                <p className="text-xs text-foreground-400 mt-3">
                  {displayDate}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary-500 text-background-50 text-sm font-medium rounded-full hover:bg-primary-600 active:scale-[0.98] transition-all duration-300 whitespace-nowrap cursor-pointer min-h-[48px]"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-google-fill text-sm" />
            </div>
            {isEn
              ? `View all ${GOOGLE_REVIEW_COUNT} Google Reviews`
              : `Виж всички ${GOOGLE_REVIEW_COUNT} отзива в Google`}
          </a>
        </div>
      </div>
    </section>
  );
}