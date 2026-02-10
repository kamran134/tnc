import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { QueryProvider } from '@/lib/providers/QueryProvider'

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tnc.az'

export const metadata: Metadata = {
  title: 'TnC Tax & Consulting - Professional Tax and Legal Services',
  description: 'Professional tax, legal, and consulting services for businesses and individuals. Expert guidance with integrity and excellence.',
  keywords: 'tax consulting, legal services, accounting, finance, Azerbaijan, professional services, TnC',
  authors: [{ name: 'TnC Tax & Consulting' }],
  metadataBase: new URL(siteUrl),
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'TnC Tax & Consulting',
    title: 'TnC Tax & Consulting - Professional Tax and Legal Services',
    description: 'Professional tax, legal, and consulting services for businesses and individuals. Expert guidance with integrity and excellence.',
    images: [
      {
        url: `${siteUrl}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: 'TnC Tax & Consulting - Professional Services',
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'TnC Tax & Consulting - Professional Tax and Legal Services',
    description: 'Professional tax, legal, and consulting services for businesses and individuals. Expert guidance with integrity and excellence.',
    images: [`${siteUrl}/og-image.svg`],
  },
  
  // Additional metadata
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Verification (add these when you have them)
  // verification: {
  //   google: 'your-google-site-verification',
  //   yandex: 'your-yandex-verification',
  // },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} font-sans antialiased`}>
        <QueryProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
