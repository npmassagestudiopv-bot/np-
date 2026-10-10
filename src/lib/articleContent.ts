import DOMPurify from 'isomorphic-dompurify';

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.nodeName === 'A' && node.getAttribute('target') === '_blank') {
    node.setAttribute('rel', `${node.getAttribute('rel') || ''} noopener noreferrer`.trim());
  }
});

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]!);
}

export function headingId(value: string): string {
  return value.toLowerCase().trim().replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s+/g, '-');
}

// Keep existing article formatting and links; sanitize before rendering stored
// content. Restrict to article markup, excluding embeds, styles and handlers.
export function articleContentToHtml(content: string): string {
  const parts: string[] = [];
  let paragraph = false;
  const closeParagraph = () => {
    if (paragraph) parts.push('</p>');
    paragraph = false;
  };
  for (const line of content.split('\n')) {
    const heading = line.match(/^(#{2,3})\s+(.+)$/);
    if (heading) {
      closeParagraph();
      const level = heading[1].length;
      const text = heading[2].trim();
      const size = level === 2 ? 'text-xl md:text-2xl mt-10' : 'text-lg md:text-xl mt-8';
      parts.push(`<h${level} id="${escapeHtml(headingId(text))}" class="font-heading ${size} font-semibold text-foreground-950 mb-4 scroll-mt-24">${escapeHtml(text)}</h${level}>`);
    } else if (!line.trim()) {
      closeParagraph();
    } else {
      parts.push(paragraph ? '<br/>' : '<p class="mb-4 leading-relaxed">');
      paragraph = true;
      parts.push(line);
    }
  }
  closeParagraph();
  return DOMPurify.sanitize(parts.join(''), {
    ALLOWED_TAGS: ['p', 'br', 'h2', 'h3', 'strong', 'b', 'em', 'i', 'a', 'ul', 'ol', 'li', 'blockquote'],
    ALLOWED_ATTR: ['id', 'class', 'href', 'title', 'rel', 'target'],
    ALLOW_DATA_ATTR: false,
  });
}
