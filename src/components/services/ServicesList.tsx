import Link from 'next/link'

export default function ServicesList() {
  const services = [
    {
      category: 'Accounting & Finance',
      description: 'Complete financial management and accounting solutions for your business',
      services: [
        'Financial Reporting & Analysis',
        'Bookkeeping Services',
        'Management Accounting',
        'Cash Flow Management',
        'Financial Planning & Budgeting'
      ],
      icon: (
        <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      category: 'Tax Compliance',
      description: 'Ensure full compliance with local and international tax regulations',
      services: [
        'Corporate Tax Returns',
        'Personal Income Tax',
        'VAT Management',
        'Withholding Tax',
        'Tax Registration & Licensing'
      ],
      icon: (
        <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      category: 'Tax Advisory',
      description: 'Strategic tax planning and optimization services',
      services: [
        'Tax Planning & Strategy',
        'International Tax Advisory',
        'Tax Risk Assessment',
        'Transfer Pricing',
        'Tax Due Diligence'
      ],
      icon: (
        <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      category: 'Legal Services',
      description: 'Comprehensive legal support for business operations and compliance',
      services: [
        'Corporate Law',
        'Contract Drafting & Review',
        'Employment Law',
        'Regulatory Compliance',
        'Dispute Resolution'
      ],
      icon: (
        <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      )
    },
    {
      category: 'HR Compliance',
      description: 'Human resources management and compliance solutions',
      services: [
        'Employment Contract Management',
        'Payroll Processing',
        'Labor Law Compliance',
        'Employee Benefits Administration',
        'HR Policy Development'
      ],
      icon: (
        <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ]

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-max">
        <div className="grid gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
            >
              <div className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
                  <div className="flex-shrink-0 mb-6 lg:mb-0">
                    <div className="w-20 h-20 bg-primary-100 rounded-lg flex items-center justify-center">
                      {service.icon}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {service.category}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {service.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {service.services.map((item, serviceIndex) => (
                        <div key={serviceIndex} className="flex items-center">
                          <svg className="w-5 h-5 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 mt-6 lg:mt-0">
                    <Link
                      href="/contact"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
                    >
                      Get Consultation
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need a Custom Solution?
            </h3>
            <p className="text-gray-600 mb-6">
              We understand that every business is unique. Contact us to discuss your specific requirements 
              and how we can tailor our services to meet your needs.
            </p>
            <Link
              href="/contact"
              className="btn-primary"
            >
              Contact Our Experts
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
