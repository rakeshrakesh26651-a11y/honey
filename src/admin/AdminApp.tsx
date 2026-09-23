import React from 'react';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AdminAuthGuard } from './components/AdminAuthGuard';
import { AdminLayout } from './components/AdminLayout';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminProductsPage } from './pages/AdminProductsPage';
import { AdminOrdersPage } from './pages/AdminOrdersPage';
import { AdminInventoryPage } from './pages/AdminInventoryPage';
import { AdminCustomersPage } from './pages/AdminCustomersPage';
import { AdminReviewsPage } from './pages/AdminReviewsPage';
import { AdminCouponsPage } from './pages/AdminCouponsPage';
import { AdminShippingPage } from './pages/AdminShippingPage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';

interface AdminAppProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const AdminApp: React.FC<AdminAppProps> = ({ currentPath, onNavigate }) => {
  // Public Login route (No Guard)
  if (currentPath === '/admin/login' || currentPath.startsWith('/admin/login')) {
    return (
      <AdminAuthProvider>
        <AdminLoginPage onNavigate={onNavigate} />
      </AdminAuthProvider>
    );
  }

  // Helper router for admin sub-routes
  const renderAdminSubRoute = () => {
    if (currentPath === '/admin') {
      return <AdminDashboardPage onNavigate={onNavigate} />;
    }

    if (currentPath.startsWith('/admin/orders')) {
      return <AdminOrdersPage onNavigate={onNavigate} />;
    }

    if (currentPath.startsWith('/admin/products')) {
      return <AdminProductsPage onNavigate={onNavigate} />;
    }

    if (currentPath.startsWith('/admin/inventory')) {
      return <AdminInventoryPage />;
    }

    if (currentPath.startsWith('/admin/customers')) {
      return <AdminCustomersPage />;
    }

    if (currentPath.startsWith('/admin/reviews')) {
      return <AdminReviewsPage />;
    }

    if (currentPath.startsWith('/admin/coupons')) {
      return <AdminCouponsPage />;
    }

    if (currentPath.startsWith('/admin/shipping')) {
      return <AdminShippingPage />;
    }

    if (currentPath.startsWith('/admin/settings')) {
      return <AdminSettingsPage />;
    }

    // Default fallback
    return <AdminDashboardPage onNavigate={onNavigate} />;
  };

  return (
    <AdminAuthProvider>
      <AdminAuthGuard onNavigate={onNavigate} currentPath={currentPath}>
        <AdminLayout currentPath={currentPath} onNavigate={onNavigate}>
          {renderAdminSubRoute()}
        </AdminLayout>
      </AdminAuthGuard>
    </AdminAuthProvider>
  );
};
