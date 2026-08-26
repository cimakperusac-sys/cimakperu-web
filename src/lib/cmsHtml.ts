export function cmsHtml(value?: string | null): string {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (/<[a-z][\s\S]*>/i.test(raw)) return raw;
  return raw.replace(/\n/g, '<br/>');
}

/** Títulos: Quill guarda Enter como </p><p>; lo compactamos a <br> como en Figma. */
export function cmsTitleHtml(value?: string | null): string {
  let html = cmsHtml(value);
  if (!html) return '';

  html = html
    .replace(/<p><br\s*\/?><\/p>/gi, '<br>')
    .replace(/<\/p>\s*<p>/gi, '<br>')
    .replace(/^<p>/i, '')
    .replace(/<\/p>$/i, '');

  return html;
}

export function cmsPlain(value?: string | null): string {
  return String(value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
