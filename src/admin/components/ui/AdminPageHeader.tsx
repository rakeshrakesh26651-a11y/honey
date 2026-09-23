import React from 'react';

interface AdminPageHeaderProps {
  breadcrumb?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  breadcrumb,
  title,
  description,
  actions,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EBE6DD]">
      <div className="space-y-1">
        {breadcrumb && (
          <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#8C8075]">
            <span>{breadcrumb}</span>
          </div>
        )}
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#2C241E] tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="font-sans text-xs sm:text-sm text-[#73665C] max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2.5 flex-wrap flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};
