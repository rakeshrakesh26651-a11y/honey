import React from 'react';

interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const AdminSelect = React.forwardRef<HTMLSelectElement, AdminSelectProps>(
  ({ label, error, hint, children, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-[11px] font-mono uppercase tracking-wider text-[#73665C] font-medium"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border text-xs sm:text-sm text-[#2C241E] transition-all duration-150 outline-none appearance-none pr-9 focus:bg-white focus:border-[#C9892E] focus:ring-2 focus:ring-[#C9892E]/20 cursor-pointer disabled:bg-[#F2EFE9] disabled:text-[#8C8075] ${
              error ? 'border-[#E53E3E]' : 'border-[#E2DBD0]'
            } ${className}`}
            {...props}
          >
            {children}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#73665C]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
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

AdminSelect.displayName = 'AdminSelect';
