import { useScrollReveal } from '@/hooks/useScrollReveal';

interface SeoTextBlockProps {
  isEn: boolean;
}

export default function SeoTextBlock({ isEn }: SeoTextBlockProps) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <div className="bg-background-100 rounded-2xl p-5 md:p-6 border border-background-200/70">
        <h3 className="font-heading text-lg font-semibold text-foreground-950 mb-4">
          {isEn ? 'Massage in Veliko Tarnovo and Pavlikeni' : 'Масажи във Велико Търново и Павликени'}
        </h3>
        <p className="text-sm text-foreground-700 leading-relaxed mb-3">
          {isEn
            ? 'At NP Massage Studio, we take time to understand what you need and adjust the pressure to your comfort. Choose a classical, sports, anti-cellulite or back massage, or aromatherapy. Sessions last 40–60 minutes and cost 15–30 €.'
            : 'В NP Massage Studio отделяме време да разберем от какво имате нужда и съобразяваме натиска с вашия комфорт. Изберете класически, спортен, антицелулитен масаж, ароматерапия или масаж на гръб. Сесиите са 40–60 минути, с цени 15–30 €.'}
        </p>
        <p className="text-sm text-foreground-700 leading-relaxed">
          {isEn
            ? 'Visit us at 72 Bulgaria Blvd., Veliko Tarnovo, or 10 Atanas Donchev St., Pavlikeni. For help choosing a massage or booking a visit, call '
            : 'Ще ни намерите на бул. България 72 във Велико Търново и ул. Атанас Дончев 10 в Павликени. За помощ при избора или записване на час се обадете на '}
          <a href="tel:+359988926120" className="font-medium text-primary-700 underline underline-offset-4">+359 988 926 120</a>.
        </p>
      </div>
    </div>
  );
}