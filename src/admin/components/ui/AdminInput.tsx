import React from 'react';

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const AdminInput = React.forwardRef<HTMLInputElement, AdminInputProps>(
  ({ label, error, hint, icon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[11px] font-mono uppercase tracking-wider text-[#73665C] font-medium"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 text-[#9E9287] pointer-events-none flex items-center">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border text-xs sm:text-sm text-[#2C241E] placeholder-[#9E9287] transition-all duration-150 outline-none focus:bg-white focus:border-[#C9892E] focus:ring-2 focus:ring-[#C9892E]/20 disabled:bg-[#F2EFE9] disabled:text-[#8C8075] ${
              icon ? 'pl-9' : ''
            } ${
              error ? 'border-[#E53E3E] focus:border-[#E53E3E] focus:ring-[#E53E3E]/20' : 'border-[#E2DBD0]'
            } ${className}`}
            {...props}
          />
        </div>
        {hint && !error && (
          <p className="text-[11px] text-[#8C8075] font-sans">{hint}</p>
        )}
        {error && (
          <p className="text-[11px] text-[#C53030] font-medium font-sans flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
      </div>
    );
  }
);

AdminInput.displayName = 'AdminInput';
