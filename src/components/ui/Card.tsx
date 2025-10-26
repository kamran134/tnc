import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({ 
  children, 
  className = '', 
  hover = false,
  padding = 'md' 
}: CardProps) {
  const hoverClass = hover ? 'hover:shadow-lg transition-shadow duration-200' : '';
  
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-8',
    lg: 'p-12'
  };

  return (
    <div className={`bg-white rounded-lg shadow-md ${hoverClass} ${paddingStyles[padding]} ${className}`}>
      {children}
    </div>
  );
}
