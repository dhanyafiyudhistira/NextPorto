'use client';

import { Bell, User, LogOut } from 'lucide-react';

export default function Header() {
  const currentTime = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  });

  return (
    <header className="h-16 bg-scada-darker border-b border-scada-blue/30 flex items-center justify-between px-6">
      {/* Left section */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-scada-green rounded-full animate-pulse"></div>
          <span className="text-sm text-scada-blue/70">Live Data</span>
        </div>
        <div className="text-sm text-scada-blue/70">
          {currentTime}
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-scada-blue/10 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-scada-blue" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-scada-red rounded-full"></span>
        </button>

        {/* User menu */}
        <div className="flex items-center space-x-3 px-3 py-2 bg-scada-blue/10 rounded-lg border border-scada-blue/30">
          <User className="w-5 h-5 text-scada-cyan" />
          <div className="text-sm">
            <div className="font-medium text-scada-cyan">Admin</div>
            <div className="text-xs text-scada-blue/70">Engineer</div>
          </div>
        </div>

        {/* Logout */}
        <button className="p-2 hover:bg-scada-red/10 rounded-lg transition-colors group">
          <LogOut className="w-5 h-5 text-scada-blue group-hover:text-scada-red" />
        </button>
      </div>
    </header>
  );
}
