const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tnc.az';

/**
 * Uploaded images are stored as root-relative paths (e.g. "/uploads/news_image/x.png")
 * served directly by nginx, not by the Next.js app. next/image's built-in optimizer can
 * only fetch remote images via an absolute URL matching next.config.js remotePatterns —
 * a bare relative path makes it try (and fail) to resolve the file from the app container
 * itself, which doesn't have access to /uploads. Resolve against the public site origin.
 */
export function resolveImageUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return `${siteUrl}${url.startsWith('/') ? url : `/${url}`}`;
}
