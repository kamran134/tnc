'use client';

import { IconOption } from '@/lib/icons/mission-vision-icons';
import { Check } from 'lucide-react';

interface IconSelectorProps {
  icons: IconOption[];
  selectedIcon: string | null | undefined;
  onSelect: (iconName: string) => void;
  label?: string;
}

export default function IconSelector({ icons, selectedIcon, onSelect, label }: IconSelectorProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="grid grid-cols-5 gap-2">
        {icons.map((iconOption) => {
          const Icon = iconOption.icon;
          const isSelected = selectedIcon === iconOption.name;
          
          return (
            <button
              key={iconOption.name}
              type="button"
              onClick={() => onSelect(iconOption.name)}
              className={`
                relative p-3 rounded-lg border-2 transition-all
                flex flex-col items-center justify-center gap-2
                hover:border-primary-500 hover:bg-primary-50
                ${isSelected 
                  ? 'border-primary-600 bg-primary-100 shadow-md' 
                  : 'border-gray-200 bg-white'
                }
              `}
              title={iconOption.label}
            >
              <Icon 
                className={`w-6 h-6 ${isSelected ? 'text-primary-600' : 'text-gray-600'}`}
              />
              <span className={`text-xs ${isSelected ? 'text-primary-700 font-medium' : 'text-gray-500'}`}>
                {iconOption.label}
              </span>
              {isSelected && (
                <div className="absolute top-1 right-1">
                  <Check className="w-4 h-4 text-primary-600" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
