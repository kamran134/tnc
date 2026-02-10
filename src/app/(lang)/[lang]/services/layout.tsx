import { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tnc.az'

export const metadata: Metadata = {
  title: 'Our Services | TnC Tax & Consulting',
  description: 'Comprehensive tax, legal, accounting, and consulting services for businesses and individuals. Professional solutions tailored to your needs.',
  openGraph: {
    title: 'Our Services | TnC Tax & Consulting',
    description: 'Comprehensive tax, legal, accounting, and consulting services.',
    url: `${siteUrl}/services`,
    images: [{ url: `${siteUrl}/og-image.svg`, width: 1200, height: 630 }],
  },
  twitter: {
    title: 'Our Services | TnC Tax & Consulting',
    description: 'Comprehensive tax, legal, accounting, and consulting services.',
    images: [`${siteUrl}/og-image.svg`],
  },
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
