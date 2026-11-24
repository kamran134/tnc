import { decodeHtmlEntities } from '@/lib/sanitize';

/**
 * Reduces an HTML fragment from the API to plain text (safe to render as a React text node).
 * Block-level closers become spaces so adjacent paragraphs do not glue together.
 */
export function htmlToText(html?: string | null): string {
  if (!html) return '';
  return decodeHtmlEntities(
    html
      .replace(/<\/(p|div|li|h[1-6])>/gi, ' ')
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<[^>]*>/g, '')
  )
    .replace(/\s+/g, ' ')
    .trim();
}
