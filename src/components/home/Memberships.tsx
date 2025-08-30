export default function Memberships() {
  const memberships = [
    {
      name: 'AmCham',
      fullName: 'American Chamber of Commerce',
      description: 'Member of the American Chamber of Commerce in Azerbaijan'
    },
    {
      name: 'Italian Azerbaijan Chamber',
      fullName: 'Italian Azerbaijan Chamber of Commerce',
      description: 'Active member promoting Italian-Azerbaijani business relations'
    },
    {
      name: 'BCCA',
      fullName: 'British Chamber of Commerce Azerbaijan',
      description: 'Member of the British Chamber of Commerce in Azerbaijan'
    }
  ]

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-max">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Professional Memberships
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are proud members of leading international business organizations, ensuring we stay connected 
            with global best practices and opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {memberships.map((membership, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {membership.name}
                </h3>
                <h4 className="text-sm text-primary-600 font-semibold mb-3">
                  {membership.fullName}
                </h4>
                <p className="text-gray-600">
                  {membership.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
