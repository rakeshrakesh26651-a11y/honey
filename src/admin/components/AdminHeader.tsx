import React from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { AdminIcons } from './ui/AdminIcons';
import { BrandLogo } from '../../components/BrandLogo';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleSidebar,
  currentPath,
  onNavigate,
}) => {
  const { adminUser, logoutAdmin } = useAdminAuth();

  const getPageInfo = (path: string): { title: string; breadcrumb: string } => {
    if (path === '/admin') return { title: 'Dashboard', breadcrumb: 'Overview / Dashboard' };
    if (path.startsWith('/admin/products')) return { title: 'Products', breadcrumb: 'Store / Products' };
    if (path.startsWith('/admin/orders')) return { title: 'Orders', breadcrumb: 'Store / Orders' };
    if (path.startsWith('/admin/inventory')) return { title: 'Inventory', breadcrumb: 'Store / Inventory' };
    if (path.startsWith('/admin/customers')) return { title: 'Customers', breadcrumb: 'Customers / Directory' };
    if (path.startsWith('/admin/reviews')) return { title: 'Reviews', breadcrumb: 'Customers / Reviews' };
    if (path.startsWith('/admin/coupons')) return { title: 'Coupons', breadcrumb: 'Marketing / Coupons' };
    if (path.startsWith('/admin/shipping')) return { title: 'Shipping & Delivery', breadcrumb: 'Operations / Shipping' };
    if (path.startsWith('/admin/settings')) return { title: 'Store Settings', breadcrumb: 'Settings / General' };
    return { title: 'Administration', breadcrumb: 'Admin' };
  };

  const pageInfo = getPageInfo(currentPath);
  const email = adminUser?.email || 'rakesh@himalayanharvest.com';
  const displayName = email.split('@')[0];
  const capitalizedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleSignOut = async () => {
    await logoutAdmin();
    onNavigate('/admin/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EBE6DD] px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-colors">
      {/* Left: Mobile Toggle + Breadcrumb & Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-[#73665C] hover:text-[#2C241E] hover:bg-[#F2EFE9] transition-colors cursor-pointer"
          aria-label="Toggle navigation drawer"
        >
          <AdminIcons.Menu className="w-5 h-5" />
        </button>

        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => onNavigate('/admin')}
            className="cursor-pointer flex items-center"
            aria-label="Admin Dashboard"
          >
            <BrandLogo variant="admin-header" />
          </button>
        </div>

        <div className="hidden lg:block space-y-0.5">
          <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#9E9287]">
            <span>{pageInfo.breadcrumb}</span>
          </div>
          <h2 className="font-serif text-lg sm:text-xl font-semibold text-[#2C241E] leading-none">
            {pageInfo.title}
          </h2>
        </div>
      </div>

      {/* Right: Search, Notifications, Admin Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Minimal Search Bar */}
        <div className="hidden md:flex items-center relative w-56 lg:w-64">
          <input
            type="text"
            placeholder="Search store..."
            className="w-full pl-8 pr-3 py-1.5 rounded-full bg-white border border-[#E2DBD0] text-xs text-[#2C241E] placeholder-[#9E9287] outline-none focus:border-[#C9892E] focus:ring-1 focus:ring-[#C9892E] transition-all"
          />
          <AdminIcons.Search className="w-3.5 h-3.5 text-[#9E9287] absolute left-2.5 pointer-events-none" />
        </div>

        {/* Notifications Icon */}
        <button
          type="button"
          className="p-2 rounded-xl text-[#73665C] hover:text-[#2C241E] hover:bg-[#F2EFE9] transition-colors cursor-pointer relative"
          aria-label="Notifications"
        >
          <AdminIcons.Bell className="w-4 h-4" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9892E] absolute top-2 right-2" />
        </button>

        <div className="h-6 w-[1px] bg-[#EBE6DD] hidden sm:block" />

        {/* Admin Profile Pill */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="w-8 h-8 rounded-full bg-[#FAF3E8] border border-[#F0DFC4] text-[#9B6418] flex items-center justify-center font-serif text-xs font-bold flex-shrink-0">
            {initials}
          </div>

          <div className="hidden sm:block text-left leading-tight">
            <span className="block font-sans text-xs font-semibold text-[#2C241E] truncate max-w-[120px]">
              {capitalizedName}
            </span>
            <span className="block font-mono text-[9px] uppercase tracking-widest text-[#C9892E] font-bold">
              SUPERADMIN
            </span>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            title="Sign out of Admin Console"
            className="p-1.5 rounded-xl text-[#8C8075] hover:text-[#C53030] hover:bg-[#FFF5F5] transition-colors cursor-pointer ml-1"
          >
            <AdminIcons.Logout className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
