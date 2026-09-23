import React from 'react';

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export const AdminButton: React.FC<AdminButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-sans font-medium tracking-wide transition-all duration-150 rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none focus:outline-none focus:ring-2 focus:ring-[#C9892E]/30';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-[13px] px-4 py-2 gap-2',
    lg: 'text-sm px-5 py-2.5 gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-[#C9892E] text-white hover:bg-[#B37722] active:bg-[#9B6418] shadow-xs font-semibold',
    secondary:
      'bg-[#F5F2EB] text-[#2C241E] border border-[#E2DBD0] hover:bg-[#EDE8DE] hover:border-[#D5CBBC]',
    outline:
      'bg-transparent text-[#2C241E] border border-[#DDD6CB] hover:bg-[#FAF8F5] hover:border-[#C5BCAD]',
    ghost:
      'bg-transparent text-[#5A4F46] hover:text-[#2C241E] hover:bg-[#F5F2EB]',
    danger:
      'bg-[#FFF5F5] text-[#C53030] border border-[#FED7D7] hover:bg-[#FEEBC8]/20 hover:border-[#E53E3E]',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon && <span className="flex-shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};
