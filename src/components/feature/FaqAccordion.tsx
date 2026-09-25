import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FaqItem {
  qKey?: string;
  aKey?: string;
  q?: string;
  a?: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  defaultOpen?: number | null;
}

export default function FaqAccordion({ items, defaultOpen = 0 }: FaqAccordionProps) {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);

  const getQuestion = (faq: FaqItem) => {
    if (faq.qKey) return t(faq.qKey);
    return faq.q || '';
  };

  const getAnswer = (faq: FaqItem) => {
    if (faq.aKey) return t(faq.aKey);
    return faq.a || '';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {items.map((faq, index) => (
        <div
          key={index}
          className="bg-background-100 rounded-xl border border-background-200/70 overflow-hidden transition-all"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-4 md:p-5 text-left cursor-pointer group"
            aria-expanded={openIndex === index}
            aria-controls={`faq-content-${index}`}
          >
            <span className="text-sm md:text-base font-medium text-foreground-900 pr-4 group-hover:text-primary-600 transition-colors">
              {getQuestion(faq)}
            </span>
            <span
              className={`w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 transition-all duration-300 ${
                openIndex === index
                  ? 'bg-primary-500 text-background-50 rotate-0'
                  : 'bg-background-200/70 text-foreground-500'
              }`}
            >
              <i className={`ri-${openIndex === index ? 'subtract' : 'add'}-line text-sm`} />
            </span>
          </button>
          <div
            id={`faq-content-${index}`}
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              openIndex === index ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
            }`}
            aria-hidden={openIndex !== index}
            {...(openIndex !== index ? { inert: true } : {})}
          >
            <div className="px-4 md:px-5 pb-4 md:pb-5">
              <p className="text-sm text-foreground-600 leading-relaxed">{getAnswer(faq)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}