import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  color?: string;
}

export default function MetricCard({ title, value, icon: Icon, trend, color = "neon-blue" }: MetricCardProps) {
  const colorClasses: Record<string, string> = {
    "neon-blue": "text-neon-blue",
    "neon-cyan": "text-neon-cyan",
    green: "text-green-400",
    yellow: "text-yellow-400",
    orange: "text-orange-400",
    red: "text-red-400",
  };

  return (
    <Card className="metric-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-400 mb-1">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {trend && (
              <p className={cn("text-xs mt-1", trend.startsWith("+") ? "text-green-400" : "text-red-400")}>
                {trend}
              </p>
            )}
          </div>
          <div className={cn("p-3 rounded-lg bg-gray-800", colorClasses[color])}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
