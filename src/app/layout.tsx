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

export const metadata: Metadata = {
  title: 'TnC Tax & Consulting - Professional Tax and Legal Services',
  description: 'Professional tax, legal, and consulting services for businesses and individuals. Expert guidance with integrity and excellence.',
  keywords: 'tax consulting, legal services, accounting, finance, Azerbaijan, professional services',
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
