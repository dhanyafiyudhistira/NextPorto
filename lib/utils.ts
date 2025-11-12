import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString();
}

export function formatNumber(num: number, decimals: number = 2): string {
  return num.toFixed(decimals);
}

export function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    INFO: "bg-blue-500",
    WARNING: "bg-yellow-500",
    CRITICAL: "bg-orange-500",
    EMERGENCY: "bg-red-500",
  };
  return colors[severity] || "bg-gray-500";
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    ONLINE: "text-green-400",
    OFFLINE: "text-gray-400",
    ALARM: "text-red-400",
    MAINTENANCE: "text-yellow-400",
    ERROR: "text-red-500",
    CURTAILED: "text-orange-400",
    FAULT: "text-red-600",
  };
  return colors[status] || "text-gray-400";
}
