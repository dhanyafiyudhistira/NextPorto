'use client';

import { useState } from 'react';
import AlarmPanel from '@/components/scada/AlarmPanel';
import { Filter, Download, Search } from 'lucide-react';

interface Event {
  id: string;
  timestamp: Date;
  type: string;
  description: string;
  asset?: string;
  user?: string;
  stateBefore?: any;
  stateAfter?: any;
}

export default function AlarmEventLogPage() {
  const [activeTab, setActiveTab] = useState<'alarms' | 'events' | 'audit'>('alarms');
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const [alarms, setAlarms] = useState([
    {
      id: '1',
      timestamp: new Date(),
      severity: 'CRITICAL' as const,
      title: 'High Line Loading',
      message: 'Feeder F-123 loading at 95% - curtailment recommended',
      asset: 'Feeder F-123',
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 300000),
      severity: 'WARNING' as const,
      title: 'Voltage Deviation',
      message: 'Bus voltage at 1.05 p.u. - approaching upper limit',
      asset: 'Bus B-456',
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 600000),
      severity: 'ALARM' as const,
      title: 'DER Communication Loss',
      message: 'Wind Turbine 2 - No response for 5 minutes',
      asset: 'Wind Turbine 2',
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 900000),
      severity: 'INFO' as const,
      title: 'Curtailment Applied',
      message: 'AI-recommended curtailment successfully applied to 3 DERs',
      asset: 'SCADA Server',
    },
  ]);

  const [events, setEvents] = useState<Event[]>([
    {
      id: 'e1',
      timestamp: new Date(Date.now() - 120000),
      type: 'COMMAND_EXECUTED',
      description: 'Curtailment command sent to Solar Farm A',
      asset: 'Solar Farm A',
      user: 'Admin',
      stateBefore: { curtailment: 15 },
      stateAfter: { curtailment: 20 },
    },
    {
      id: 'e2',
      timestamp: new Date(Date.now() - 240000),
      type: 'OPTIMIZATION_APPLIED',
      description: 'AI optimization completed and applied to field',
      user: 'System',
    },
    {
      id: 'e3',
      timestamp: new Date(Date.now() - 360000),
      type: 'DER_STATUS_CHANGE',
      description: 'BESS Unit 1 status changed from ONLINE to CURTAILED',
      asset: 'BESS Unit 1',
      stateBefore: { status: 'ONLINE', curtailment: 30 },
      stateAfter: { status: 'CURTAILED', curtailment: 50 },
    },
    {
      id: 'e4',
      timestamp: new Date(Date.now() - 480000),
      type: 'USER_LOGIN',
      description: 'User logged in to SCADA system',
      user: 'Admin',
    },
    {
      id: 'e5',
      timestamp: new Date(Date.now() - 600000),
      type: 'CONFIGURATION_CHANGE',
      description: 'RTU polling interval changed from 1000ms to 500ms',
      asset: 'RTU-01',
      user: 'Engineer',
      stateBefore: { pollInterval: 1000 },
      stateAfter: { pollInterval: 500 },
    },
  ]);

  const filteredAlarms = alarms.filter((alarm) => {
    const severityMatch = filterSeverity === 'ALL' || alarm.severity === filterSeverity;
    const searchMatch =
      searchTerm === '' ||
      alarm.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alarm.message.toLowerCase().includes(searchTerm.toLowerCase());
    return severityMatch && searchMatch;
  });

  const filteredEvents = events.filter((event) => {
    return (
      searchTerm === '' ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const exportLogs = () => {
    const data = activeTab === 'alarms' ? alarms : events;
    const csv = data
      .map((item) => {
        if ('severity' in item) {
          return `${item.timestamp.toISOString()},${item.severity},${item.title},"${item.message}",${item.asset || ''}`;
        } else {
          return `${item.timestamp.toISOString()},${item.type},"${item.description}",${item.asset || ''},${item.user || ''}`;
        }
      })
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}-log-${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-scada-cyan neon-text">
            Alarms & Event Log
          </h1>
          <p className="text-scada-blue/70 mt-1">
            Real-time alarms, system events, and audit trail
          </p>
        </div>

        <button onClick={exportLogs} className="scada-button flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-scada-blue/30">
        <button
          onClick={() => setActiveTab('alarms')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'alarms'
              ? 'text-scada-cyan border-b-2 border-scada-cyan'
              : 'text-scada-blue/70 hover:text-scada-blue'
          }`}
        >
          Active Alarms ({alarms.length})
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'events'
              ? 'text-scada-cyan border-b-2 border-scada-cyan'
              : 'text-scada-blue/70 hover:text-scada-blue'
          }`}
        >
          System Events
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'audit'
              ? 'text-scada-cyan border-b-2 border-scada-cyan'
              : 'text-scada-blue/70 hover:text-scada-blue'
          }`}
        >
          Audit Trail
        </button>
      </div>

      {/* Filters */}
      <div className="scada-panel">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-scada-blue/50" />
              <input
                type="text"
                placeholder="Search alarms or events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="scada-input w-full pl-10"
              />
            </div>
          </div>

          {/* Severity Filter (for alarms) */}
          {activeTab === 'alarms' && (
            <div>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="scada-input"
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">Critical</option>
                <option value="ALARM">Alarm</option>
                <option value="WARNING">Warning</option>
                <option value="INFO">Info</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'alarms' && (
        <AlarmPanel
          alarms={filteredAlarms}
          onAcknowledge={(id) => {
            setAlarms((prev) => prev.filter((a) => a.id !== id));
          }}
        />
      )}

      {activeTab === 'events' && (
        <div className="space-y-2">
          {filteredEvents.map((event) => (
            <div key={event.id} className="scada-panel">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="px-2 py-1 bg-scada-blue/20 border border-scada-blue rounded text-xs font-semibold text-scada-blue">
                      {event.type}
                    </span>
                    <span className="text-xs text-scada-blue/70">
                      {event.timestamp.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-scada-cyan mb-2">{event.description}</p>

                  <div className="flex flex-wrap gap-4 text-xs text-scada-blue/70">
                    {event.asset && <span>Asset: {event.asset}</span>}
                    {event.user && <span>User: {event.user}</span>}
                  </div>

                  {/* Before/After State */}
                  {event.stateBefore && event.stateAfter && (
                    <div className="mt-3 grid grid-cols-2 gap-4 p-3 bg-scada-darker rounded border border-scada-blue/20">
                      <div>
                        <div className="text-xs text-scada-blue/70 mb-1">Before</div>
                        <pre className="text-xs text-scada-blue">
                          {JSON.stringify(event.stateBefore, null, 2)}
                        </pre>
                      </div>
                      <div>
                        <div className="text-xs text-scada-blue/70 mb-1">After</div>
                        <pre className="text-xs text-scada-green">
                          {JSON.stringify(event.stateAfter, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="scada-panel">
          <table className="scada-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>Asset</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {events
                .filter((e) => e.user)
                .map((event) => (
                  <tr key={event.id}>
                    <td className="text-scada-blue/70">
                      {event.timestamp.toLocaleString()}
                    </td>
                    <td className="font-medium text-scada-cyan">{event.user}</td>
                    <td>
                      <span className="px-2 py-1 bg-scada-blue/20 rounded text-xs">
                        {event.type}
                      </span>
                    </td>
                    <td>{event.asset || '-'}</td>
                    <td className="text-sm">{event.description}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
