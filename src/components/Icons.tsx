import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

export const OilDropIcon: React.FC<IconProps> = ({ className = '', size = 14, color = 'currentColor' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M 15 12 C 15 5.25 7.5 0 7.5 0 C 7.5 0 0 5.25 0 12 C 0 16.142 3.358 19.5 7.5 19.5 C 11.642 19.5 15 16.142 15 12 Z"
      fill="transparent"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(4.5 1.5)"
    />
    <path
      d="M 0 3.75 C 1.875 3.434 3.432 1.875 3.75 0"
      fill="transparent"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(12.75 14.25)"
    />
  </svg>
);

export const CartIcon: React.FC<IconProps> = ({ className = '', size = 20, color = 'currentColor' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M 0.75 15 C 0.336 15 0 14.664 0 14.25 L 0 0.75 C 0 0.336 0.336 0 0.75 0 L 17.25 0 C 17.664 0 18 0.336 18 0.75 L 18 14.25 C 18 14.664 17.664 15 17.25 15 Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(3 4.5)"
    />
    <path
      d="M 7.5 0 C 7.5 2.071 5.821 3.75 3.75 3.75 C 1.679 3.75 0 2.071 0 0"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(8.25 8.25)"
    />
  </svg>
);

export const MenuIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M 0 0 L 16.5 0"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(3.75 6)"
    />
    <path
      d="M 0 0 L 16.5 0"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(3.75 12)"
    />
    <path
      d="M 0 0 L 16.5 0"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(3.75 18)"
    />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ className = '', size = 24, color = 'currentColor' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M 4 4 L 20 20 M 20 4 L 4 20"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SingleOriginIcon: React.FC<IconProps> = ({ className = '', size = 26, color = 'currentColor' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M 0 3 C 0 1.343 1.343 0 3 0 C 4.657 0 6 1.343 6 3 C 6 4.657 4.657 6 3 6 C 1.343 6 0 4.657 0 3 Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(9 6.75)"
    />
    <path
      d="M 15 7.5 C 15 14.25 7.5 19.5 7.5 19.5 C 7.5 19.5 0 14.25 0 7.5 C 0 3.358 3.358 0 7.5 0 C 11.642 0 15 3.358 15 7.5 Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(4.5 2.25)"
    />
  </svg>
);

export const LeafIcon: React.FC<IconProps> = ({ className = '', size = 26, color = 'currentColor' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M 1.482 14.268 C -3.008 6.786 2.982 -0.696 15.698 0.052 C 16.446 12.772 8.964 18.758 1.482 14.268 Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(4.5 3.75)"
    />
    <path
      d="M 11.25 0 L 0 11.25"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(3.75 9)"
    />
  </svg>
);

export const RecyclableIcon: React.FC<IconProps> = ({ className = '', size = 26, color = 'currentColor' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M 2.25 4.5 L 0 2.25 L 2.25 0"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(12 17.25)"
    />
    <path
      d="M 3.897 0 L 3.073 3.074 L 0 2.25"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(14.349 7.049)"
    />
    <path
      d="M 3.897 3.072 L 3.072 0 L 0 0.822"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(3.505 10.125)"
    />
    <path
      d="M 4.326 0 L 0.201 7.125 C -0.067 7.589 -0.067 8.16 0.201 8.624 C 0.468 9.088 0.963 9.374 1.498 9.375 L 5.998 9.375"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(2.252 10.125)"
    />
    <path
      d="M 0 6 L 8.25 6 C 8.786 5.999 9.28 5.713 9.548 5.249 C 9.815 4.785 9.815 4.214 9.547 3.75 L 7.378 0"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(12 13.5)"
    />
    <path
      d="M 8.891 7.874 L 4.766 0.749 C 4.498 0.285 4.003 0 3.468 0 C 2.932 0 2.437 0.285 2.169 0.749 L 0 4.499"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(8.531 2.251)"
    />
  </svg>
);

export const QuoteIcon: React.FC<IconProps> = ({ className = '', size = 32, color = 'currentColor' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M 7.125 7.5 L 0.75 7.5 C 0.336 7.5 0 7.164 0 6.75 L 0 0.75 C 0 0.336 0.336 0 0.75 0 L 6.375 0 C 6.789 0 7.125 0.336 7.125 0.75 L 7.125 9 C 7.125 11.071 5.446 12.75 3.375 12.75"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(3 6)"
    />
    <path
      d="M 7.125 7.5 L 0.75 7.5 C 0.336 7.5 0 7.164 0 6.75 L 0 0.75 C 0 0.336 0.336 0 0.75 0 L 6.375 0 C 6.789 0 7.125 0.336 7.125 0.75 L 7.125 9 C 7.125 11.071 5.446 12.75 3.375 12.75"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(13.875 6)"
    />
  </svg>
);

export const InstagramIcon: React.FC<IconProps> = ({ className = '', size = 22, color = 'currentColor' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M 4.5 18 C 2.015 18 0 15.985 0 13.5 L 0 4.5 C 0 2.015 2.015 0 4.5 0 L 13.5 0 C 15.985 0 18 2.015 18 4.5 L 18 13.5 C 18 15.985 15.985 18 13.5 18 Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(3 3)"
    />
    <path
      d="M 0 3.75 C 0 1.679 1.679 0 3.75 0 C 5.821 0 7.5 1.679 7.5 3.75 C 7.5 5.821 5.821 7.5 3.75 7.5 C 1.679 7.5 0 5.821 0 3.75 Z"
      stroke={color}
      strokeWidth="1.5"
      transform="translate(8.25 8.25)"
    />
    <path
      d="M 0 1.125 C 0 0.504 0.504 0 1.125 0 C 1.746 0 2.25 0.504 2.25 1.125 C 2.25 1.746 1.746 2.25 1.125 2.25 C 0.504 2.25 0 1.746 0 1.125 Z"
      fill={color}
      transform="translate(15.75 6)"
    />
  </svg>
);

export const TikTokIcon: React.FC<IconProps> = ({ className = '', size = 22, color = 'currentColor' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M 12.75 7.313 C 14.279 8.413 16.116 9.004 18 9 L 18 5.25 C 15.101 5.25 12.75 2.899 12.75 0 L 9 0 L 9 12.375 C 8.999 13.675 8.047 14.78 6.76 14.97 C 5.474 15.161 4.242 14.382 3.863 13.137 C 3.485 11.893 4.075 10.56 5.25 10.002 L 5.25 6 C 2.266 6.532 0 9.238 0 12.375 C 0 15.896 2.854 18.75 6.375 18.75 C 9.896 18.75 12.75 15.896 12.75 12.375 Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(3 2.25)"
    />
  </svg>
);

export const XIcon: React.FC<IconProps> = ({ className = '', size = 22, color = 'currentColor' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M 0 0 L 4.5 0 L 15 16.5 L 10.5 16.5 Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(4.5 3.75)"
    />
    <path
      d="M 6.176 0 L 0 6.794"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(4.5 13.456)"
    />
    <path
      d="M 6.176 0 L 0 6.794"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(13.324 3.75)"
    />
  </svg>
);
