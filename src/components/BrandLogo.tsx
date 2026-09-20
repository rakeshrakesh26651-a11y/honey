import React from 'react';

interface BrandLogoProps {
  className?: string;
  variant?: 'header' | 'mobile' | 'footer' | 'inline';
}

/**
 * Premium Himalayan Harvest Honey Logo — Header & Brand Mark
 * Artisanal vector emblem featuring:
 * - Himalayan mountain silhouette with faceted peaks & snow ridges
 * - Distinct artisanal honeybee detail
 * - Minimal honeycomb geometric lattice & honey drop
 * - Rich gold (#C9892E, #DDAA55) + dark charcoal (#242424) palette
 * - Editorial serif typography for HIMALAYAN and refined sub-lettering for HARVEST HONEY
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', variant = 'header' }) => {
  const isFooter = variant === 'footer';

  return (
    <div
      className={`inline-flex items-center space-x-2.5 sm:space-x-3 select-none ${className}`}
      role="img"
      aria-label="Himalayan Harvest Honey Logo"
    >
      {/* Artisanal Vector Emblem */}
      <svg
        viewBox="0 0 54 54"
        className={`flex-shrink-0 transition-transform duration-300 ${
          isFooter
            ? 'w-10 h-10 sm:w-12 sm:h-12'
            : 'w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] md:w-[42px] md:h-[42px]'
        }`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* Rich Metallic Honey Gold Gradient */}
          <linearGradient id="hhGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F7DF94" />
            <stop offset="30%" stopColor="#E0A745" />
            <stop offset="70%" stopColor="#C9892E" />
            <stop offset="100%" stopColor="#9E6415" />
          </linearGradient>

          {/* Charcoal Facet Gradient */}
          <linearGradient id="hhCharcoalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3A3A36" />
            <stop offset="100%" stopColor="#1E1E1C" />
          </linearGradient>

          {/* Amber Honey Droplet */}
          <linearGradient id="hhHoneyDrop" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFC83B" />
            <stop offset="100%" stopColor="#D98218" />
          </linearGradient>

          {/* Soft Crest Fill */}
          <radialGradient id="hhCrestBg" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={isFooter ? '#252522' : '#FFFDF9'} />
            <stop offset="100%" stopColor={isFooter ? '#1A1A17' : '#F7F3EB'} />
          </radialGradient>
        </defs>

        {/* 1. Outer Heritage Crest Shield */}
        <path
          d="M 11 8 C 21 4, 33 4, 43 8 C 47 10, 48.5 13.5, 48.5 18.5 L 48.5 32.5 C 48.5 41.5, 27 49, 27 49 C 27 49, 5.5 41.5, 5.5 32.5 L 5.5 18.5 C 5.5 13.5, 7 10, 11 8 Z"
          fill="url(#hhCrestBg)"
          stroke="url(#hhGoldGrad)"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />

        {/* Inner Filigree Hairline Border */}
        <path
          d="M 12.8 10 C 21.8 6.8, 32.2 6.8, 41.2 10 C 44.5 11.5, 45.8 14.5, 45.8 19 L 45.8 31 C 45.8 38.5, 27 45.5, 27 45.5 C 27 45.5, 8.2 38.5, 8.2 31 L 8.2 19 C 8.2 14.5, 9.5 11.5, 12.8 10 Z"
          fill="none"
          stroke="url(#hhGoldGrad)"
          strokeWidth="0.65"
          strokeOpacity="0.6"
        />

        {/* 2. Minimal Honeycomb Lattice Base (3 connected hexagon cells) */}
        <g stroke="url(#hhGoldGrad)" strokeWidth="0.9" fill="#C9892E" fillOpacity={isFooter ? '0.22' : '0.14'}>
          {/* Left Hex */}
          <polygon points="17.5,37 21,35 24.5,37 24.5,41 21,43 17.5,41" />
          {/* Center Hex */}
          <polygon points="23.5,40.5 27,38.5 30.5,40.5 30.5,44.5 27,46.5 23.5,44.5" />
          {/* Right Hex */}
          <polygon points="29.5,37 33,35 36.5,37 36.5,41 33,43 29.5,41" />
        </g>

        {/* 3. Himalayan Mountain Range Silhouette */}
        {/* Left Sub-Peak */}
        <path
          d="M 16.5 20.5 L 7.5 35.5 L 17.5 35.5 Z"
          fill={isFooter ? '#181816' : '#2D2D2A'}
        />
        <path
          d="M 16.5 20.5 L 17.5 35.5 L 24 35.5 Z"
          fill="url(#hhGoldGrad)"
          fillOpacity="0.8"
        />
        <path
          d="M 16.5 20.5 L 14 25.5 L 16.5 24.5 L 19 26.5 Z"
          fill={isFooter ? '#FAF8F5' : '#FFFFFF'}
        />

        {/* Right Sub-Peak */}
        <path
          d="M 37.5 19 L 30 35.5 L 38.5 35.5 Z"
          fill={isFooter ? '#181816' : '#2D2D2A'}
        />
        <path
          d="M 37.5 19 L 38.5 35.5 L 46.5 35.5 Z"
          fill="url(#hhGoldGrad)"
          fillOpacity="0.8"
        />
        <path
          d="M 37.5 19 L 35 24.5 L 37.5 23.5 L 41 26 Z"
          fill={isFooter ? '#FAF8F5' : '#FFFFFF'}
        />

        {/* Center Main Himalayan Summit */}
        <path
          d="M 27 12 L 13.5 35.5 L 27 35.5 Z"
          fill="url(#hhCharcoalGrad)"
        />
        <path
          d="M 27 12 L 27 35.5 L 40.5 35.5 Z"
          fill={isFooter ? '#3A3834' : '#45423E'}
        />
        {/* Center Ridge Line */}
        <path
          d="M 27 12 L 24.8 20.5 L 27 25 L 25.8 35.5"
          stroke="url(#hhGoldGrad)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        {/* Crisp Snow Cap */}
        <path
          d="M 27 12 L 22.5 19.5 L 25 18.5 L 27 21 L 29 19 L 31.5 20.5 Z"
          fill={isFooter ? '#FAF8F5' : '#FFFFFF'}
        />

        {/* Honey Droplet at Mountain Base */}
        <path
          d="M 27 39.5 C 27 39.5, 25.3 42, 25.3 43.3 C 25.3 44.4, 26.1 45.2, 27 45.2 C 27.9 45.2, 28.7 44.4, 28.7 43.3 C 28.7 42, 27 39.5, 27 39.5 Z"
          fill="url(#hhHoneyDrop)"
        />

        {/* 4. Artisanal Honeybee Detail (Hovering gracefully at Upper Crest) */}
        <g transform="translate(37, 10.5) rotate(-16)">
          {/* Translucent Wings */}
          <path
            d="M 0 0 C 2 -7, 8.5 -6, 6 1 Z"
            fill="#FFFFFF"
            fillOpacity="0.9"
            stroke="url(#hhGoldGrad)"
            strokeWidth="0.75"
          />
          <path
            d="M 2.5 1 C 5.5 -4, 10.5 -3, 8 2.2 Z"
            fill="#FFFFFF"
            fillOpacity="0.78"
            stroke="url(#hhGoldGrad)"
            strokeWidth="0.65"
          />

          {/* Golden Striped Body */}
          <ellipse cx="0" cy="2.5" rx="3.6" ry="2.4" fill="url(#hhGoldGrad)" />
          {/* Charcoal Stripes */}
          <path
            d="M -1.5 0.6 Q 0 1.5 1.5 0.6 L 1.7 1.7 Q 0 2.6 -1.7 1.7 Z"
            fill="#20201E"
          />
          <path
            d="M -2.1 2.5 Q 0 3.4 2.1 2.5 L 1.8 3.5 Q 0 4.4 -1.8 3.5 Z"
            fill="#20201E"
          />
          {/* Tiny Stinger */}
          <polygon points="0,5.1 -0.7,4.5 0.7,4.5" fill="#20201E" />

          {/* Bee Head */}
          <circle cx="0" cy="-0.5" r="1.5" fill="#20201E" />
          {/* Antennae */}
          <path
            d="M -0.5 -1.6 Q -1.5 -3.2 -2.6 -3 M 0.5 -1.6 Q 1.5 -3.2 2.6 -3"
            stroke="#20201E"
            strokeWidth="0.7"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </svg>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center">
        {/* Main Brand Name — Editorial Serif */}
        <span
          className={`font-serif uppercase tracking-[0.14em] sm:tracking-[0.16em] md:tracking-[0.18em] font-semibold leading-[1.06] ${
            isFooter
              ? 'text-[#FAF8F5] text-[18px] sm:text-[21px] md:text-[23px]'
              : 'text-[#242424] text-[15px] xs:text-[16.5px] sm:text-[18px] md:text-[19px]'
          }`}
        >
          Himalayan
        </span>

        {/* Secondary Subtitle — Refined Lettering */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 mt-[2px]">
          <span
            className={`font-sans uppercase tracking-[0.24em] sm:tracking-[0.28em] md:tracking-[0.32em] font-semibold leading-none ${
              isFooter
                ? 'text-[#DDAA55] text-[8.5px] sm:text-[9.5px] md:text-[10px]'
                : 'text-[#C9892E] text-[7.5px] xs:text-[8px] sm:text-[8.5px] md:text-[9.5px]'
            }`}
          >
            Harvest Honey
          </span>
        </div>
      </div>
    </div>
  );
};
