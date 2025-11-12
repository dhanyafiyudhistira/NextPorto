"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GitBranch,
  Zap,
  Database,
  Brain,
  AlertTriangle,
  Settings,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "One-Line Diagram", href: "/one-line", icon: GitBranch },
  { name: "DER Control", href: "/der-control", icon: Zap },
  { name: "Historian", href: "/historian", icon: Database },
  { name: "Optimization", href: "/optimization", icon: Brain },
  { name: "Alarms & Events", href: "/alarms", icon: AlertTriangle },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Users", href: "/users", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-neon-blue neon-pulse">
          DER SCADA
        </h1>
        <p className="text-xs text-gray-400 mt-1">Active Power Curtailment</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                isActive
                  ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/50 shadow-lg shadow-neon-blue/20"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="status-indicator status-online"></div>
          <span>System Online</span>
        </div>
        <p className="text-xs text-gray-600 mt-2">v1.0.0</p>
      </div>
    </div>
  );
}
