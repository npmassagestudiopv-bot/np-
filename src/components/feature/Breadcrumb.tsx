import { useTranslation } from 'react-i18next';
import { useLocalizedNav } from '@/hooks/useLocalizedNav';

interface BreadcrumbProps {
  items: { label: string; path?: string }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const { t } = useTranslation();
  const { getPath, handleNav } = useLocalizedNav();

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-foreground-500 mb-6">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          {index > 0 && <span className="text-foreground-300">/</span>}
          {item.path ? (
            <a
              href={getPath(item.path)}
              onClick={(e) => {
                e.preventDefault();
                handleNav(getPath(item.path));
              }}
              className="hover:text-primary-600 transition-colors cursor-pointer"
            >
              {item.label}
            </a>
          ) : (
            <span className="text-foreground-700">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}