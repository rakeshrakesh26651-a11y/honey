import React from 'react';

export interface AdminBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'honey' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const AdminBadge: React.FC<AdminBadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const variantStyles = {
    default: 'bg-[#F5F2EB] text-[#5A4F46] border-[#E2DBD0]',
    honey: 'bg-[#FAF3E8] text-[#9B6418] border-[#F0DFC4]',
    success: 'bg-[#F0FDF4] text-[#166534] border-[#DCFCE7]',
    warning: 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]',
    danger: 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]',
    info: 'bg-[#F8FAFC] text-[#334155] border-[#E2E8F0]',
  };

  const dotStyles = {
    default: 'bg-[#8C8075]',
    honey: 'bg-[#C9892E]',
    success: 'bg-[#16A34A]',
    warning: 'bg-[#D97706]',
    danger: 'bg-[#DC2626]',
    info: 'bg-[#0284C7]',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider',
    md: 'text-[11px] px-2.5 py-1 tracking-wide',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono uppercase font-semibold ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[variant]}`} />}
      <span>{children}</span>
    </span>
  );
};

export const AdminStatusBadge: React.FC<{
  status: string;
  size?: 'sm' | 'md';
}> = ({ status, size = 'md' }) => {
  const normalized = (status || '').toLowerCase();

  if (['active', 'delivered', 'paid', 'approved', 'in stock', 'online'].includes(normalized)) {
    return (
      <AdminBadge variant="success" size={size} dot>
        {status}
      </AdminBadge>
    );
  }

  if (['pending', 'processing', 'placed', 'packed', 'confirmed'].includes(normalized)) {
    return (
      <AdminBadge variant="honey" size={size} dot>
        {status}
      </AdminBadge>
    );
  }

  if (['low stock', 'limited', 'draft', 'moderating'].includes(normalized)) {
    return (
      <AdminBadge variant="warning" size={size} dot>
        {status}
      </AdminBadge>
    );
  }

  if (['inactive', 'cancelled', 'out of stock', 'rejected', 'failed'].includes(normalized)) {
    return (
      <AdminBadge variant="danger" size={size} dot>
        {status}
      </AdminBadge>
    );
  }

  return (
    <AdminBadge variant="default" size={size}>
      {status}
    </AdminBadge>
  );
};
