interface PageHeroProps {
  title: string;
  description: string;
  variant?: 'gradient' | 'solid';
}

export default function PageHero({ 
  title, 
  description,
  variant = 'gradient' 
}: PageHeroProps) {
  const bgClass = variant === 'gradient' 
    ? 'bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50' 
    : 'bg-gradient-to-r from-sky-100 to-blue-100';

  return (
    <section className={`${bgClass} section-padding`}>
      <div className="container-max">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-700">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
