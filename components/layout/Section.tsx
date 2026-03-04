import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: ReactNode;
  className?: string;
  background?: 'cream' | 'white' | 'teal' | 'cream-dark' | 'charcoal' | 'transparent';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  id?: string;
}

const paddingMap = {
  sm: 'px-4 md:px-6 py-8 md:py-12',
  md: 'px-4 md:px-8 py-12 md:py-20',
  lg: 'px-4 md:px-8 py-16 md:py-32',
  xl: 'px-4 md:px-8 py-24 md:py-40',
};

const backgroundMap = {
  cream: 'bg-cream',
  white: 'bg-white',
  teal: 'bg-teal-dark',
  'cream-dark': 'bg-cream-dark',
  charcoal: 'bg-charcoal',
  transparent: 'bg-transparent',
};

/**
 * Section Component
 * Standardized spacing and background container for page sections
 * Provides consistent horizontal and vertical padding
 */
export const Section: React.FC<SectionProps> = ({
  children,
  className,
  background = 'cream',
  padding = 'md',
  id,
}) => {
  return (
    <section
      id={id}
      className={cn(
        'w-full',
        paddingMap[padding],
        backgroundMap[background],
        className
      )}
    >
      <div className="max-w-container mx-auto w-full">
        {children}
      </div>
    </section>
  );
};

export default Section;
