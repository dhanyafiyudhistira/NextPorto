'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';

interface TopbarProps {
  userName?: string;
  userEmail?: string;
}

export const Topbar: React.FC<TopbarProps> = ({ userName, userEmail }) => {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/login' });
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Welcome, {userName || 'User'}
          </h2>
          <p className="text-sm text-gray-500">{userEmail}</p>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};
