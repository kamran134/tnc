import { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tnc.az'

export const metadata: Metadata = {
  title: 'News & Updates | TnC Tax & Consulting',
  description: 'Latest news, updates, and insights from TnC Tax & Consulting. Stay informed about tax, legal, and business developments in Azerbaijan.',
  openGraph: {
    title: 'News & Updates | TnC Tax & Consulting',
    description: 'Latest news, updates, and insights from TnC Tax & Consulting.',
    url: `${siteUrl}/news`,
    images: [{ url: `${siteUrl}/og-image.svg`, width: 1200, height: 630 }],
  },
  twitter: {
    title: 'News & Updates | TnC Tax & Consulting',
    description: 'Latest news, updates, and insights from TnC Tax & Consulting.',
    images: [`${siteUrl}/og-image.svg`],
  },
}

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
