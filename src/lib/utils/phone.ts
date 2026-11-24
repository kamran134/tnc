/**
 * Formats an Azerbaijani phone number for display: "+994501234567" -> "+994 50 123 45 67".
 * Anything that is not a 12-digit +994 number is returned trimmed and unchanged.
 * Keep the raw digits for tel: hrefs (see phoneHref).
 */
export function formatPhone(raw?: string | null): string {
  if (!raw) return '';
  const trimmed = raw.trim();
  const digits = trimmed.replace(/[\s()\-.]/g, '');
  const match = /^\+994(\d{2})(\d{3})(\d{2})(\d{2})$/.exec(digits);
  if (!match) return trimmed;
  return `+994 ${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
}

/** Raw phone value suitable for a tel: href (digits and leading plus only). */
export function phoneHref(raw?: string | null): string {
  if (!raw) return '';
  return `tel:${raw.trim().replace(/[^\d+]/g, '')}`;
}
