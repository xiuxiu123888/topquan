import React from 'react';
import logoUrl from '../assets/images/logo.png';

interface TopQuantLogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'color';
  layout?: 'horizontal' | 'vertical';
  showText?: boolean;
}

export const TopQuantLogo: React.FC<TopQuantLogoProps> = ({
  className = 'h-16',
  variant = 'color',
}) => {
  const onDark = variant === 'light';

  return (
    <img
      src={logoUrl}
      alt="冠量科技 TOP QUANT"
      className={`w-auto object-contain select-none ${
        onDark ? 'bg-white rounded-md px-1.5 py-0.5' : ''
      } ${className}`}
    />
  );
};
