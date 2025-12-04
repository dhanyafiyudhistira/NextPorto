'use client';

import React from 'react';
import styles from './BarChart.module.css';

interface BarData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  title: string;
  data: BarData[];
  max?: number;
  unit?: string;
  showTotal?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({
  title,
  data,
  max,
  unit = 'W',
  showTotal = false,
}) => {
  // Calculate max value if not provided
  const maxValue = max || Math.max(...data.map((d) => d.value), 1);

  // Calculate total
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={styles.barChartContainer}>
      <div className={styles.barChartLabel}>{title}</div>

      <div className={styles.chartArea}>
        {data.map((item, index) => {
          const heightPercentage = (item.value / maxValue) * 100;

          return (
            <div
              key={index}
              className={styles.bar}
              style={{
                height: `${heightPercentage}%`,
                backgroundColor: item.color || '#333',
              }}
              title={`${item.label}: ${Math.round(item.value)} ${unit}`}
            >
              {item.value > 0 && (
                <span className={styles.barValue}>
                  {Math.round(item.value)}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {showTotal && (
        <>
          <div className={styles.chartValue}>{Math.round(total)}</div>
          <div className={styles.chartUnit}>{unit} (Total)</div>
        </>
      )}

      <div className={styles.legend}>
        {data.map((item, index) => (
          <div key={index} className={styles.legendItem}>
            <span className={styles.legendLabel}>{item.label}</span>
            <span className={styles.legendValue}>
              {Math.round(item.value)} {unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;
