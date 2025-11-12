"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users as UsersIcon, UserPlus, Shield } from "lucide-react";

export default function UsersPage() {
  const mockUsers = [
    { id: "1", username: "admin", email: "admin@scada.local", role: "ADMIN", isActive: true },
    { id: "2", username: "engineer", email: "engineer@scada.local", role: "ENGINEER", isActive: true },
    { id: "3", username: "operator", email: "operator@scada.local", role: "OPERATOR", isActive: true },
  ];

  const roleColors: Record<string, string> = {
    ADMIN: "destructive",
    ENGINEER: "warning",
    OPERATOR: "info",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="text-gray-400 mt-1">Manage system users and roles</p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-neon-blue" />
            System Users
          </CardTitle>
          <CardDescription>View and manage user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockUsers.map((user) => (
              <div key={user.id} className="scada-panel p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-neon-blue/20 flex items-center justify-center border border-neon-blue/50">
                    <Shield className="w-6 h-6 text-neon-blue" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{user.username}</p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={roleColors[user.role] as any}>{user.role}</Badge>
                  <Badge variant={user.isActive ? "success" : "secondary"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Administrator</CardTitle>
            <CardDescription>Full system access</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• All permissions</li>
              <li>• User management</li>
              <li>• System configuration</li>
              <li>• Command execution</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engineer</CardTitle>
            <CardDescription>Control and configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• DER control</li>
              <li>• Run optimization</li>
              <li>• Command execution</li>
              <li>• View all data</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operator</CardTitle>
            <CardDescription>Monitoring only</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• View dashboards</li>
              <li>• Acknowledge alarms</li>
              <li>• View historian data</li>
              <li>• No control actions</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
