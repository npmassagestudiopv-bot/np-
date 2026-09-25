export const baseUrl = (import.meta as unknown as { env: Record<string, string> }).env.VITE_SITE_URL || 'https://npmassagestudio.com';

const PHONE = '+359988926120';
const EMAIL = 'npmassagestudiopv@gmail.com';
const LOGO = 'https://storage.helloreaddy.io/project_files/ac01bae9-5287-435a-8690-39522f5115fa/a44364ff-b9d6-4117-8394-dcd7f0becbd6_compressed_--.webp';

const SAME_AS = [
  'https://www.facebook.com/profile.php?id=61569758628011',
  'https://www.instagram.com/np_massage_studio/',
  'https://www.tiktok.com/@npmassagestudio',
  'https://www.zlatnafirma.eu/company/np-massage-studio-masazhno-studio-veliko-trnovo-1214442',
  'https://www.oink.bg/search/veliko-tarnovo/masazhi',
  'https://www.orlizdrave.eu/profile-32280-np-massage-studio',
  'https://www.google.com/maps/place/NP+Massage+Studio+%7C+%D0%9C%D0%B0%D1%81%D0%B0%D0%B6%D0%BD%D0%BE+%D1%81%D1%82%D1%83%D0%B4%D0%B8%D0%BE+%D0%92%D0%B5%D0%BB%D0%B8%D0%BA%D0%BE+%D0%A2%D1%8A%D1%80%D0%BD%D0%BE%D0%B2%D0%BE/@43.080935,25.6127656,17z',
];

const VT_MAP = 'https://www.google.com/maps/place/NP+Massage+Studio+%7C+%D0%9C%D0%B0%D1%81%D0%B0%D0%B6%D0%BD%D0%BE+%D1%81%D1%82%D1%83%D0%B4%D0%B8%D0%BE+%D0%92%D0%B5%D0%BB%D0%B8%D0%BA%D0%BE+%D0%A2%D1%8A%D1%80%D0%BD%D0%BE%D0%B2%D0%BE/@43.080935,25.6127656,17z';
const PV_MAP = 'https://www.google.com/maps/dir/NP+Massage+Studio+Pavlikeni,+%D0%A6%D0%B5%D0%BD%D1%82%D1%8A%D1%80,+%D1%83%D0%BB.+%D0%90%D1%82%D0%B0%D0%BD%D0%B0%D1%81+%D0%94%D0%BE%D0%BD%D1%87%D0%B5%D0%B2+10,+5200+%D0%9F%D0%B0%D0%B2%D0%BB%D0%B8%D0%BA%D0%B5%D0%BD%D0%B8/@43.2363828,25.2975614,15z';

const OPENING_HOURS = [
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '19:00',
  },
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Saturday'],
    opens: '09:00',
    closes: '17:00',
  },
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Sunday'],
    opens: '10:00',
    closes: '16:00',
  },
];

const OFFER_CATALOG = {
  '@type': 'OfferCatalog',
  name: 'NP Massage Studio Услуги и Цени',
  itemListElement: [
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Класически и релаксиращ масаж',
        description: 'Традиционна техника за релаксиране на мускулите, намаляване на стреса и подобряване на общото благосъстояние. 60 минути.',
      },
      price: '25',
      priceCurrency: 'EUR',
    },
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Спортен и терапевтичен масаж',
        description: 'Целенасочена терапия за спортисти и активни хора. 60 минути.',
      },
      price: '25',
      priceCurrency: 'EUR',
    },
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Антицелулитен масаж',
        description: 'Ефективна процедура за гладка и стегната кожа. 40 минути.',
      },
      price: '20',
      priceCurrency: 'EUR',
    },
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Ароматерапия',
        description: 'Съчетание на масаж и етерични масла за дълбок релакс. 60 минути.',
      },
      price: '30',
      priceCurrency: 'EUR',
    },
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Частичен масаж на гръб',
        description: 'Целенасочена терапия за облекчаване на напрежението в гърба, раменете и врата. 40 минути.',
      },
      price: '15',
      priceCurrency: 'EUR',
    },
  ],
};

