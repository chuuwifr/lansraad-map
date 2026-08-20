import React from 'react';
import { HouseInfo } from '../../types/landsraad';

interface HouseSigilImageProps {
  house: HouseInfo;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showGlow?: boolean;
}

export const HouseSigilImage: React.FC<HouseSigilImageProps> = ({
  house,
  className = '',
  size = 'md',
  showGlow = true
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-sm',
    md: 'w-9 h-9 text-lg',
    lg: 'w-12 h-12 text-2xl',
    xl: 'w-16 h-16 text-3xl'
  }[size];

  if (house.customSigilUrl) {
    return (
      <div 
        className={`relative inline-flex items-center justify-center shrink-0 rounded-lg overflow-hidden border transition-all ${sizeClasses} ${className}`}
        style={{
          borderColor: house.accentColor || '#f59e0b',
          backgroundColor: `${house.color}25`,
          boxShadow: showGlow ? `0 0 14px ${house.accentColor}50` : 'none'
        }}
      >
        <img 
          src={house.customSigilUrl} 
          alt={`Blason ${house.name}`} 
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to text emoji on broken URL
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-lg border transition-all ${sizeClasses} ${className}`}
      style={{
        backgroundColor: `${house.color}20`,
        borderColor: house.accentColor,
        color: house.accentColor,
        boxShadow: showGlow ? `0 0 12px ${house.color}40` : 'none'
      }}
    >
      <span>{house.sigil}</span>
    </div>
  );
};
