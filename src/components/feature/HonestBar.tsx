import { useLocalizedNav } from '@/hooks/useLocalizedNav';

interface HonestBarProps {
  isEn: boolean;
}

export default function HonestBar({ isEn }: HonestBarProps) {
  const { handleNav } = useLocalizedNav();

  return (
    <div className="bg-secondary-50 rounded-2xl p-6 md:p-8 border border-secondary-200/60 mb-12">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-secondary-100 flex items-center justify-center flex-shrink-0">
          <span className="w-6 h-6 flex items-center justify-center text-secondary-600">
            <i className="ri-heart-3-line text-xl" />
          </span>
        </div>
        <div>
          <h3 className="font-heading text-lg font-semibold text-foreground-950 mb-2">
            {isEn ? 'Not sure if massage is for you?' : 'Не сте сигурни дали масажът е за вас?'}
          </h3>
          <p className="text-base text-foreground-700 leading-relaxed mb-4">
            {isEn
              ? 'If you are unsure whether massage therapy is right for your situation — just call us. We will honestly tell you if we can help or if you should consult a doctor first. No pressure, no sales tactics. We believe in transparency and genuine care for every client.'
              : 'Ако не сте сигурни дали масажната терапия е подходяща за вашето състояние — просто ни се обадете. Ще ви кажем честно дали можем да помогнем или трябва първо да се обърнете към лекар. Без натиск, без продажбени трикове. Вярваме в прозрачността и истинската грижа за всеки клиент.'}
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <a
              href="tel:+359988926120"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary-500 text-background-50 text-sm font-medium rounded-full hover:bg-secondary-600 transition-all duration-300 whitespace-nowrap cursor-pointer"
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <i className="ri-phone-line text-sm" />
              </span>
              +359 988 926 120
            </a>
            <button
              onClick={() => handleNav('/kontakti')}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-secondary-300 text-secondary-700 text-sm font-medium rounded-full hover:bg-secondary-50 transition-all duration-300 whitespace-nowrap cursor-pointer"
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <i className="ri-message-3-line text-sm" />
              </span>
              {isEn ? 'Write to us' : 'Напишете ни'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}