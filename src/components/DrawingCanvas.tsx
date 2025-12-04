'use client';

/**
 * DrawingCanvas Component
 *
 * Provides an interactive canvas for users to draw digits.
 * Features:
 * - Mouse and touch drawing support
 * - Clear button to reset canvas
 * - Converts drawing to 28x28 grayscale image data
 * - Returns pixel data as array of 784 values (0-255)
 */

import React, { useRef, useState, useEffect } from 'react';
import styles from './DrawingCanvas.module.css';

interface DrawingCanvasProps {
  onClear?: () => void;
  width?: number;
  height?: number;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  onClear,
  width = 280,
  height = 280,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up canvas style
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 12;

    // Fill with white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    setContext(ctx);
  }, [width, height]);

  // Get coordinates relative to canvas
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      // Touch event
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      // Mouse event
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  // Start drawing
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!context) return;

    const { x, y } = getCoordinates(e);
    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);

    // Prevent scrolling on touch devices
    if ('touches' in e) {
      e.preventDefault();
    }
  };

  // Draw line
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !context) return;

    const { x, y } = getCoordinates(e);
    context.lineTo(x, y);
    context.stroke();

    // Prevent scrolling on touch devices
    if ('touches' in e) {
      e.preventDefault();
    }
  };

  // Stop drawing
  const stopDrawing = () => {
    if (!context) return;
    context.closePath();
    setIsDrawing(false);
  };

  // Clear canvas
  const clearCanvas = () => {
    if (!context) return;

    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, width, height);

    if (onClear) {
      onClear();
    }
  };

  /**
   * Get image data as 28x28 grayscale array (784 values)
   * This is the format expected by the neural network
   */
  const getImageData = (): number[] => {
    const canvas = canvasRef.current;
    if (!canvas || !context) return Array(784).fill(0);

    // Create a temporary 28x28 canvas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 28;
    tempCanvas.height = 28;
    const tempCtx = tempCanvas.getContext('2d');

    if (!tempCtx) return Array(784).fill(0);

    // Draw the main canvas scaled down to 28x28
    tempCtx.fillStyle = '#FFFFFF';
    tempCtx.fillRect(0, 0, 28, 28);
    tempCtx.drawImage(canvas, 0, 0, 28, 28);

    // Get pixel data
    const imageData = tempCtx.getImageData(0, 0, 28, 28);
    const pixels: number[] = [];

    // Convert to grayscale (invert so black = 255, white = 0)
    // This matches MNIST format where digits are white on black
    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];

      // Convert to grayscale
      const gray = (r + g + b) / 3;

      // Invert (so drawn pixels are high values)
      const inverted = 255 - gray;

      pixels.push(inverted);
    }

    return pixels;
  };

  // Expose getImageData through ref (for parent component to access)
  useEffect(() => {
    if (canvasRef.current) {
      (canvasRef.current as any).getImageData = getImageData;
    }
  }, [context]);

  return (
    <div className={styles.container}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={styles.canvas}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      <button onClick={clearCanvas} className={styles.clearButton}>
        Clear
      </button>
    </div>
  );
};

export default DrawingCanvas;

// Export getImageData utility for external use
export { };
