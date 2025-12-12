import React from 'react';
import { formatDistance } from 'date-fns';

/**
 * Timeline - Horizontal Gantt-style phase strip
 * Shows predicted phases (dashed) appearing before actual phases (solid)
 */
const Timeline = ({ timeseries }) => {
  if (!timeseries || timeseries.length === 0) {
    return (
      <div className="border-2 border-steel-600 bg-steel-800 p-6 text-center text-steel-400">
        No timeline data available
      </div>
    );
  }

  // Get time range
  const allTimestamps = timeseries.flatMap(d => [
    new Date(d.timestamp_predicted),
    new Date(d.timestamp_actual)
  ]);
  const minTime = Math.min(...allTimestamps.map(t => t.getTime()));
  const maxTime = Math.max(...allTimestamps.map(t => t.getTime()));
  const timeRange = maxTime - minTime || 1;

  // Get unique phases for legend
  const phases = [...new Set(timeseries.flatMap(d => [
    d.actual.phase_id,
    d.predicted.phase_id
  ]))];

  const getPhaseColor = (phaseId) => {
    if (phaseId.includes('GREEN')) return '#adb5bd'; // steel-400
    if (phaseId.includes('YELLOW')) return '#fbbf24'; // alert-amber
    if (phaseId.includes('RED')) return '#ef4444'; // alert-red
    return '#6c757d'; // steel-500
  };

  const calculatePosition = (timestamp) => {
    const time = new Date(timestamp).getTime();
    return ((time - minTime) / timeRange) * 100;
  };

  // Limit display to recent items for performance
  const displayItems = timeseries.slice(-30);

  return (
    <div className="border-2 border-steel-600 bg-steel-800 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-steel-300 font-mono text-sm uppercase">Phase Timeline</h3>
        <div className="flex gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-8 h-3 border-2 border-steel-400 bg-steel-400"></div>
            <span className="text-steel-400">Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-3 border-2 border-steel-400 border-dashed"></div>
            <span className="text-steel-400">Predicted</span>
          </div>
        </div>
      </div>

      {/* Timeline container */}
      <div className="relative h-32 bg-steel-900 border border-steel-700 rounded overflow-hidden">
        {/* Time axis markers */}
        <div className="absolute inset-0 flex">
          {[0, 25, 50, 75, 100].map(percent => (
            <div
              key={percent}
              className="absolute h-full border-l border-steel-700"
              style={{ left: `${percent}%` }}
            >
              <span className="absolute -top-5 -left-8 text-[10px] text-steel-500 font-mono">
                {percent === 0 ? 'Start' : percent === 100 ? 'Now' : ''}
              </span>
            </div>
          ))}
        </div>

        {/* Phase items */}
        <div className="absolute inset-0 pt-6">
          {displayItems.map((item, idx) => {
            const predictedPos = calculatePosition(item.timestamp_predicted);
            const actualPos = calculatePosition(item.timestamp_actual);
            const predictedColor = getPhaseColor(item.predicted.phase_id);
            const actualColor = getPhaseColor(item.actual.phase_id);

            // Vertical offset to prevent overlap
            const yOffset = (idx % 3) * 30;

            return (
              <React.Fragment key={idx}>
                {/* Predicted phase (dashed, appears earlier/left) */}
                <div
                  className="absolute h-6 border-2 border-dashed rounded opacity-70 hover:opacity-100 transition-opacity cursor-pointer group"
                  style={{
                    left: `${Math.max(0, predictedPos - 1)}%`,
                    top: `${yOffset}px`,
                    width: '2%',
                    borderColor: predictedColor,
                    backgroundColor: `${predictedColor}33`
                  }}
                  title={`Predicted: ${item.predicted.phase_id} (${item.predicted.confidence * 100}%)`}
                >
                  <div className="hidden group-hover:block absolute bottom-full mb-1 left-0 bg-steel-800 border border-steel-600 p-1 text-[10px] font-mono whitespace-nowrap z-10">
                    {item.predicted.phase_id} ({(item.predicted.confidence * 100).toFixed(0)}%)
                  </div>
                </div>

                {/* Actual phase (solid, appears later/right) */}
                <div
                  className="absolute h-6 border-2 rounded hover:opacity-100 transition-opacity cursor-pointer group"
                  style={{
                    left: `${Math.max(0, actualPos - 1)}%`,
                    top: `${yOffset}px`,
                    width: '2%',
                    borderColor: actualColor,
                    backgroundColor: actualColor
                  }}
                  title={`Actual: ${item.actual.phase_id}`}
                >
                  <div className="hidden group-hover:block absolute bottom-full mb-1 left-0 bg-steel-800 border border-steel-600 p-1 text-[10px] font-mono whitespace-nowrap z-10">
                    {item.actual.phase_id} ({item.actual.phase_duration_sec}s)
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex gap-4 text-xs font-mono text-steel-400">
        {phases.map(phase => (
          <div key={phase} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded border-2"
              style={{
                backgroundColor: getPhaseColor(phase),
                borderColor: getPhaseColor(phase)
              }}
            />
            <span>{phase.replace(/_/g, ' ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
