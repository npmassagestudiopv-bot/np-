import { useLocalizedNav } from '@/hooks/useLocalizedNav';

export default function MobileBottomCta() {
  const { getPath, handleNav, isEn } = useLocalizedNav();

  return (
    <nav aria-label={isEn ? 'Call or book a massage' : 'Обаждане и резервация'} className="mobile-actions fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background-50/95 backdrop-blur-md border-t border-background-200/60 px-4 py-3 safe-area-bottom">
      <div className="flex items-center gap-3 max-w-lg mx-auto">
        <a
          href="tel:+359988926120"
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 border-2 border-primary-400/70 text-primary-700 font-semibold text-sm rounded-full hover:bg-primary-50 hover:border-primary-500 active:scale-[0.97] transition-all duration-300 whitespace-nowrap cursor-pointer min-h-[48px]"
        >
          <i className="ri-phone-line text-base" />
          {isEn ? 'Call us' : 'Обади се'}
        </a>
        <a
          href={getPath('/rezervaciya')}
          onClick={(e) => {
            e.preventDefault();
            handleNav(getPath('/rezervaciya'));
          }}
          className="flex-[1.5] inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 text-background-50 font-semibold text-sm rounded-full hover:bg-primary-600 active:scale-[0.97] transition-all duration-300 whitespace-nowrap cursor-pointer btn-premium min-h-[48px]"
        >
          <i className="ri-calendar-check-line text-base" />
          {isEn ? 'Book a massage' : 'Запази час'}
        </a>
      </div>
    </nav>
  );
}
