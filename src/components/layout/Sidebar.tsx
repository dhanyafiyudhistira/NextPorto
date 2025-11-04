'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Products', href: '/products', icon: '📦', adminOnly: true },
  { label: 'Customers', href: '/customers', icon: '👥', adminOnly: true },
  { label: 'Suppliers', href: '/suppliers', icon: '🏭', adminOnly: true },
  { label: 'Orders', href: '/orders', icon: '🛒' },
  { label: 'Purchases', href: '/purchases', icon: '🛍️', adminOnly: true },
];

interface SidebarProps {
  userRole?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const pathname = usePathname();
  const isAdmin = userRole === 'ADMIN';

  const filteredItems = navItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-primary-600">ERP System</h1>
        <p className="text-sm text-gray-500 mt-1">NextJS + SWC</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
        <p>Role: <span className="font-semibold">{userRole || 'USER'}</span></p>
      </div>
    </aside>
  );
};
