import React from 'react';

/**
 * PhaseIndicator - Shows current actual and predicted phases with confidence
 */
const PhaseIndicator = ({ actual, predicted, mode }) => {
  const isFault = mode === 'FAULT';

  const getPhaseColor = (phaseId) => {
    if (phaseId.includes('GREEN')) return 'text-steel-100';
    if (phaseId.includes('YELLOW')) return 'text-alert-amber';
    if (phaseId.includes('RED')) return 'text-alert-red';
    return 'text-steel-300';
  };

  const formatPhaseId = (phaseId) => {
    return phaseId.replace(/_/g, ' ');
  };

  return (
    <div className={`border-2 p-6 ${isFault ? 'border-alert-red bg-alert-red/10' : 'border-steel-600 bg-steel-800'}`}>
      {isFault && (
        <div className="mb-4 flex items-center gap-2 text-alert-red font-bold text-lg">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          SIGNAL CONTROLLER FAULT
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Actual Phase */}
        <div>
          <div className="text-steel-400 text-sm font-mono uppercase mb-2">
            Actual Phase
          </div>
          <div className={`text-4xl font-bold font-mono ${getPhaseColor(actual.phase_id)}`}>
            {formatPhaseId(actual.phase_id)}
          </div>
          <div className="mt-2 text-steel-300 text-sm font-mono">
            Duration: {actual.phase_duration_sec}s
          </div>
          <div className="text-steel-400 text-xs font-mono">
            Started: {new Date(actual.started_at).toLocaleTimeString()}
          </div>
        </div>

        {/* Predicted Phase */}
        <div className="border-l-2 border-steel-600 pl-6">
          <div className="text-steel-400 text-sm font-mono uppercase mb-2">
            Predicted Next Phase
          </div>
          <div className={`text-4xl font-bold font-mono ${getPhaseColor(predicted.phase_id)}`}>
            {formatPhaseId(predicted.phase_id)}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div>
              <div className="text-steel-400 text-xs">Confidence</div>
              <div className={`text-lg font-mono ${predicted.confidence >= 0.8 ? 'text-steel-100' : 'text-alert-amber'}`}>
                {(predicted.confidence * 100).toFixed(0)}%
              </div>
            </div>
            <div>
              <div className="text-steel-400 text-xs">Lead Time</div>
              <div className="text-lg font-mono text-steel-100">
                {predicted.lead_seconds}s
              </div>
            </div>
          </div>
          <div className="text-steel-400 text-xs font-mono mt-1">
            Expected: {new Date(predicted.expected_start).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhaseIndicator;
