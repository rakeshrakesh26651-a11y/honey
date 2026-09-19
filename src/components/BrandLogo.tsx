import React from 'react';

interface BrandLogoProps {
  className?: string;
  variant?: 'header' | 'mobile' | 'footer' | 'inline';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', variant = 'header' }) => {
  if (variant === 'footer') {
    return (
      <div className={`flex items-center space-x-3 select-none ${className}`}>
        <svg
          viewBox="0 0 28 28"
          className="w-7 h-7 sm:w-8 sm:h-8 text-[#DDAA55] flex-shrink-0"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M14 2.5L2.5 21.5H25.5L14 2.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M14 10.5L8 21.5H20L14 10.5Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <circle cx="14" cy="16.5" r="1.5" fill="currentColor" />
        </svg>
        <span className="font-serif text-[22px] sm:text-[28px] md:text-[32px] font-medium tracking-[-0.02em] text-[#FAF9F5] leading-none whitespace-nowrap">
          HIMALAYAN HARVEST HONEY
        </span>
      </div>
    );
  }

  if (variant === 'mobile') {
    return (
      <div className={`flex items-center space-x-2 select-none ${className}`}>
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 text-[#242424] flex-shrink-0"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M12 2L2 19H22L12 2Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M12 9L7 19H17L12 9Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="14.5" r="1.2" fill="#C9892E" />
        </svg>
        <span className="font-serif text-[17px] sm:text-[19px] font-semibold tracking-[-0.01em] text-[#242424] whitespace-nowrap leading-none">
          HIMALAYAN HARVEST HONEY
        </span>
      </div>
    );
  }

  // Header / Default variant
  return (
    <div className={`flex items-center space-x-2 sm:space-x-2.5 select-none ${className}`}>
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5 sm:w-6 sm:h-6 text-[#242424] flex-shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M12 2L2 19H22L12 2Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M12 9L7 19H17L12 9Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="14.5" r="1.2" fill="#C9892E" />
      </svg>
      <span className="font-serif text-[16px] xs:text-[18px] sm:text-[21px] font-semibold tracking-[-0.01em] text-[#242424] whitespace-nowrap leading-none">
        HIMALAYAN HARVEST HONEY
      </span>
    </div>
  );
};
