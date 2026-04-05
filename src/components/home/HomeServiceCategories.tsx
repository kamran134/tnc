'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useServiceCategories } from '@/hooks/queries';
import { getServiceCategoryIconByName } from '@/lib/icons/service-category-icons';

interface HomeServiceCategoriesProps {
  lang?: string;
}

export default function HomeServiceCategories({ lang = 'az' }: HomeServiceCategoriesProps) {
  const { data: categories = [] } = useServiceCategories(lang);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (categories.length === 0) return;
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [categories.length]);

  if (categories.length === 0) return null;

  const title =
    lang === 'az' ? 'Xidmətlərimiz' : lang === 'ru' ? 'Наши услуги' : 'Our Services';
  const subtitle =
    lang === 'az'
      ? 'Müştərilərimizə təqdim etdiyimiz peşəkar xidmət sahələri'
      : lang === 'ru'
      ? 'Профессиональные направления услуг для наших клиентов'
      : 'Professional service areas we provide to our clients';
  const allLabel =
    lang === 'az' ? 'Hamısına bax →' : lang === 'ru' ? 'Смотреть все →' : 'View all →';

  return (
    <section
      ref={sectionRef as any}
      className="snap-start section-padding bg-slate-900 flex items-center"
      style={{ minHeight: '100vh' }}
    >
      <div className="container-max w-full">
        {/* Header */}
        <div
          className={`mb-14 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* <p className="text-sky-400 text-sm font-semibold uppercase tracking-widest mb-3">
            {lang === 'az' ? 'Nə edirik' : lang === 'ru' ? 'Что мы делаем' : 'What we do'}
          </p> */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {title}
            </h2>
            <Link
              href={`/${lang}/services`}
              className="text-sky-400 hover:text-sky-300 text-sm font-medium transition-colors whitespace-nowrap"
            >
              {allLabel}
            </Link>
          </div>
          <p className="mt-4 text-slate-400 text-lg max-w-2xl">{subtitle}</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-700/50 rounded-2xl overflow-hidden">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/${lang}/services/${category.code}`}
              className={`group relative bg-slate-900 p-8 flex flex-col justify-between min-h-[180px] transition-all duration-700 hover:bg-slate-800 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              {/* Icon or Number */}
              {(() => {
                const Icon = getServiceCategoryIconByName(category.iconUrl);
                return Icon ? (
                  <Icon className="w-12 h-12 text-slate-700 group-hover:text-slate-600 transition-colors" strokeWidth={1.5} />
                ) : (
                  <span className="text-5xl font-black text-slate-700 group-hover:text-slate-600 transition-colors select-none leading-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                );
              })()}

              {/* Bottom content */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold text-lg leading-snug pr-4">
                    {category.name}
                  </h3>
                  {/* Arrow */}
                  <span className="text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all duration-300 text-xl flex-shrink-0">
                    →
                  </span>
                </div>
                {category.description && (
                  <p className="mt-2 text-slate-400 text-sm line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                )}
              </div>

              {/* Bottom accent line */}
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-sky-500 group-hover:w-full transition-all duration-500 rounded-bl-2xl" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
