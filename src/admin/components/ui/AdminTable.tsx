import React from 'react';

interface AdminTableProps {
  children: React.ReactNode;
  className?: string;
}

export const AdminTable: React.FC<AdminTableProps> = ({ children, className = '' }) => {
  return (
    <div className={`w-full overflow-hidden rounded-2xl border border-[#EBE6DD] bg-white shadow-[0_2px_12px_rgba(44,36,30,0.03)] ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">{children}</table>
      </div>
    </div>
  );
};

export const AdminTableHead: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <thead>
      <tr className={`border-b border-[#EBE6DD] bg-[#FAF8F5] text-[10.5px] font-mono uppercase tracking-wider text-[#73665C] ${className}`}>
        {children}
      </tr>
    </thead>
  );
};

export const AdminTableBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <tbody className={`divide-y divide-[#EBE6DD] font-sans text-xs text-[#2C241E] ${className}`}>{children}</tbody>;
};

export const AdminTableRow: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ children, onClick, className = '' }) => {
  return (
    <tr
      onClick={onClick}
      className={`hover:bg-[#FAF8F5]/80 transition-colors duration-150 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </tr>
  );
};

export const AdminTableCell: React.FC<{
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}> = ({ children, align = 'left', className = '' }) => {
  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return <td className={`py-4 px-4 sm:px-5 ${alignStyles[align]} ${className}`}>{children}</td>;
};

export const AdminTableHeaderCell: React.FC<{
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}> = ({ children, align = 'left', className = '' }) => {
  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <th className={`py-3.5 px-4 sm:px-5 font-semibold ${alignStyles[align]} ${className}`}>
      {children}
    </th>
  );
};
