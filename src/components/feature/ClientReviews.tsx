import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useLocalizedNav } from '@/hooks/useLocalizedNav';
import { GOOGLE_REVIEWS_URL, GOOGLE_RATING, GOOGLE_REVIEW_COUNT } from '@/mocks/googleReviews';

interface ClientReviewsProps {
  isEn: boolean;
  limit?: number;
}

export default function ClientReviews({ isEn }: ClientReviewsProps) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const { handleNav } = useLocalizedNav();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <div className="bg-background-100 rounded-2xl p-6 md:p-8 border border-background-200/70">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
            <i className="ri-chat-smile-2-line text-primary-600 text-2xl" />
          </div>
          <h2 className="font-heading text-xl md:text-2xl font-semibold text-foreground-950 mb-2">
            {isEn ? 'Share Your Experience' : 'Споделете вашето преживяване'}
          </h2>
          <p className="text-sm text-foreground-600 max-w-lg mx-auto leading-relaxed mb-3">
            {isEn
              ? 'Your feedback helps us improve and helps others discover quality massage therapy in Veliko Tarnovo and Pavlikeni.'
              : 'Вашето мнение ни помага да се подобряваме и помага на други да открият качествена масажна терапия във Велико Търново и Павликени.'}
          </p>

          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-background-50 border border-background-200/70 rounded-full hover:bg-background-200/30 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} className="w-3 h-3 flex items-center justify-center">
                  <i className="ri-star-fill text-yellow-400 text-[11px]" />
                </div>
              ))}
            </div>
            <span className="text-sm font-semibold text-foreground-800 whitespace-nowrap">
              {GOOGLE_RATING.toFixed(1)}
            </span>
            <span className="text-xs text-foreground-500 whitespace-nowrap">
              · {GOOGLE_REVIEW_COUNT} {isEn ? 'Google reviews' : 'Google отзива'}
            </span>
          </a>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-background-50 text-sm font-medium rounded-full hover:bg-primary-600 active:scale-[0.98] transition-all duration-300 whitespace-nowrap cursor-pointer min-h-[48px]"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-google-fill" />
            </div>
            {isEn ? 'Leave a Google Review' : 'Оставете отзив в Google'}
          </a>
          <a
            href="tel:+359988926120"
            className="inline-flex items-center gap-2 px-6 py-3 border border-primary-500 text-primary-700 text-sm font-medium rounded-full hover:bg-primary-500 hover:text-background-50 active:scale-[0.98] transition-all duration-300 whitespace-nowrap cursor-pointer min-h-[48px]"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-phone-line" />
            </div>
            +359 988 926 120
          </a>
        </div>
      </div>
    </div>
  );
}