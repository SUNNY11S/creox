import React from 'react';

interface CreoxLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animated?: boolean;
  variant?: 'full' | 'mark';
}

export const CreoxLogo: React.FC<CreoxLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  animated = false,
  variant = 'full',
}) => {
  // Height profiles for different contexts
  const sizeStyles = {
    sm: { h: 'h-8 sm:h-9', maxH: '36px' },
    md: { h: 'h-10 sm:h-12', maxH: '48px' },
    lg: { h: 'h-16 sm:h-20', maxH: '80px' },
    xl: { h: 'h-24 sm:h-32', maxH: '128px' },
  }[size];

  // Exact user-supplied CREOX logo asset
  const logoSrc = '/assets/aistudio/designarena_image_g2cosh3h_fb2693fb.png';

  return (
    <div
      className={`inline-flex items-center select-none relative group ${className}`}
    >
      {/* Animated ambient backdrop glow in radiant Cyan and Mint */}
      {animated && (
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-teal-400/25 to-emerald-400/25 rounded-full blur-xl animate-pulse pointer-events-none -z-10" />
      )}

      {/* Exact Logo Graphic */}
      <div className={`relative flex items-center justify-center overflow-hidden ${sizeStyles.h}`}>
        <img
          src={logoSrc}
          alt="CREOX Official Brand Identity"
          className={`${sizeStyles.h} w-auto object-contain transition-transform duration-300 group-hover:scale-105`}
          style={{
            mixBlendMode: 'screen', // Seamlessly eliminates black backdrop on dark surfaces
            filter: 'contrast(1.08) brightness(1.05)',
          }}
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
};
