"use client";

import { useState, useEffect } from "react";
import { Bell, User, Wifi, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [alarmCount, setAlarmCount] = useState(0);
  const [wsConnected, setWsConnected] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
      {/* Left side - System status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {wsConnected ? (
            <>
              <Wifi className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-400">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-5 h-5 text-red-400" />
              <span className="text-sm text-gray-400">Disconnected</span>
            </>
          )}
        </div>
        <div className="h-6 w-px bg-gray-700"></div>
        <div className="text-sm text-gray-400">
          {currentTime.toLocaleString()}
        </div>
      </div>

      {/* Right side - Alarms & User */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-gray-400" />
          {alarmCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {alarmCount}
            </Badge>
          )}
        </Button>

        <div className="h-6 w-px bg-gray-700"></div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center border border-neon-blue/50">
            <User className="w-5 h-5 text-neon-blue" />
          </div>
        </div>
      </div>
    </header>
  );
}
