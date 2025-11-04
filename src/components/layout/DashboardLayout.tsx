import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
  userRole?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  userName,
  userEmail,
  userRole,
}) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole={userRole} />
      <div className="flex-1 flex flex-col">
        <Topbar userName={userName} userEmail={userEmail} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};
