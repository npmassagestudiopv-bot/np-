import { localizedPath } from './localizedPaths';
import type { SeoOptions } from './seoContext';
import { buildHowToSchema } from './seoSchemas';

const englishPages: Record<string, { title: string; description: string; label: string }> = {
  '/uslugi': { title: 'Massage Services & Prices | NP Massage Studio — 15–30 €', description: 'Compare five massages in Veliko Tarnovo and Pavlikeni. Sessions last 40–60 minutes and cost 15–30 €. Choose a service and request an appointment online.', label: 'Services' },
  '/za-nas': { title: 'About NP Massage Studio | Veliko Tarnovo & Pavlikeni', description: 'Get to know NP Massage Studio, managed by Nathan Petkov. Individual care and five massage services at our studios in Veliko Tarnovo and Pavlikeni.', label: 'About' },
  '/lokacii': { title: 'Massage Studio Locations | Veliko Tarnovo & Pavlikeni', description: 'Find NP Massage Studio at 72 Bulgaria Boulevard, Veliko Tarnovo, and 10 Atanas Donchev Street, Pavlikeni. View maps, directions and opening hours.', label: 'Locations' },
  '/kontakti': { title: 'Contact & Massage Appointments | NP Massage Studio', description: 'Contact NP Massage Studio in Veliko Tarnovo and Pavlikeni. Call +359 988 926 120, send a message or request your massage appointment online.', label: 'Contact' },
  '/rezervaciya': { title: 'Book a Massage in Veliko Tarnovo or Pavlikeni | NP Massage Studio', description: 'Request a massage appointment online. Choose a service, studio, date and available time. Sessions cost 15–30 €. We will contact you to confirm your booking.', label: 'Book a massage' },
  '/blog': { title: 'Massage Blog & Practical Guides | NP Massage Studio', description: 'Read about massage services, preparing for your visit and choosing a session at NP Massage Studio in Veliko Tarnovo and Pavlikeni.', label: 'Blog' },
  '/vaucheri': { title: 'Massage Gift Vouchers | NP Massage Studio — Veliko Tarnovo & Pavlikeni', description: 'Give someone time to relax with a massage gift voucher. Choose a service at NP Massage Studio in Veliko Tarnovo or Pavlikeni. Valid for six months.', label: 'Gift vouchers' },
  '/za-np-massage-studio': { title: 'Studio & Company Information | NP Massage Studio', description: 'Company registration, management, studio addresses and contacts for NP Massage Studio in Veliko Tarnovo and Pavlikeni. EIK 206564269.', label: 'Studio information' },
  '/videos-masazhi': { title: 'Compare Massage Types, Prices & Duration | NP Massage Studio', description: 'Compare classical, sports, anti-cellulite and back massage, and aromatherapy. Find the right session for your preferences: 40–60 minutes, 15–30 €.', label: 'Compare massages' },
};

export const englishBookingHowTo = buildHowToSchema('How to book a massage at NP Massage Studio', 'Request an appointment at our studio in Veliko Tarnovo or Pavlikeni.', [
  { name: 'Choose a massage', text: 'Read the service descriptions and check the price and duration.' },
  { name: 'Choose a studio and time', text: 'Select Veliko Tarnovo or Pavlikeni, then a date and an available time.' },
  { name: 'Send your request', text: 'Complete your contact details and submit the booking form, or call +359 988 926 120.' },
  { name: 'Confirm your visit', text: 'We will contact you to confirm your appointment.' },
]);

export const englishChoosingHowTo = buildHowToSchema('How to choose a massage', 'Compare your preferences with the five services at NP Massage Studio.', [
  { name: 'Think about what you need', text: 'Choose a relaxing session, a massage after physical activity or focused attention to your back and shoulders.' },
  { name: 'Check the price and duration', text: 'Our five services cost 15–30 € and last 40–60 minutes.' },
  { name: 'Ask us for help', text: 'Call +359 988 926 120 if you would like to discuss the options before booking.' },
  { name: 'Request an appointment', text: 'Choose your studio, date and available time online, or book by phone.' },
]);

// Page metadata, page-specific schemas and breadcrumb links share one language.
// Business identity IDs remain stable across both language versions.
export function localizePageSeo(options: SeoOptions, bgPath: string, isEn: boolean): SeoOptions {
  if (!isEn) return options;
  const copy = englishPages[bgPath];
  if (!copy) return options;
  return {
    ...options,
    title: copy.title,
    description: copy.description,
    keywords: undefined,
    og: { ...options.og, title: copy.title, description: copy.description, locale: 'en_US', localeAlternate: ['bg_BG'] },
    schemas: options.schemas?.map((schema) => {
      if (['WebPage', 'AboutPage', 'ContactPage', 'CollectionPage'].includes(schema.type)) {
        return { ...schema, data: { ...schema.data, name: copy.title, description: copy.description, inLanguage: 'en' } };
      }
      if (schema.type === 'BreadcrumbList') {
        const items = schema.data.itemListElement as Array<{ item?: { '@id': string; name?: string }; name?: string }>;
        return { ...schema, data: { ...schema.data, itemListElement: items.map((item, index) => {
          const name = index === 0 ? 'Home' : copy.label;
          const target = item.item?.['@id'];
          return { ...item, name, ...(target ? { item: { ...item.item, name, '@id': new URL(localizedPath(new URL(target).pathname, 'en'), target).href } } : {}) };
        }) } };
      }
      if (schema.type === 'HowTo') return ['/uslugi', '/videos-masazhi'].includes(bgPath) ? englishChoosingHowTo : englishBookingHowTo;
      return schema;
    }),
  };
}
