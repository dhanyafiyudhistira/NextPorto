'use client';

/**
 * Home Page - Neural Network Digit Recognition
 *
 * Main interface for drawing digits and visualizing predictions.
 * Features:
 * - Drawing canvas for user input
 * - Real-time prediction
 * - Neural network visualization
 * - Probability distribution chart
 */

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import DrawingCanvas from '@/components/DrawingCanvas';
import NetworkVisualization from '@/components/NetworkVisualization';
import ProbabilityChart from '@/components/ProbabilityChart';
import styles from './page.module.css';

interface PredictionResult {
  predictedDigit: number;
  confidence: number;
  probabilities: number[];
  activations: {
    input: number[];
    hidden1: number[];
    hidden2: number[];
    output: number[];
  };
}

export default function Home() {
  const canvasRef = useRef<any>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    if (!canvasRef.current || !canvasRef.current.getImageData) {
      setError('Canvas not ready');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get image data from canvas
      const imageData = canvasRef.current.getImageData();

      // Send to API
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Prediction failed');
      }

      const result = await response.json();

      setPrediction({
        predictedDigit: result.predictedDigit,
        confidence: result.confidence,
        probabilities: result.probabilities,
        activations: result.activations,
      });
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err instanceof Error ? err.message : 'Failed to make prediction');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setPrediction(null);
    setError(null);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Neural Network Number Guesser</h1>
        <p className={styles.subtitle}>
          Draw a digit (0-9) and watch the neural network predict it in real-time
        </p>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/history" className={styles.navLink}>History</Link>
        </nav>
      </header>

      {/* Main content */}
      <main className={styles.main}>
        {/* Left panel: Drawing canvas */}
        <section className={styles.drawingSection}>
          <h2 className={styles.sectionTitle}>Draw a Digit</h2>

          <DrawingCanvas ref={canvasRef} onClear={handleClear} />

          <button
            onClick={handlePredict}
            disabled={isLoading}
            className={styles.predictButton}
          >
            {isLoading ? 'Predicting...' : 'Predict'}
          </button>

          {error && (
            <div className={styles.error}>
              <strong>Error:</strong> {error}
            </div>
          )}
        </section>

        {/* Right panel: Predictions and visualization */}
        <section className={styles.resultsSection}>
          <h2 className={styles.sectionTitle}>Prediction Results</h2>

          <div className={styles.resultsGrid}>
            <ProbabilityChart
              probabilities={prediction?.probabilities || null}
              predictedDigit={prediction?.predictedDigit ?? null}
            />

            <NetworkVisualization
              activations={prediction?.activations || null}
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>
          Built with Next.js, TensorFlow.js, and PostgreSQL |{' '}
          <a
            href="https://github.com/techwithtim/Number-Guesser-Neural-Net"
            target="_blank"
            rel="noopener noreferrer"
          >
            Inspired by Number-Guesser-Neural-Net
          </a>
        </p>
      </footer>
    </div>
  );
}
