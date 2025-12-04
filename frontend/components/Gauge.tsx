'use client';

import React from 'react';
import styles from './Gauge.module.css';

interface GaugeProps {
  label: string;
  value: number;
  max: number;
  unit?: string;
  color?: string;
}

const Gauge: React.FC<GaugeProps> = ({
  label,
  value,
  max,
  unit = 'W',
  color = '#333',
}) => {
  // Ensure value is within bounds
  const clampedValue = Math.min(Math.max(value, 0), max);
  const percentage = (clampedValue / max) * 100;

  // SVG arc parameters
  const radius = 60;
  const strokeWidth = 10;
  const centerX = 75;
  const centerY = 75;

  // Calculate arc path (semicircle from -90° to 90°, i.e., 180° total)
  const startAngle = -90; // Start at bottom left
  const endAngle = 90; // End at bottom right

  // Calculate needle angle based on percentage
  const needleAngle = startAngle + (percentage / 100) * (endAngle - startAngle);

  // Create arc path for background
  const arcPath = (angle: number) => {
    const radians = (angle * Math.PI) / 180;
    const x = centerX + radius * Math.cos(radians);
    const y = centerY + radius * Math.sin(radians);
    return { x, y };
  };

  const start = arcPath(startAngle);
  const end = arcPath(endAngle);

  const backgroundPath = `
    M ${start.x} ${start.y}
    A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}
  `;

  // Calculate foreground arc based on percentage
  const currentAngle = startAngle + (percentage / 100) * 180;
  const current = arcPath(currentAngle);

  const foregroundPath = `
    M ${start.x} ${start.y}
    A ${radius} ${radius} 0 ${percentage > 50 ? 1 : 0} 1 ${current.x} ${current.y}
  `;

  // Calculate needle position
  const needleLength = radius - 10;
  const needleRadians = (needleAngle * Math.PI) / 180;
  const needleX = centerX + needleLength * Math.cos(needleRadians);
  const needleY = centerY + needleLength * Math.sin(needleRadians);

  return (
    <div className={styles.gaugeContainer}>
      <div className={styles.gaugeLabel}>{label}</div>

      <svg className={styles.gaugeSvg} viewBox="0 0 150 100">
        {/* Background arc */}
        <path
          className={styles.gaugeBackground}
          d={backgroundPath}
          strokeWidth={strokeWidth}
        />

        {/* Foreground arc (filled portion) */}
        {percentage > 0 && (
          <path
            className={styles.gaugeForeground}
            d={foregroundPath}
            stroke={color}
            strokeWidth={strokeWidth}
          />
        )}

        {/* Needle */}
        <line
          x1={centerX}
          y1={centerY}
          x2={needleX}
          y2={needleY}
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          style={{
            transformOrigin: `${centerX}px ${centerY}px`,
          }}
        />

        {/* Center dot */}
        <circle
          className={styles.gaugeCenter}
          cx={centerX}
          cy={centerY}
          r="4"
        />

        {/* Min and Max labels */}
        <text
          x={start.x - 10}
          y={start.y + 15}
          fontSize="10"
          fill="#666"
          textAnchor="middle"
        >
          0
        </text>
        <text
          x={end.x + 10}
          y={end.y + 15}
          fontSize="10"
          fill="#666"
          textAnchor="middle"
        >
          {max}
        </text>
      </svg>

      <div className={styles.gaugeValue}>
        {Math.round(value)}
      </div>
      <div className={styles.gaugeUnit}>{unit}</div>
    </div>
  );
};

export default Gauge;
