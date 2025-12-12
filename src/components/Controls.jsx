import React from 'react';

/**
 * Controls - Control panel for SCADA UI
 */
const Controls = ({
  isLive,
  onToggleLive,
  leadSeconds,
  onLeadChange,
  updateInterval,
  onIntervalChange,
  useMock,
  onToggleMock,
  onExportSnapshot
}) => {
  return (
    <div className="border-2 border-steel-600 bg-steel-800 p-4">
      <h3 className="text-steel-300 font-mono text-sm uppercase mb-4">
        Control Panel
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Live / Playback Toggle */}
        <div>
          <label className="text-steel-400 text-xs font-mono uppercase block mb-2">
            Mode
          </label>
          <button
            onClick={onToggleLive}
            className={`w-full px-4 py-2 font-mono text-sm font-medium border-2 transition-colors ${
              isLive
                ? 'bg-steel-100 text-steel-900 border-steel-100'
                : 'bg-steel-800 text-steel-300 border-steel-600 hover:border-steel-500'
            }`}
          >
            {isLive ? '● LIVE' : '▶ PLAYBACK'}
          </button>
        </div>

        {/* Lead Seconds Adjuster */}
        <div>
          <label className="text-steel-400 text-xs font-mono uppercase block mb-2">
            Prediction Lead
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={leadSeconds}
              onChange={(e) => onLeadChange(Number(e.target.value))}
              className="flex-1 h-2 bg-steel-700 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #adb5bd 0%, #adb5bd ${(leadSeconds / 15) * 100}%, #343a40 ${(leadSeconds / 15) * 100}%, #343a40 100%)`
              }}
            />
            <span className="text-steel-100 font-mono font-medium w-12 text-right">
              {leadSeconds}s
            </span>
          </div>
        </div>

        {/* Update Interval (Simulation Speed) */}
        <div>
          <label className="text-steel-400 text-xs font-mono uppercase block mb-2">
            Update Rate
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="500"
              max="5000"
              step="500"
              value={updateInterval}
              onChange={(e) => onIntervalChange(Number(e.target.value))}
              className="flex-1 h-2 bg-steel-700 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #adb5bd 0%, #adb5bd ${((updateInterval - 500) / 4500) * 100}%, #343a40 ${((updateInterval - 500) / 4500) * 100}%, #343a40 100%)`
              }}
            />
            <span className="text-steel-100 font-mono font-medium w-16 text-right">
              {(updateInterval / 1000).toFixed(1)}s
            </span>
          </div>
        </div>

        {/* Mock / Real API Toggle */}
        <div>
          <label className="text-steel-400 text-xs font-mono uppercase block mb-2">
            Data Source
          </label>
          <button
            onClick={onToggleMock}
            className={`w-full px-4 py-2 font-mono text-sm font-medium border-2 transition-colors ${
              useMock
                ? 'bg-steel-700 text-steel-300 border-steel-600'
                : 'bg-steel-600 text-steel-100 border-steel-500'
            }`}
          >
            {useMock ? 'MOCK DATA' : 'LIVE API'}
          </button>
        </div>

        {/* Export Snapshot */}
        <div>
          <label className="text-steel-400 text-xs font-mono uppercase block mb-2">
            Actions
          </label>
          <button
            onClick={onExportSnapshot}
            className="w-full px-4 py-2 font-mono text-sm font-medium border-2 border-steel-600 bg-steel-800 text-steel-300 hover:border-steel-500 hover:bg-steel-700 transition-colors"
          >
            📸 EXPORT SNAPSHOT
          </button>
        </div>

        {/* Status Indicator */}
        <div>
          <label className="text-steel-400 text-xs font-mono uppercase block mb-2">
            Status
          </label>
          <div className="flex items-center gap-2 px-4 py-2 border-2 border-steel-700 bg-steel-900">
            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-steel-100 animate-pulse' : 'bg-steel-600'}`} />
            <span className="text-steel-300 font-mono text-sm">
              {isLive ? 'STREAMING' : 'PAUSED'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;
