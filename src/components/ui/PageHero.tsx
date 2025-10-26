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
    ? 'bg-gradient-to-r from-sky-400 to-sky-500' 
    : 'bg-primary-600';

  return (
    <section className={`${bgClass} text-white section-padding`}>
      <div className="container-max">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-primary-100">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
