'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  GitBranch,
  Zap,
  Database,
  Brain,
  AlertTriangle,
  Settings,
  Activity
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'One-Line Diagram', href: '/one-line', icon: GitBranch },
  { name: 'DER Control', href: '/der-control', icon: Zap },
  { name: 'Historian', href: '/historian', icon: Database },
  { name: 'AI Optimization', href: '/optimization', icon: Brain },
  { name: 'Alarms & Events', href: '/alarm-event-log', icon: AlertTriangle },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-scada-darker border-r border-scada-blue/30 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-scada-blue/30">
        <div className="flex items-center space-x-3">
          <Activity className="w-8 h-8 text-scada-cyan" />
          <div>
            <h1 className="text-xl font-bold text-scada-cyan neon-text">SCADA DER</h1>
            <p className="text-xs text-scada-blue/70">Active Power Curtailment</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-all
                ${isActive
                  ? 'bg-scada-blue/20 text-scada-cyan border border-scada-blue shadow-neon-sm'
                  : 'text-scada-blue/70 hover:bg-scada-blue/10 hover:text-scada-blue border border-transparent'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* System Status */}
      <div className="p-4 border-t border-scada-blue/30">
        <div className="scada-panel space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-scada-blue/70">System Status</span>
            <span className="status-online">ONLINE</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-scada-blue/70">RTU Connected</span>
            <span className="text-scada-green">3/3</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-scada-blue/70">Active Alarms</span>
            <span className="text-scada-yellow">2</span>
          </div>
        </div>
      </div>
    </div>
  );
}