export function buildBreadcrumbSchema(items: Array<{ name: string; url?: string }>, currentPageUrl?: string) {
  return {
    type: 'BreadcrumbList',
    data: {
      itemListElement: items.map((item, index) => {
        const isLast = index === items.length - 1;
        return {
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          ...(item.url
            ? { item: { '@type': 'Thing', '@id': item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`, name: item.name } }
            : isLast
              ? {}
              : currentPageUrl
                ? { item: { '@type': 'Thing', '@id': currentPageUrl.startsWith('http') ? currentPageUrl : `${baseUrl}${currentPageUrl}`, name: item.name } }
                : {}),
        };
      }),
    },
  };
}

// LocalBusiness entity for the Veliko Tarnovo location only.
export function buildLocalBusinessVtSchema() {
  return {
    type: 'LocalBusiness',
    data: {
      '@type': ['LocalBusiness', 'MassageTherapy', 'HealthAndBeautyBusiness'],
      '@id': `${baseUrl}/#business-veliko-tarnovo`,
      name: 'NP Massage Studio Велико Търново',
      alternateName: ['NP Massage Studio', 'NP Massage', 'NP Масаж'],
      description: 'Професионален масажен салон NP Massage Studio във Велико Търново на бул. България 72. Предлага класически и релаксиращ масаж, спортен и терапевтичен масаж, антицелулитен масаж, ароматерапия и частичен масаж на гръб.',
      url: `${baseUrl}/masazhi-veliko-tarnovo`,
      telephone: PHONE,
      email: EMAIL,
      priceRange: '€€',
      currenciesAccepted: 'EUR',
      paymentAccepted: 'Cash',
      image: LOGO,
      logo: LOGO,
      foundingDate: '2024',
      parentOrganization: { '@id': `${baseUrl}/#organization` },
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'бул. България 72',
        addressLocality: 'Велико Търново',
        addressRegion: 'Велико Търново',
        postalCode: '5000',
        addressCountry: 'BG',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '43.08103687090604',
        longitude: '25.612733413492446',
      },
      areaServed: [
        { '@type': 'City', name: 'Велико Търново' },
        { '@type': 'City', name: 'Габрово' },
        { '@type': 'City', name: 'Горна Оряховица' },
        { '@type': 'City', name: 'Лясковец' },
      ],
      openingHoursSpecification: OPENING_HOURS,
      hasMap: VT_MAP,
      sameAs: SAME_AS,
      hasOfferCatalog: OFFER_CATALOG,
    },
  };
}

// LocalBusiness entity for the Pavlikeni location only.
export function buildLocalBusinessPvSchema() {
  return {
    type: 'LocalBusiness',
    data: {
      '@type': ['LocalBusiness', 'MassageTherapy', 'HealthAndBeautyBusiness'],
      '@id': `${baseUrl}/#business-pavlikeni`,
      name: 'NP Massage Studio Павликени',
      alternateName: ['NP Massage Studio', 'NP Massage', 'NP Масаж'],
      description: 'Професионален масажен салон NP Massage Studio в Павликени на ул. Атанас Дончев 10. Предлага класически и релаксиращ масаж, спортен и терапевтичен масаж, антицелулитен масаж, ароматерапия и частичен масаж на гръб.',
      url: `${baseUrl}/masazhi-pavlikeni`,
      telephone: PHONE,
      email: EMAIL,
      priceRange: '€€',
      currenciesAccepted: 'EUR',
      paymentAccepted: 'Cash',
      image: LOGO,
      logo: LOGO,
      foundingDate: '2024',
      parentOrganization: { '@id': `${baseUrl}/#organization` },
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'ул. Атанас Дончев 10',
        addressLocality: 'Павликени',
        addressRegion: 'Велико Търново',
        postalCode: '5250',
        addressCountry: 'BG',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '43.23929045147203',
        longitude: '25.30764655569994',
      },
      areaServed: [
        { '@type': 'City', name: 'Павликени' },
        { '@type': 'City', name: 'Севлиево' },
      ],
      openingHoursSpecification: OPENING_HOURS,
      hasMap: PV_MAP,
      sameAs: SAME_AS,
      hasOfferCatalog: OFFER_CATALOG,
    },
  };
}

// Backward-compatible alias — points to the Veliko Tarnovo entity.
export function buildLocalBusinessSchema() {
  return buildLocalBusinessVtSchema();
}

export function buildOrganizationSchema() {
  return {
    type: 'Organization',
    data: {
      '@id': `${baseUrl}/#organization`,
      name: 'NP Massage Studio',
      alternateName: 'NP Massage',
      url: baseUrl,
      logo: LOGO,
      description: 'Професионален масажен салон за масажи във Велико Търново и Павликени. Предлага класически, спортен, антицелулитен масаж, ароматерапия и терапевтични процедури.',
      telephone: PHONE,
      email: EMAIL,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'бул. България 72',
        addressLocality: 'Велико Търново',
        addressCountry: 'BG',
      },
      sameAs: SAME_AS,
    },
  };
}

export function buildWebSiteSchema() {
  return {
    type: 'WebSite',
    data: {
      '@id': `${baseUrl}/#website`,
      name: 'NP Massage Studio',
      url: baseUrl,
      description: 'NP Massage Studio предлага класически, спортен, антицелулитен масаж, ароматерапия и терапевтични процедури във Велико Търново и Павликени.',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${baseUrl}/?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
      publisher: {
        '@id': `${baseUrl}/#organization`,
      },
    },
  };
}

export function buildFaqSchema(questions: Array<{ q: string; a: string }>) {
  return {
    type: 'FAQPage',
    data: {
      mainEntity: questions.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    },
  };
}

export function buildOfferCatalogSchema(services: Array<{
  name: string;
  description: string;
  price: string;
  duration: string;
}>) {
  return {
    type: 'OfferCatalog',
    data: {
      name: 'NP Massage Studio Услуги',
      url: `${baseUrl}/uslugi`,
      itemListElement: services.map((service, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service.name,
            description: service.description,
            provider: {
              '@id': `${baseUrl}/#business-veliko-tarnovo`,
            },
          },
          price: service.price,
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
          eligibleRegion: {
            '@type': 'Country',
            name: 'Bulgaria',
          },
          duration: service.duration,
        },
      })),
    },
  };
}

