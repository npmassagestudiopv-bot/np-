import { useState } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [expanded, setExpanded] = useState(true);

  if (items.length === 0) return null;

  return (
    <nav className="bg-background-100 rounded-2xl border border-background-200/70 mb-8 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
        aria-expanded={expanded}
      >
        <h3 className="font-heading text-base font-semibold text-foreground-900">
          Съдържание
        </h3>
        <span className="w-5 h-5 flex items-center justify-center text-foreground-500">
          <i className={`ri-arrow-up-s-line transition-transform duration-300 ${expanded ? '' : 'rotate-180'}`} />
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ${
          expanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="px-5 pb-4 space-y-1">
          {items.map((item, index) => (
            <li key={index}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(item.id);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    window.history.pushState(null, '', `#${item.id}`);
                  }
                }}
                className={`block text-sm transition-colors duration-200 hover:text-primary-600 ${
                  item.level === 2 ? 'text-foreground-700 font-medium' : 'text-foreground-500 pl-4'
                }`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}