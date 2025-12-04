'use client';

/**
 * NetworkVisualization Component
 *
 * Visualizes the neural network architecture and activations.
 * Shows:
 * - Layer structure (input, hidden layers, output)
 * - Neuron activations as colored/sized nodes
 * - Network architecture overview
 */

import React from 'react';
import styles from './NetworkVisualization.module.css';

interface NetworkActivations {
  input: number[];
  hidden1: number[];
  hidden2: number[];
  output: number[];
}

interface NetworkVisualizationProps {
  activations: NetworkActivations | null;
}

const NetworkVisualization: React.FC<NetworkVisualizationProps> = ({ activations }) => {
  if (!activations) {
    return (
      <div className={styles.container}>
        <div className={styles.placeholder}>
          <p>Draw a digit and click Predict to see the network in action!</p>
        </div>
      </div>
    );
  }

  // Sample neurons to display (showing all 784 input neurons would be too much)
  const maxNeuronsToShow = {
    input: 20,
    hidden1: 20,
    hidden2: 20,
    output: 10,
  };

  const getActivationColor = (activation: number): string => {
    // Map activation value to color intensity (0 = white, 1 = blue)
    const intensity = Math.min(Math.max(activation, 0), 1);
    const blue = Math.round(255 - intensity * 200);
    return `rgb(${blue}, ${blue}, 255)`;
  };

  const getActivationSize = (activation: number, baseSize: number): number => {
    // Map activation to size (higher activation = larger circle)
    const intensity = Math.min(Math.max(activation, 0), 1);
    return baseSize + intensity * baseSize * 0.5;
  };

  // Sample activations evenly from the layer
  const sampleActivations = (activations: number[], maxCount: number): number[] => {
    if (activations.length <= maxCount) return activations;

    const step = activations.length / maxCount;
    const sampled: number[] = [];

    for (let i = 0; i < maxCount; i++) {
      const index = Math.floor(i * step);
      sampled.push(activations[index]);
    }

    return sampled;
  };

  const layers = [
    {
      name: 'Input',
      size: activations.input.length,
      activations: sampleActivations(activations.input, maxNeuronsToShow.input),
      color: '#1e3a8a',
    },
    {
      name: 'Hidden 1',
      size: activations.hidden1.length,
      activations: sampleActivations(activations.hidden1, maxNeuronsToShow.hidden1),
      color: '#1e40af',
    },
    {
      name: 'Hidden 2',
      size: activations.hidden2.length,
      activations: sampleActivations(activations.hidden2, maxNeuronsToShow.hidden2),
      color: '#3b82f6',
    },
    {
      name: 'Output',
      size: activations.output.length,
      activations: activations.output,
      color: '#60a5fa',
    },
  ];

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Neural Network Visualization</h3>

      <div className={styles.architecture}>
        {layers.map((layer, layerIndex) => (
          <div key={layerIndex} className={styles.layer}>
            <div className={styles.layerHeader}>
              <h4 className={styles.layerName}>{layer.name}</h4>
              <span className={styles.layerSize}>{layer.size} neurons</span>
            </div>

            <div className={styles.neurons}>
              {layer.activations.map((activation, neuronIndex) => {
                const size = layer.name === 'Output' ? 12 : 8;
                const displaySize = getActivationSize(activation, size);

                return (
                  <div
                    key={neuronIndex}
                    className={styles.neuron}
                    style={{
                      width: `${displaySize}px`,
                      height: `${displaySize}px`,
                      backgroundColor: getActivationColor(activation),
                      borderColor: layer.color,
                    }}
                    title={`Activation: ${activation.toFixed(4)}`}
                  />
                );
              })}
            </div>

            {layer.name !== 'Output' && (
              <div className={styles.arrow}>↓</div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: '#ffffff', border: '2px solid #1e40af' }}></span>
          Low activation
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: '#5555ff' }}></span>
          High activation
        </span>
      </div>
    </div>
  );
};

export default NetworkVisualization;
