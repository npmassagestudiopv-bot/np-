import * as bg from '@/i18n/local/bg/common';
import * as en from '@/i18n/local/en/common';
import { buildProductSchema } from './seoSchemas';

export function serviceSeoItems(isEn: boolean) {
  const copy = isEn ? en : bg;
  return [
    { name: copy.serviceClassical, description: copy.serviceClassicalDesc, price: '25', duration: 'PT60M', slug: 'klasicheski-masazh' },
    { name: copy.serviceSport, description: copy.serviceSportDesc, price: '25', duration: 'PT60M', slug: 'sporten-masazh' },
    { name: copy.serviceAnticellulite, description: copy.serviceAnticelluliteDesc, price: '20', duration: 'PT40M', slug: 'anticeluliten-masazh' },
    { name: copy.serviceAromatherapy, description: copy.serviceAromatherapyDesc, price: '30', duration: 'PT60M', slug: 'aromaterapiya' },
    { name: copy.serviceBack, description: copy.serviceBackDesc, price: '15', duration: 'PT40M', slug: 'masazh-na-grab' },
  ];
}

export function serviceProductSchemas(isEn: boolean) {
  return serviceSeoItems(isEn).map((item) => buildProductSchema(item.name, item.description, item.price, 'EUR', undefined, item.slug, isEn));
}
