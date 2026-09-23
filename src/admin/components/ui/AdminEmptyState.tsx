import React from 'react';
import { AdminCard } from './AdminCard';

interface AdminEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const AdminEmptyState: React.FC<AdminEmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <AdminCard className="text-center py-12 px-6 flex flex-col items-center justify-center space-y-4">
      {icon ? (
        <div className="w-14 h-14 rounded-2xl bg-[#FAF8F5] border border-[#EBE6DD] flex items-center justify-center text-[#C9892E] shadow-2xs">
          {icon}
        </div>
      ) : (
        <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#EBE6DD] flex items-center justify-center text-[#C9892E]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
      )}

      <div className="max-w-md space-y-1.5">
        <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#2C241E]">
          {title}
        </h3>
        <p className="font-sans text-xs sm:text-sm text-[#73665C] leading-relaxed">
          {description}
        </p>
      </div>

      {action && <div className="pt-2">{action}</div>}
    </AdminCard>
  );
};
