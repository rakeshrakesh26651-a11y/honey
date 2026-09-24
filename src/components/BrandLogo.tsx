import React from 'react';

export interface BrandLogoProps {
  className?: string;
  variant?: 'header' | 'mobile' | 'footer' | 'admin-sidebar' | 'admin-header' | 'admin-login' | 'admin-login-card' | 'inline';
}

/**
 * Official Himalayan Harvest Honey Logo
 * Uses the official uploaded brand asset (/images/himalayan_harvest_logo.png)
 * Preserves exact proportions (3:1 aspect ratio), responsive across mobile and desktop.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', variant = 'header' }) => {
  const logoSrc = '/images/himalayan_harvest_logo.png';

  if (variant === 'footer') {
    return (
      <div
        className={`inline-flex items-center rounded-xl bg-[#FDFAF3] px-3.5 py-1.5 sm:px-4 sm:py-2 border border-white/10 shadow-xs hover:border-[#C9892E]/40 transition-colors ${className}`}
        role="img"
        aria-label="Himalayan Harvest Honey Logo"
      >
        <img
          src={logoSrc}
          alt="Himalayan Harvest Honey"
          className="h-8 sm:h-9 md:h-10 w-auto object-contain block select-none pointer-events-none"
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  if (variant === 'admin-sidebar') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <img
          src={logoSrc}
          alt="Himalayan Harvest Honey"
          className="h-9 sm:h-10 w-auto max-w-[200px] object-contain block select-none"
          loading="eager"
          decoding="async"
        />
      </div>
    );
  }

  if (variant === 'admin-header') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <img
          src={logoSrc}
          alt="Himalayan Harvest Honey"
          className="h-7 sm:h-8 w-auto object-contain block select-none"
          loading="eager"
          decoding="async"
        />
      </div>
    );
  }

  if (variant === 'admin-login-card') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <img
          src={logoSrc}
          alt="Himalayan Harvest Honey"
          className="h-12 sm:h-14 md:h-16 w-auto object-contain block select-none"
          loading="eager"
          decoding="async"
        />
      </div>
    );
  }

  if (variant === 'admin-login') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <img
          src={logoSrc}
          alt="Himalayan Harvest Honey"
          className="h-8 sm:h-9 w-auto object-contain block select-none"
          loading="eager"
          decoding="async"
        />
      </div>
    );
  }

  if (variant === 'mobile') {
    return (
      <div
        className={`inline-flex items-center ${className}`}
        role="img"
        aria-label="Himalayan Harvest Honey Logo"
      >
        <img
          src={logoSrc}
          alt="Himalayan Harvest Honey"
          className="h-[34px] xs:h-[36px] sm:h-[38px] w-auto object-contain block select-none"
          loading="eager"
          decoding="async"
        />
      </div>
    );
  }

  // Default: header (desktop, tablet, mobile) and inline
  return (
    <div
      className={`inline-flex items-center ${className}`}
      role="img"
      aria-label="Himalayan Harvest Honey Logo"
    >
      <img
        src={logoSrc}
        alt="Himalayan Harvest Honey"
        className="h-[34px] xs:h-[36px] sm:h-[40px] md:h-[44px] w-auto object-contain block select-none"
        loading="eager"
        decoding="async"
      />
    </div>
  );
};
