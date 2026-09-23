import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  currentPath,
  onNavigate,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C241E] font-sans flex selection:bg-[#FAF3E8] selection:text-[#9B6418]">
      {/* 1. Luméra Fixed & Responsive Sidebar */}
      <AdminSidebar
        currentPath={currentPath}
        onNavigate={onNavigate}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* 2. Main Administration Canvas */}
      <div className="flex-1 flex flex-col lg:pl-[260px] min-w-0">
        <AdminHeader
          currentPath={currentPath}
          onNavigate={onNavigate}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};
