'use client';

import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function Hero() {
  const params = useParams();
  const lang = (params.lang as string) || 'az';

  return (
    <section className="relative bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 text-white flex items-center justify-center overflow-hidden" style={{ height: 'calc(100vh - 73px)' }}>
      <div className="container-max relative z-20">
        <div className="text-center max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-5xl font-bold mb-12">
            Professional Tax & Consulting Services
          </h1>
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xl md:text-2xl mb-12 text-primary-100">
              Delivering excellence with integrity. Expert guidance for your business growth and compliance needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href={`/${lang}/services`}
                className="bg-white text-primary-700 font-semibold py-4 px-10 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-lg"
              >
                Our Services
              </Link>
              <Link
                href={`/${lang}/contact`}
                className="border-2 border-white text-white font-semibold py-4 px-10 rounded-lg hover:bg-white hover:text-primary-700 transition-colors duration-200 text-lg"
              >
                Get in Touch
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}
