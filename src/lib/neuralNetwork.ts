/**
 * Neural Network Model for Digit Recognition
 *
 * This module implements a feedforward neural network for recognizing
 * handwritten digits (0-9), inspired by MNIST digit recognition.
 *
 * Architecture:
 * - Input Layer: 784 neurons (28x28 pixel image flattened)
 * - Hidden Layer 1: 128 neurons with ReLU activation
 * - Hidden Layer 2: 64 neurons with ReLU activation
 * - Output Layer: 10 neurons with Softmax activation (one per digit)
 */

import * as tf from '@tensorflow/tfjs';

export interface NetworkActivations {
  input: number[];
  hidden1: number[];
  hidden2: number[];
  output: number[];
}

export interface PredictionResult {
  predictedDigit: number;
  probabilities: number[];
  activations: NetworkActivations;
  confidence: number;
}

class DigitRecognitionNetwork {
  private model: tf.LayersModel | null = null;
  private isInitialized = false;

  /**
   * Initialize the neural network model
   * Creates a sequential model with dense layers
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    // Create the model architecture
    this.model = tf.sequential({
      layers: [
        // Input layer: expects 784 values (28x28 flattened image)
        tf.layers.dense({
          inputShape: [784],
          units: 128,
          activation: 'relu',
          name: 'hidden1',
        }),
        // First hidden layer
        tf.layers.dense({
          units: 64,
          activation: 'relu',
          name: 'hidden2',
        }),
        // Output layer: 10 neurons for digits 0-9
        tf.layers.dense({
          units: 10,
          activation: 'softmax',
          name: 'output',
        }),
      ],
    });

    // Compile the model
    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });

    this.isInitialized = true;
    console.log('Neural network initialized');
  }

  /**
   * Preprocess image data for the neural network
   * Converts canvas image data to normalized 28x28 grayscale array
   */
  preprocessImage(imageData: number[]): number[] {
    // Ensure we have exactly 784 values
    if (imageData.length !== 784) {
      throw new Error(`Expected 784 values, got ${imageData.length}`);
    }

    // Normalize pixel values to [0, 1]
    return imageData.map(val => val / 255);
  }

  /**
   * Get activations from all layers of the network
   * This is used for visualization purposes
   */
  private async getLayerActivations(input: tf.Tensor): Promise<NetworkActivations> {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    const activations: NetworkActivations = {
      input: [],
      hidden1: [],
      hidden2: [],
      output: [],
    };

    // Get input values
    const inputData = await input.data();
    activations.input = Array.from(inputData);

    // Create intermediate models to get activations at each layer
    const layer1Model = tf.model({
      inputs: this.model.inputs,
      outputs: this.model.getLayer('hidden1').output as tf.SymbolicTensor,
    });

    const layer2Model = tf.model({
      inputs: this.model.inputs,
      outputs: this.model.getLayer('hidden2').output as tf.SymbolicTensor,
    });

    const outputModel = tf.model({
      inputs: this.model.inputs,
      outputs: this.model.getLayer('output').output as tf.SymbolicTensor,
    });

    // Get activations from each layer
    const hidden1Output = layer1Model.predict(input) as tf.Tensor;
    const hidden2Output = layer2Model.predict(input) as tf.Tensor;
    const outputOutput = outputModel.predict(input) as tf.Tensor;

    activations.hidden1 = Array.from(await hidden1Output.data());
    activations.hidden2 = Array.from(await hidden2Output.data());
    activations.output = Array.from(await outputOutput.data());

    // Clean up tensors
    hidden1Output.dispose();
    hidden2Output.dispose();
    outputOutput.dispose();
    layer1Model.dispose();
    layer2Model.dispose();
    outputModel.dispose();

    return activations;
  }

  /**
   * Make a prediction on the input image
   * Returns the predicted digit, probabilities, and layer activations
   */
  async predict(imageData: number[]): Promise<PredictionResult> {
    if (!this.model) {
      await this.initialize();
    }

    return tf.tidy(() => {
      // Preprocess the image
      const normalized = this.preprocessImage(imageData);

      // Create tensor from input
      const inputTensor = tf.tensor2d([normalized], [1, 784]);

      // Get predictions and activations
      return this.getPredictionWithActivations(inputTensor);
    });
  }

  /**
   * Helper method to get prediction with activations
   */
  private async getPredictionWithActivations(
    inputTensor: tf.Tensor
  ): Promise<PredictionResult> {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    // Get layer activations
    const activations = await this.getLayerActivations(inputTensor);

    // Get prediction probabilities
    const probabilities = activations.output;

    // Find the digit with highest probability
    const predictedDigit = probabilities.indexOf(Math.max(...probabilities));
    const confidence = probabilities[predictedDigit];

    return {
      predictedDigit,
      probabilities,
      activations,
      confidence,
    };
  }

  /**
   * Load pre-trained weights from a file
   * This allows us to use a model trained on MNIST data
   */
  async loadWeights(weightsPath: string): Promise<void> {
    if (!this.model) {
      await this.initialize();
    }

    try {
      await this.model!.loadWeights(weightsPath);
      console.log('Weights loaded successfully');
    } catch (error) {
      console.warn('Could not load weights, using random initialization:', error);
    }
  }

  /**
   * Save the current model weights
   */
  async saveWeights(savePath: string): Promise<void> {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    await this.model.save(savePath);
    console.log('Weights saved successfully');
  }

  /**
   * Get model summary for debugging
   */
  getSummary(): void {
    if (!this.model) {
      console.log('Model not initialized');
      return;
    }

    this.model.summary();
  }
}

// Export a singleton instance
let networkInstance: DigitRecognitionNetwork | null = null;

export function getNetworkInstance(): DigitRecognitionNetwork {
  if (!networkInstance) {
    networkInstance = new DigitRecognitionNetwork();
  }
  return networkInstance;
}

export default DigitRecognitionNetwork;
