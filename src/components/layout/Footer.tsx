'use client';

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from '@/hooks/useTranslations'

export default function Footer() {
  const { t } = useTranslations();
  const currentYear = new Date().getFullYear()
  const params = useParams();
  const lang = (params.lang as string) || 'az';

  const services = [
    t('footer.services.accounting'),
    t('footer.services.taxCompliance'),
    t('footer.services.taxAdvisory'),
    t('footer.services.legal'),
    t('footer.services.hr')
  ]

  const quickLinks = [
    { name: t('nav.about'), href: `/${lang}/about` },
    { name: t('nav.services'), href: `/${lang}/services` },
    { name: t('nav.news'), href: `/${lang}/news` },
    { name: t('nav.careers'), href: `/${lang}/careers` },
    { name: t('nav.contact'), href: `/${lang}/contact` }
  ]

  return (
    <footer className="snap-start bg-gray-900 text-white flex items-center" style={{ minHeight: '100vh' }}>
      <div className="container-max section-padding w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">TnC</h3>
            <p className="text-gray-300 mb-4">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              {/* Social Media Icons */}
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.ourServices')}</h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service}>
                  <Link href={`/${lang}/services`} className="text-gray-300 hover:text-white transition-colors">
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-300 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.contactInfo')}</h4>
            <div className="space-y-2 text-gray-300">
              <p>{t('footer.location')}</p>
              <p>{t('footer.phone')}: +994 XX XXX XX XX</p>
              <p>{t('footer.email')}: info@tnc.az</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} TnC Tax & Consulting. {t('footer.allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  )
}
