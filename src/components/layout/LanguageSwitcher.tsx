'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useRef, useEffect } from 'react';

const languages = [
  { code: 'az' as const, name: 'AZ', flag: 'AZ', flagEmoji: '🇦🇿' },
  { code: 'en' as const, name: 'EN', flag: 'GB', flagEmoji: '🇬🇧' },
  { code: 'ru' as const, name: 'RU', flag: 'RU', flagEmoji: '🇷🇺' },
];

// Flag component using circle-flags CDN
const FlagIcon = ({ code, className = "w-5 h-5" }: { code: string; className?: string }) => (
  <img
    src={`https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/${code.toLowerCase()}.svg`}
    alt={code}
    className={`${className} rounded-sm object-cover`}
    onError={(e) => {
      // Fallback to emoji if image fails to load
      e.currentTarget.style.display = 'none';
      e.currentTarget.nextElementSibling?.classList.remove('hidden');
    }}
  />
);

interface LanguageSwitcherProps {
  isTransparent?: boolean;
}

export default function LanguageSwitcher({ isTransparent = false }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find(lang => lang.code === locale) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
          isTransparent ? 'hover:bg-white/20' : 'hover:bg-gray-100'
        }`}
        aria-label="Change language"
      >
        <FlagIcon code={currentLang.flag} className="w-5 h-5" />
        <span className="text-lg hidden">{currentLang.flagEmoji}</span>
        <span className={`font-medium ${
          isTransparent ? 'text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]' : 'text-gray-700'
        }`}>{currentLang.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''} ${
            isTransparent ? 'text-white/80' : 'text-gray-500'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLocale(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors ${
                locale === lang.code ? 'bg-green-50 text-green-700' : 'text-gray-700'
              }`}
            >
              <FlagIcon code={lang.flag} className="w-5 h-5" />
              <span className="text-lg hidden">{lang.flagEmoji}</span>
              <span className="font-medium">{lang.name}</span>
              {locale === lang.code && (
                <svg className="w-4 h-4 ml-auto text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
