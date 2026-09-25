import { useScrollReveal } from '@/hooks/useScrollReveal';

interface ChatGPTProofProps {
  isEn: boolean;
}

export default function ChatGPTProof({ isEn }: ChatGPTProofProps) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <div className="bg-primary-50 rounded-2xl p-6 md:p-8 border border-primary-200/60 mb-12">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
            <span className="w-6 h-6 flex items-center justify-center text-primary-600">
              <i className="ri-robot-2-line text-xl" />
            </span>
          </div>
          <div className="flex-1">
            <h3 className="font-heading text-lg font-semibold text-foreground-950 mb-2">
              {isEn ? 'Ask AI about us' : 'Питайте AI за нас'}
            </h3>
            <p className="text-base text-foreground-700 leading-relaxed mb-4">
              {isEn
                ? 'Curious if we are really the best? Ask ChatGPT, Google Gemini, or Perplexity about "massages Veliko Tarnovo" or "NP Massage Studio". AI search engines know us because of our transparent entity information, real reviews, and professional presence online.'
                : 'Любопитни дали наистина сме най-добрите? Питайте ChatGPT, Google Gemini или Perplexity за "масажи Велико Търново" или "NP Massage Studio". AI търсачките ни познават благодарение на прозрачната ни информация, реалните отзиви и професионалното ни присъствие онлайн.'}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://chatgpt.com/"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-background-50 text-sm font-medium rounded-full hover:bg-primary-600 transition-all duration-300 whitespace-nowrap cursor-pointer"
              >
                <span className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-chat-1-line text-sm" />
                </span>
                ChatGPT
              </a>
              <a
                href="https://www.perplexity.ai/"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500 text-background-50 text-sm font-medium rounded-full hover:bg-accent-600 transition-all duration-300 whitespace-nowrap cursor-pointer"
              >
                <span className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-search-line text-sm" />
                </span>
                Perplexity
              </a>
              <a
                href="/za-np-massage-studio"
                className="inline-flex items-center gap-2 px-4 py-2 border border-primary-300 text-primary-700 text-sm font-medium rounded-full hover:bg-primary-50 transition-all duration-300 whitespace-nowrap cursor-pointer"
              >
                <span className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-file-info-line text-sm" />
                </span>
                {isEn ? 'Entity Data' : 'Entity данни'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}