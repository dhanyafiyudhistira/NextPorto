"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, Save, Database, Wifi, Server } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Configure SCADA system parameters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SCADA Server Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5 text-neon-blue" />
              SCADA Server
            </CardTitle>
            <CardDescription>Configure SCADA server connection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scada-host">Server Host</Label>
              <Input id="scada-host" defaultValue="localhost" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scada-port">Server Port</Label>
              <Input id="scada-port" type="number" defaultValue="3000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ws-port">WebSocket Port</Label>
              <Input id="ws-port" type="number" defaultValue="3001" />
            </div>
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-neon-blue" />
              Database
            </CardTitle>
            <CardDescription>PostgreSQL + TimescaleDB configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="db-host">Database Host</Label>
              <Input id="db-host" defaultValue="localhost" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="db-port">Database Port</Label>
              <Input id="db-port" type="number" defaultValue="5432" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="db-name">Database Name</Label>
              <Input id="db-name" defaultValue="der_scada" />
            </div>
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
          </CardContent>
        </Card>

        {/* MQTT Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="w-5 h-5 text-neon-blue" />
              MQTT Broker
            </CardTitle>
            <CardDescription>MQTT communication configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mqtt-url">Broker URL</Label>
              <Input id="mqtt-url" defaultValue="mqtt://localhost:1883" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mqtt-user">Username</Label>
              <Input id="mqtt-user" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mqtt-pass">Password</Label>
              <Input id="mqtt-pass" type="password" />
            </div>
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
          </CardContent>
        </Card>

        {/* OPC UA Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-neon-blue" />
              OPC UA
            </CardTitle>
            <CardDescription>OPC UA server configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="opcua-endpoint">Endpoint URL</Label>
              <Input id="opcua-endpoint" defaultValue="opc.tcp://localhost:4840" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="opcua-security">Security Policy</Label>
              <Input id="opcua-security" defaultValue="None" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="opcua-mode">Security Mode</Label>
              <Input id="opcua-mode" defaultValue="None" />
            </div>
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
