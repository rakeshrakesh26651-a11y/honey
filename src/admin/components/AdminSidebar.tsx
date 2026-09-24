import React from 'react';
import { AdminIcons } from './ui/AdminIcons';
import { BrandLogo } from '../../components/BrandLogo';

interface NavItem {
  label: string;
  path: string;
  icon: (props: { className?: string }) => React.ReactElement;
  badge?: string;
}

interface AdminSidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentPath,
  onNavigate,
  isOpen,
  onClose,
}) => {
  const navSections: Array<{ title: string; items: NavItem[] }> = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', path: '/admin', icon: AdminIcons.Dashboard },
      ],
    },
    {
      title: 'STORE',
      items: [
        { label: 'Products', path: '/admin/products', icon: AdminIcons.Products },
        { label: 'Orders', path: '/admin/orders', icon: AdminIcons.Orders },
        { label: 'Inventory', path: '/admin/inventory', icon: AdminIcons.Inventory },
      ],
    },
    {
      title: 'CUSTOMERS',
      items: [
        { label: 'Customers', path: '/admin/customers', icon: AdminIcons.Customers },
        { label: 'Reviews', path: '/admin/reviews', icon: AdminIcons.Reviews },
      ],
    },
    {
      title: 'MARKETING',
      items: [
        { label: 'Coupons', path: '/admin/coupons', icon: AdminIcons.Coupons },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        { label: 'Shipping & Delivery', path: '/admin/shipping', icon: AdminIcons.Shipping },
      ],
    },
    {
      title: 'SETTINGS',
      items: [
        { label: 'Store Settings', path: '/admin/settings', icon: AdminIcons.Settings },
      ],
    },
  ];

  const handleItemClick = (path: string) => {
    onNavigate(path);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-[#1A1613]/50 z-40 lg:hidden backdrop-blur-xs transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[260px] bg-[#FAF8F5] border-r border-[#EBE6DD] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#EBE6DD]">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigate('/admin')}
              className="text-left group cursor-pointer"
            >
              <BrandLogo variant="admin-sidebar" />
              <div className="flex items-center gap-1.5 mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9892E]" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#C9892E] font-bold">
                  Admin Console
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-[#73665C] hover:text-[#2C241E] hover:bg-[#EBE6DD]/60 cursor-pointer"
              aria-label="Close menu"
            >
              <AdminIcons.Close className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <span className="px-3 text-[10px] font-mono tracking-widest uppercase text-[#9E9287] font-semibold block mb-2">
                {section.title}
              </span>

              {section.items.map((item) => {
                const isActive =
                  item.path === '/admin'
                    ? currentPath === '/admin'
                    : currentPath.startsWith(item.path);

                const Icon = item.icon;

                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => handleItemClick(item.path)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-sans text-[13px] font-medium transition-all duration-150 cursor-pointer text-left ${
                      isActive
                        ? 'bg-[#FAF3E8] text-[#2C241E] font-semibold shadow-2xs relative'
                        : 'text-[#5A4F46] hover:text-[#2C241E] hover:bg-[#F2EFE9]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-[#C9892E]' : 'text-[#8C8075]'}>
                        <Icon className="w-4 h-4" />
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9892E]" />
                    )}

                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#FAF8F5] border border-[#E2DBD0] text-[#73665C]">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Storefront Redirection Link */}
        <div className="p-4 border-t border-[#EBE6DD] bg-[#FAF8F5]">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="w-full py-2.5 px-3 rounded-xl bg-white border border-[#E2DBD0] hover:border-[#C9892E]/40 hover:bg-[#FAF8F5] text-[#5A4F46] hover:text-[#2C241E] font-sans text-xs flex items-center justify-between transition-all cursor-pointer shadow-2xs"
          >
            <span className="font-medium">View Storefront</span>
            <AdminIcons.ExternalLink className="w-3.5 h-3.5 text-[#C9892E]" />
          </button>
        </div>
      </aside>
    </>
  );
};
