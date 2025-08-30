export default function Vision() {
  return (
    <section className="section-padding bg-primary-50">
      <div className="container-max">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Our Vision
          </h2>
          <div className="prose prose-lg mx-auto">
            <p className="text-xl text-gray-700 leading-relaxed">
              Our aspiration is to consistently deliver exceptional outcomes that go beyond client 
              expectations, contributing significant value to their businesses. We aim to establish 
              ourselves as a leading firm on both the national and regional stages, upholding the 
              highest standards of ethical integrity and expertise.
            </p>
          </div>
          <div className="mt-12 bg-white rounded-lg p-8 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Leading the Industry</h3>
                <p className="text-gray-600">
                  Establishing ourselves as the premier choice for tax and consulting services 
                  across Azerbaijan and the region.
                </p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
