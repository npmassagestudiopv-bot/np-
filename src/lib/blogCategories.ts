const englishCategories: Record<string, string> = {
  'Здраве': 'Wellness',
  'Маркетинг': 'Marketing',
  'Масажи': 'Massage',
  'Практически съвети': 'Practical tips',
  'Сравнение': 'Comparisons',
  'Терапевтичен масаж': 'Therapeutic massage',
  'Релаксация': 'Relaxation',
  'Ароматерапия': 'Aromatherapy',
  'Спортен масаж': 'Sports massage',
  'Антицелулитен масаж': 'Anti-cellulite massage',
};

// Translate display labels while keeping the stored category used for filtering.
export function categoryLabel(category: string, isEn: boolean) {
  return isEn ? englishCategories[category] || category : category;
}