export function buildBlogSchema(posts: Array<{
  title: string;
  description: string;
  publishedAt: string;
  slug?: string;
}>) {
  return {
    type: 'Blog',
    data: {
      name: 'Блог на NP Massage Studio',
      url: `${baseUrl}/blog`,
      description: 'Статии и съвети за масажната терапия, здраве и благосъстояние',
      publisher: {
        '@id': `${baseUrl}/#organization`,
      },
      blogPost: posts.map((post) => ({
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        datePublished: post.publishedAt,
        author: {
          '@id': `${baseUrl}/#organization`,
        },
        publisher: {
          '@id': `${baseUrl}/#organization`,
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': post.slug ? `${baseUrl}/blog/${post.slug}` : `${baseUrl}/blog`,
        },
      })),
    },
  };
}

export function buildWebPageSchema(
  name: string,
  description: string,
  url: string,
  type = 'WebPage',
  speakable?: { cssSelector?: string; xPath?: string }
) {
  const data: Record<string, unknown> = {
    '@id': `${baseUrl}${url}`,
    name,
    description,
    url: `${baseUrl}${url}`,
    isPartOf: {
      '@id': `${baseUrl}/#website`,
    },
    about: {
      '@id': `${baseUrl}/#business-veliko-tarnovo`,
    },
  };
  if (speakable) {
    data.speakable = {
      '@type': 'SpeakableSpecification',
      ...speakable,
    };
  }
  return {
    type,
    data,
  };
}

export function buildSiteNavigationSchema() {
  const navItems = [
    { name: 'Начало', url: '/' },
    { name: 'Услуги', url: '/uslugi' },
    { name: 'Подаръчни ваучери', url: '/vaucheri' },
    { name: 'За нас', url: '/za-nas' },
    { name: 'Локации', url: '/lokacii' },
    { name: 'Блог', url: '/blog' },
    { name: 'Контакти', url: '/kontakti' },
    { name: 'Запази час', url: '/rezervaciya' },
  ];
  return {
    type: 'SiteNavigationElement',
    data: {
      name: 'NP Massage Studio Navigation',
      hasPart: navItems.map((item, index) => ({
        '@type': 'SiteNavigationElement',
        position: index + 1,
        name: item.name,
        url: `${baseUrl}${item.url}`,
      })),
    },
  };
}

export function buildContactPointSchema() {
  return {
    type: 'ContactPoint',
    data: {
      contactType: 'customer service',
      telephone: PHONE,
      email: EMAIL,
      areaServed: 'BG',
      availableLanguage: ['bg', 'en'],
      contactOption: 'TollFree',
    },
  };
}

