import React from 'react';

/**
 * LaneTable - Display lane-level detector data
 */
const LaneTable = ({ lanes }) => {
  const getSpeedStatus = (speed) => {
    if (speed < 15) return 'text-alert-red';
    if (speed < 25) return 'text-alert-amber';
    return 'text-steel-100';
  };

  const getQueueStatus = (queue) => {
    if (queue > 15) return 'text-alert-red';
    if (queue > 8) return 'text-alert-amber';
    return 'text-steel-100';
  };

  return (
    <div className="border-2 border-steel-600 bg-steel-800">
      <div className="p-4 border-b border-steel-600">
        <h3 className="text-steel-300 font-mono text-sm uppercase">Lane-Level Detectors</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full font-mono text-sm">
          <thead>
            <tr className="border-b border-steel-700 bg-steel-900">
              <th className="text-left p-3 text-steel-400 font-medium">Lane ID</th>
              <th className="text-right p-3 text-steel-400 font-medium">Flow (veh/min)</th>
              <th className="text-right p-3 text-steel-400 font-medium">Queue (veh)</th>
              <th className="text-right p-3 text-steel-400 font-medium">Avg Speed (km/h)</th>
              <th className="text-center p-3 text-steel-400 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {lanes.map((lane, idx) => (
              <tr
                key={lane.id}
                className={`border-b border-steel-700 hover:bg-steel-700/50 transition-colors ${
                  idx % 2 === 0 ? 'bg-steel-800/50' : ''
                }`}
              >
                <td className="p-3 text-steel-100 font-medium">{lane.id.replace(/_/g, ' ')}</td>
                <td className="p-3 text-right text-steel-100">{lane.flow}</td>
                <td className={`p-3 text-right font-medium ${getQueueStatus(lane.queue)}`}>
                  {lane.queue}
                </td>
                <td className={`p-3 text-right font-medium ${getSpeedStatus(lane.avg_speed)}`}>
                  {lane.avg_speed.toFixed(1)}
                </td>
                <td className="p-3 text-center">
                  {lane.queue > 15 || lane.avg_speed < 15 ? (
                    <span className="inline-block px-2 py-1 text-xs bg-alert-red/20 text-alert-red border border-alert-red rounded">
                      CONGESTED
                    </span>
                  ) : lane.queue > 8 || lane.avg_speed < 25 ? (
                    <span className="inline-block px-2 py-1 text-xs bg-alert-amber/20 text-alert-amber border border-alert-amber rounded">
                      MODERATE
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-1 text-xs bg-steel-600/20 text-steel-400 border border-steel-600 rounded">
                      NORMAL
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {lanes.length === 0 && (
        <div className="p-8 text-center text-steel-500 font-mono">
          No lane data available
        </div>
      )}
    </div>
  );
};

export default LaneTable;
