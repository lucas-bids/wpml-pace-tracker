import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'default' | 'dark' | 'accent' | 'glass';
}

export function Card({
  title,
  children,
  variant = 'default'
}: CardProps) {
  const variants = {
    default: 'bg-white rounded-2xl shadow-sm border border-gray-100',
    dark: 'bg-gray-900 text-white rounded-2xl shadow-md',
    accent: 'bg-blue-600 text-white rounded-2xl shadow-md',
    glass: 'bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border border-gray-100'
  };
  const headerVariants = {
    default: 'px-6 py-5 border-b border-gray-100',
    dark: 'px-6 py-5 border-b border-gray-800',
    accent: 'px-6 py-5 border-b border-blue-700',
    glass: 'px-6 py-5 border-b border-gray-100'
  };
  const titleVariants = {
    default: 'text-xl font-bold text-gray-800',
    dark: 'text-xl font-bold text-white',
    accent: 'text-xl font-bold text-white',
    glass: 'text-xl font-bold text-gray-800'
  };
  return <div className={`overflow-hidden ${variants[variant]}`}>
      {title && <div className={headerVariants[variant]}>
          <h2 className={titleVariants[variant]}>{title}</h2>
        </div>}
      <div className="p-6">{children}</div>
    </div>;
}