export function buildImageObjectSchema(
  url: string,
  caption: string,
  width?: number,
  height?: number
) {
  return {
    type: 'ImageObject',
    data: {
      contentUrl: url,
      caption,
      name: caption,
      description: caption,
      ...(width ? { width: String(width) } : {}),
      ...(height ? { height: String(height) } : {}),
      author: {
        '@id': `${baseUrl}/#organization`,
      },
      publisher: {
        '@id': `${baseUrl}/#organization`,
      },
    },
  };
}

export function buildServiceChannelSchema() {
  return {
    type: 'ServiceChannel',
    data: {
      serviceType: 'Massage Therapy',
      servicePhone: {
        '@type': 'ContactPoint',
        telephone: PHONE,
        contactType: 'booking',
      },
      serviceSms: {
        '@type': 'ContactPoint',
        telephone: PHONE,
        contactType: 'booking',
      },
      availableLanguage: ['bg', 'en'],
    },
  };
}

export function buildPlaceSchema(name: string, address: string, lat: string, lng: string) {
  return {
    type: 'Place',
    data: {
      name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: address,
        addressCountry: 'BG',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: lat,
        longitude: lng,
      },
    },
  };
}

export function buildMapSchema() {
  return {
    type: 'Map',
    data: {
      name: 'NP Massage Studio Локации',
      url: `${baseUrl}/lokacii`,
      about: {
        '@id': `${baseUrl}/#business-veliko-tarnovo`,
      },
    },
  };
}

export function buildPersonSchema() {
  return {
    type: 'Person',
    data: {
      '@id': `${baseUrl}/#person`,
      name: 'Натан Петков',
      alternateName: 'Nathan Petkov',
      jobTitle: 'Масажист, Управител на NP Massage Studio',
      description: 'Професионален масажист и управител на NP Massage Studio. Управлява два успешни масажни салона във Велико Търново и Павликени с фокус върху точност, професионализъм и индивидуален подход към всеки клиент.',
      knowsAbout: [
        'Масажна терапия',
        'Класически масаж',
        'Спортен масаж',
        'Антицелулитен масаж',
        'Ароматерапия',
        'Релаксиращ масаж',
        'Терапевтичен масаж',
        'Уелнес',
        'Здраве и благосъстояние',
      ],
      worksFor: {
        '@id': `${baseUrl}/#business-veliko-tarnovo`,
      },
      sameAs: SAME_AS,
    },
  };
}

export function buildHowToSchema(
  name: string,
  description: string,
  steps: Array<{ name: string; text: string; image?: string }>
) {
  return {
    type: 'HowTo',
    data: {
      name,
      description,
      step: steps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        text: step.text,
        ...(step.image ? { image: step.image } : {}),
      })),
      totalTime: 'PT5M',
      estimatedCost: {
        '@type': 'MonetaryAmount',
        currency: 'EUR',
        value: '0',
      },
    },
  };
}

export function buildProductSchema(
  name: string,
  description: string,
  price: string,
  currency = 'EUR',
  image?: string,
  slug?: string
) {
  return {
    type: 'Product',
    data: {
      name,
      description,
      image: image || LOGO,
      brand: {
        '@type': 'Brand',
        name: 'NP Massage Studio',
      },
      offers: {
        '@type': 'Offer',
        price,
        priceCurrency: currency,
        availability: 'https://schema.org/InStock',
        url: slug ? `${baseUrl}/uslugi/${slug}` : `${baseUrl}/uslugi`,
        seller: {
          '@id': `${baseUrl}/#business-veliko-tarnovo`,
        },
        eligibleRegion: {
          '@type': 'Country',
          name: 'Bulgaria',
        },
      },
      '@id': slug ? `${baseUrl}/#product-${slug}` : `${baseUrl}/#product-${name.toLowerCase().replace(/\s+/g, '-')}`,
    },
  };
}

export function buildReviewSchema(reviews: Array<{
  author: string;
  reviewBody: string;
  ratingValue: number;
  datePublished?: string;
}>) {
  return {
    type: 'ItemList',
    data: {
      name: 'NP Massage Studio Отзиви',
      itemListElement: reviews.map((review, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Review',
          reviewBody: review.reviewBody,
          author: {
            '@type': 'Person',
            name: review.author,
          },
          reviewRating: {
            '@type': 'Rating',
            ratingValue: review.ratingValue,
            bestRating: '5',
            worstRating: '1',
          },
          datePublished: review.datePublished || '2026-01-01',
          itemReviewed: {
            '@id': `${baseUrl}/#business-veliko-tarnovo`,
          },
        },
      })),
    },
  };
}