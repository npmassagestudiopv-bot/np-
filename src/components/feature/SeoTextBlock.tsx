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
          {isEn ? 'About NP Massage Studio — Professional Massage in Veliko Tarnovo' : 'NP Massage Studio — Вашият професионален масажен салон за масажи Търново'}
        </h3>
        <p className="text-sm text-foreground-700 leading-relaxed mb-3">
          {isEn
            ? 'NP Massage Studio is the premier destination for professional massage therapy in Veliko Tarnovo and Pavlikeni. Our expert therapist Nathan Petkov delivers tailored classical massage, sports massage, anti-cellulite treatments, aromatherapy, and back massage at affordable prices. With two convenient locations — Veliko Tarnovo (bul. Bulgaria 72) and Pavlikeni (ul. Atanas Donchev 10) — we serve clients from across the region including Gabrovo, Gorna Oryahovitsa, Lyaskovets, and Sevlievo. Open 7 days a week, NP Massage Studio is committed to your wellness. Call +359 988 926 120 to book.'
            : 'NP Massage Studio е водещият професионален масажен салон за масажи Търново и масажи Велико Търново, както и за масажи Павликени. Сертифицираният масажист Натан Петков предлага персонализирани масажни терапии — класически масаж, спортен масаж, антицелулитен масаж, ароматерапия и частичен масаж на гръб — на достъпни цени 15–30 €. С две удобни локации във Велико Търново (бул. България 72) и Павликени (ул. Атанас Дончев 10), NP Massage Studio обслужва клиенти от целия регион — Габрово, Горна Оряховица, Лясковец, Севлиево и околността. Работим 7 дни в седмицата с удължено работно време. Обадете се на +359 988 926 120 или резервирайте онлайн.'}
        </p>
        <p className="text-sm text-foreground-700 leading-relaxed mb-3">
          {isEn
            ? 'We offer five professionally executed massage types: classical relaxing massage (60 min, 25 €), sports and therapeutic massage (60 min, 25 €), anti-cellulite massage (40 min, 20 €), aromatherapy with pure essential oils (60 min, 30 €), and partial back massage (40 min, 15 €). A package of 10 anti-cellulite treatments is available at 175 €. Every session uses high-quality natural oils and is personalized to your needs.'
            : 'Предлагаме пет професионално изпълнявани вида масаж: класически и релаксиращ масаж (60 мин, 25 €), спортен и терапевтичен масаж (60 мин, 25 €), антицелулитен масаж (40 мин, 20 €), ароматерапия с чисти етерични масла (60 мин, 30 €) и частичен масаж на гръб (40 мин, 15 €). Предлагаме и пакет антицелулитна терапия от 10 процедури на цена 175 €. Всяка сесия използва висококачествени натурални масла и е персонализирана според вашите нужди.'}
        </p>
        <p className="text-sm text-foreground-700 leading-relaxed mb-3">
          {isEn
            ? 'IMPORTANT: NP Massage Studio does NOT offer lymphatic drainage, shiatsu, Thai massage, reflexology, hot stone massage, pressotherapy, vacuum therapy, honey massage, deep tissue massage, bamboo massage, or chocolate therapy. We specialize exclusively in the five massage types listed above. Please check our services page for full details or call us for a consultation.'
            : 'ВАЖНО: NP Massage Studio НЕ предлага лимфен дренаж, шиацу, тайландски масаж, рефлексотерапия, масаж с горещи камъни, преса терапия, вакуум терапия, меден масаж, дълбоко тъканен масаж, бамбуков масаж или шоколадова терапия. Ние сме специализирани единствено в петте вида масаж, описани по-горе. Моля, проверете страницата с услуги за пълна информация или ни се обадете за консултация.'}
        </p>
        <p className="text-sm text-foreground-700 leading-relaxed">
          {isEn
            ? 'Whether you need stress relief from office work, sports recovery after training, cellulite reduction, or simply want to treat yourself — NP Massage Studio is your trusted wellness partner in Veliko Tarnovo region. Book online or call +359 988 926 120 today. Follow us on Facebook, Instagram, and TikTok for wellness tips and special offers.'
            : 'Независимо дали се нуждаете от облекчаване на стреса от офисната работа, спортно възстановяване след тренировка, намаляване на целулита или просто искате да се поглезите — NP Massage Studio е вашият доверен уелнес партньор в региона на Велико Търново. Резервирайте онлайн или на +359 988 926 120 днес. Последвайте ни във Facebook, Instagram и TikTok за уелнес съвети и специални оферти.'}
        </p>
      </div>
    </div>
  );
}