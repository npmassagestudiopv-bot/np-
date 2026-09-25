export interface GoogleReview {
  name: string;
  initials: string;
  isLocalGuide: boolean;
  localGuideReviews: number;
  rating: number;
  bg: {
    text: string;
    date: string;
  };
  en: {
    text: string;
    date: string;
  };
}

export const googleReviews: GoogleReview[] = [
  {
    name: 'Ferko Petkov',
    initials: 'FP',
    isLocalGuide: false,
    localGuideReviews: 0,
    rating: 5,
    bg: {
      text: 'Давам 5 звезди защото няма 6. Няма равен! Ако те докосне, ставаш друг човек. Човекът е точен, винаги се старае да даде максимума от себе си.',
      date: 'преди 2 седмици',
    },
    en: {
      text: 'I give 5 stars because there is no 6. There is no equal! If he touches you, you become a different person. He is punctual, always striving to give his best.',
      date: '2 weeks ago',
    },
  },
  {
    name: 'Petya Doneva',
    initials: 'PD',
    isLocalGuide: false,
    localGuideReviews: 0,
    rating: 5,
    bg: {
      text: 'Посещавам студиото многократно и вече мога да кажа — заслужава дори повече от 5 звезди. Всеки път масажът е уникален, а отношението е на най-високо ниво.',
      date: 'преди месец',
    },
    en: {
      text: 'I have visited the studio many times now and I can say — it deserves even more than 5 stars. Every time the massage is unique and the attitude is top-notch.',
      date: 'a month ago',
    },
  },
  {
    name: 'Madison M',
    initials: 'MM',
    isLocalGuide: false,
    localGuideReviews: 0,
    rating: 5,
    bg: {
      text: 'Отидохме във Велико Търново като двойка за два различни масажа — спортен и класически релаксиращ. От самото начало беше много професионално и приятелски. Страхотна цена и невероятно изживяване.',
      date: 'преди седмица',
    },
    en: {
      text: 'We went to Veliko Tarnovo as a couple to get two different massages — a sports massage and a classic relaxation massage. From the get go it was very professional and friendly. Great price and amazing experience.',
      date: 'a week ago',
    },
  },
  {
    name: 'Todor Donchev',
    initials: 'TD',
    isLocalGuide: true,
    localGuideReviews: 107,
    rating: 5,
    bg: {
      text: 'Много съм доволен от спортния масаж при Nathan. Работи професионално, обръща внимание на детайлите и не прекалява. Определено препоръчвам!',
      date: 'преди 3 месеца',
    },
    en: {
      text: 'I am very satisfied with the sports massage with Nathan. He works professionally, pays attention to details and does not overdo it. I definitely recommend!',
      date: '3 months ago',
    },
  },
];

export const GOOGLE_REVIEWS_URL = 'https://www.google.com/maps/place/NP+Massage+Studio+%7C+%D0%9C%D0%B0%D1%81%D0%B0%D0%B6%D0%BD%D0%BE+%D1%81%D1%82%D1%83%D0%B4%D0%B8%D0%BE+%D0%92%D0%B5%D0%BB%D0%B8%D0%BA%D0%BE+%D0%A2%D1%8A%D1%80%D0%BD%D0%BE%D0%B2%D0%BE/@43.080935,25.6127656,17z';

export const GOOGLE_RATING = 5.0;
export const GOOGLE_REVIEW_COUNT = 32;