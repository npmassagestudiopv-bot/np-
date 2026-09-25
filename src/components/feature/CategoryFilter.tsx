import { useState } from 'react';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string | null;
  onChange: (category: string | null) => void;
  isEn: boolean;
}

export default function CategoryFilter({ categories, activeCategory, onChange, isEn }: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-8">
      <div className="hidden md:flex items-center gap-2 flex-wrap">
        <button
          onClick={() => onChange(null)}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 whitespace-nowrap cursor-pointer ${
            activeCategory === null
              ? 'bg-primary-500 text-background-50'
              : 'bg-background-100 text-foreground-700 hover:bg-background-200/50 border border-background-200/70'
          }`}
        >
          {isEn ? 'All' : 'Всички'}
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 whitespace-nowrap cursor-pointer ${
              activeCategory === cat
                ? 'bg-primary-500 text-background-50'
                : 'bg-background-100 text-foreground-700 hover:bg-background-200/50 border border-background-200/70'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-background-100 rounded-xl border border-background-200/70 text-sm font-medium text-foreground-700 cursor-pointer"
        >
          <span>
            {isEn ? 'Category:' : 'Категория:'} {activeCategory || (isEn ? 'All' : 'Всички')}
          </span>
          <span className="w-5 h-5 flex items-center justify-center text-foreground-500">
            <i className={`ri-arrow-up-s-line transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`} />
          </span>
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-background-100 rounded-xl border border-background-200/70 overflow-hidden">
            <button
              onClick={() => { onChange(null); setIsOpen(false); }}
              className={`w-full text-left px-4 py-3 text-sm cursor-pointer transition-colors ${
                activeCategory === null ? 'bg-primary-50 text-primary-700 font-medium' : 'text-foreground-700 hover:bg-background-200/30'
              }`}
            >
              {isEn ? 'All' : 'Всички'}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { onChange(cat); setIsOpen(false); }}
                className={`w-full text-left px-4 py-3 text-sm cursor-pointer transition-colors border-t border-background-200/50 ${
                  activeCategory === cat ? 'bg-primary-50 text-primary-700 font-medium' : 'text-foreground-700 hover:bg-background-200/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}