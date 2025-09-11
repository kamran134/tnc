import Link from 'next/link'

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-sky-400 to-sky-700 text-white section-padding">
      <div className="container-max">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Professional Tax & Consulting Services
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            Delivering excellence with integrity. Expert guidance for your business growth and compliance needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/services"
              className="bg-white text-primary-700 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Our Services
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-primary-700 transition-colors duration-200"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
