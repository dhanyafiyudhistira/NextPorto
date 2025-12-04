'use client';

/**
 * ProbabilityChart Component
 *
 * Displays a bar chart of prediction probabilities for each digit (0-9).
 * Shows the confidence level for each possible digit.
 */

import React from 'react';
import styles from './ProbabilityChart.module.css';

interface ProbabilityChartProps {
  probabilities: number[] | null;
  predictedDigit: number | null;
}

const ProbabilityChart: React.FC<ProbabilityChartProps> = ({
  probabilities,
  predictedDigit,
}) => {
  if (!probabilities) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Prediction Probabilities</h3>
        <div className={styles.placeholder}>
          <p>No predictions yet</p>
        </div>
      </div>
    );
  }

  // Find max probability for scaling
  const maxProb = Math.max(...probabilities);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Prediction Probabilities</h3>

      {predictedDigit !== null && (
        <div className={styles.prediction}>
          <span className={styles.predictionLabel}>Predicted Digit:</span>
          <span className={styles.predictionValue}>{predictedDigit}</span>
          <span className={styles.confidence}>
            ({(probabilities[predictedDigit] * 100).toFixed(1)}% confidence)
          </span>
        </div>
      )}

      <div className={styles.chart}>
        {probabilities.map((prob, digit) => {
          const percentage = (prob * 100).toFixed(1);
          const isMax = digit === predictedDigit;

          return (
            <div key={digit} className={styles.bar}>
              <div className={styles.barLabel}>
                <span className={styles.digit}>{digit}</span>
              </div>

              <div className={styles.barTrack}>
                <div
                  className={`${styles.barFill} ${isMax ? styles.barFillMax : ''}`}
                  style={{ width: `${prob * 100}%` }}
                >
                  {prob > 0.05 && (
                    <span className={styles.barValue}>{percentage}%</span>
                  )}
                </div>
              </div>

              {prob <= 0.05 && (
                <span className={styles.smallValue}>{percentage}%</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProbabilityChart;
