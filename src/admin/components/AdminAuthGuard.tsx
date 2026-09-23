import React, { useEffect } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';

interface AdminAuthGuardProps {
  children: React.ReactNode;
  onNavigate: (path: string) => void;
  currentPath: string;
}

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({
  children,
  onNavigate,
  currentPath,
}) => {
  const { adminUser, isAdmin, loading } = useAdminAuth();

  useEffect(() => {
    if (!loading) {
      if ((!adminUser || !isAdmin) && !currentPath.startsWith('/admin/login')) {
        // Redirect to /admin/login with redirect back parameter
        const redirectParam = encodeURIComponent(currentPath);
        onNavigate(`/admin/login?redirect=${redirectParam}`);
      }
    }
  }, [loading, adminUser, isAdmin, currentPath, onNavigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#242424] text-[#FAF9F5] flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-2 border-[#C9892E] border-t-transparent rounded-full animate-spin" />
          <div className="text-center">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#C9892E] block mb-1">
              HIMALAYAN HARVEST HONEY
            </span>
            <p className="font-sans text-[14px] text-[#FAF9F5]/70">
              Verifying administrative cryptographic credentials...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!adminUser || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#242424] text-[#FAF9F5] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#1C1C1C] border border-red-500/30 rounded-2xl p-8 text-center space-y-5">
          <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-400 mx-auto flex items-center justify-center text-2xl font-bold">
            🛡️
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-red-400 block mb-1">
              403 FORBIDDEN
            </span>
            <h2 className="font-serif text-2xl font-semibold text-[#FAF9F5]">
              Administrative Privileges Required
            </h2>
            <p className="font-sans text-[13px] text-[#FAF9F5]/60 mt-2">
              Your account lacks the verified <code className="text-[#C9892E]">admin: true</code> custom claim required to access the Himalayan Harvest Honey control panel.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/admin/login')}
            className="w-full py-3 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-sm font-bold transition-all cursor-pointer"
          >
            Go to Admin Sign In
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
