import React from 'react';

interface AdminCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'tonal' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const AdminCard: React.FC<AdminCardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white border-[#EBE6DD] shadow-[0_2px_12px_rgba(44,36,30,0.03)]',
    tonal: 'bg-[#F9F7F2] border-[#E8E2D7] shadow-none',
    interactive:
      'bg-white border-[#EBE6DD] shadow-[0_2px_12px_rgba(44,36,30,0.03)] hover:border-[#D5C9B8] hover:shadow-[0_4px_20px_rgba(44,36,30,0.06)] transition-all duration-200 cursor-pointer',
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div
      className={`rounded-2xl border ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
