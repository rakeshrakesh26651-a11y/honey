import React, { useState } from 'react';

interface CustomerAvatarProps {
  name: string;
  image?: string;
  className?: string;
  size?: number;
}

/**
 * Editorial Customer Avatar
 * Supports customer portrait images with graceful fallback to luxury monogram insignia.
 */
export const CustomerAvatar: React.FC<CustomerAvatarProps> = ({
  name,
  image,
  className = '',
  size = 48,
}) => {
  const [imgError, setImgError] = useState(false);

  // Extract initials (e.g. "Kavitha R." -> "KR", "Tarun Naik" -> "TN", "Ravi" -> "R")
  const parts = name.trim().split(/\s+/);
  const initials = parts.length > 1
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : (name.slice(0, 2) || 'HH').toUpperCase();

  // Deterministic subtle tint variant based on name
  const colorIndex = name.length % 3;
  const palettes = [
    { bg: 'bg-[#242424]', text: 'text-[#DDAA55]', ring: 'border-[#C9892E]/30' },
    { bg: 'bg-[#242424]', text: 'text-[#FAF9F5]', ring: 'border-[#242424]/40' },
    { bg: 'bg-[#242424]', text: 'text-[#C9892E]', ring: 'border-[#DDAA55]/30' },
  ];
  const activePalette = palettes[colorIndex];

  if (image && !imgError) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`relative rounded-full overflow-hidden border border-[#C9892E]/40 shadow-xs flex-shrink-0 select-none bg-[#FAF9F5] ${className}`}
      >
        <img
          src={image}
          alt={`Portrait of ${name}`}
          className="w-full h-full object-cover object-center"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative rounded-full ${activePalette.bg} flex items-center justify-center border ${activePalette.ring} shadow-xs flex-shrink-0 select-none ${className}`}
      aria-hidden="true"
    >
      <span className={`font-serif text-[14px] font-bold tracking-wider ${activePalette.text}`}>
        {initials}
      </span>
      {/* Subtle gold botanical honeycomb icon accent */}
      <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#FAF9F5] border border-[#D9D7D0] flex items-center justify-center shadow-2xs">
        <svg className="w-2.5 h-2.5 text-[#C9892E]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" />
        </svg>
      </span>
    </div>
  );
};
