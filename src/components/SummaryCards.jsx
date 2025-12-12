import React from 'react';

/**
 * SummaryCards - Top-level metrics cards
 */
const SummaryCards = ({ detectors, occupancyThreshold = 85 }) => {
  const { total_flow, avg_speed, occupancy_percent, avg_queue } = detectors;

  const isOccupancyHigh = occupancy_percent > occupancyThreshold;

  const cards = [
    {
      label: 'Total Flow',
      value: total_flow,
      unit: 'veh/min',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      label: 'Avg Speed',
      value: avg_speed,
      unit: 'km/h',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      label: 'Occupancy',
      value: occupancy_percent,
      unit: '%',
      alert: isOccupancyHigh,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      label: 'Avg Queue',
      value: avg_queue,
      unit: 'vehicles',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`border-2 p-4 transition-colors ${
            card.alert
              ? 'border-alert-red bg-alert-red/10 animate-pulse'
              : 'border-steel-600 bg-steel-800 hover:border-steel-500'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-steel-400 text-xs font-mono uppercase mb-2">
                {card.label}
              </div>
              <div className={`text-3xl font-bold font-mono ${card.alert ? 'text-alert-red' : 'text-steel-100'}`}>
                {typeof card.value === 'number' ? card.value.toFixed(1) : card.value}
              </div>
              <div className="text-steel-400 text-sm font-mono mt-1">
                {card.unit}
              </div>
            </div>
            <div className={`${card.alert ? 'text-alert-red' : 'text-steel-600'}`}>
              {card.icon}
            </div>
          </div>
          {card.alert && (
            <div className="mt-2 text-xs text-alert-red font-mono">
              ⚠ HIGH OCCUPANCY
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
