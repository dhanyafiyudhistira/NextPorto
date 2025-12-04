import { prisma } from '../utils/prisma';
import { FLService } from './flService';
import { TrainingStatus, FederatedUpdateRequest } from '../types';

export class TrainingService {
  private static trainingStatus: Map<string, TrainingStatus> = new Map();

  /**
   * Start local training for a client
   */
  static async startLocalTraining(userId: string): Promise<TrainingStatus> {
    const clientId = userId;

    // Check if already training
    const existing = this.trainingStatus.get(clientId);
    if (existing && existing.status === 'running') {
      return existing;
    }

    // Get the current global model
    const currentModel = await prisma.modelVersion.findFirst({
      where: { isGlobal: true },
      orderBy: { version: 'desc' },
    });

    if (!currentModel) {
      throw new Error('No global model found');
    }

    const roundId = currentModel.roundId + 1;

    // Initialize training status
    const status: TrainingStatus = {
      clientId,
      roundId,
      progress: 0,
      status: 'running',
      message: 'Collecting local training data...',
    };

    this.trainingStatus.set(clientId, status);

    // Simulate training asynchronously
    this.simulateTraining(clientId, userId, roundId, currentModel.id).catch((error) => {
      console.error('Training error:', error);
      const failedStatus: TrainingStatus = {
        clientId,
        roundId,
        progress: 0,
        status: 'failed',
        message: error.message,
      };
      this.trainingStatus.set(clientId, failedStatus);
    });

    return status;
  }

  /**
   * Get training status for a client
   */
  static getTrainingStatus(clientId: string): TrainingStatus | undefined {
    return this.trainingStatus.get(clientId);
  }

  /**
   * Simulate local training (in a real scenario, this would involve actual model training)
   */
  private static async simulateTraining(
    clientId: string,
    userId: string,
    roundId: number,
    modelVersionId: string
  ) {
    // Update progress: collecting data
    this.updateProgress(clientId, roundId, 10, 'Collecting training samples...');
    await this.delay(500);

    // Get training samples from database
    const samples = await prisma.timeSeriesSample.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 1000, // Use last 1000 samples for training
    });

    this.updateProgress(
      clientId,
      roundId,
      30,
      `Training on ${samples.length} samples...`
    );
    await this.delay(1000);

    // Simulate training iterations
    const epochs = 5;
    for (let epoch = 1; epoch <= epochs; epoch++) {
      const progress = 30 + (epoch / epochs) * 50;
      this.updateProgress(clientId, roundId, progress, `Training epoch ${epoch}/${epochs}...`);
      await this.delay(800);
    }

    this.updateProgress(clientId, roundId, 85, 'Computing model updates...');
    await this.delay(500);

    // Simulate training metrics
    const loss = 0.08 + Math.random() * 0.05; // 0.08 - 0.13
    const accuracy = 0.85 + Math.random() * 0.1; // 0.85 - 0.95

    // Create federated update request
    const updateRequest: FederatedUpdateRequest = {
      clientId,
      roundId,
      numSamples: samples.length,
      loss,
      accuracy,
      // In real scenario, would include actual weight updates
    };

    this.updateProgress(clientId, roundId, 90, 'Sending updates to FL service...');
    await this.delay(500);

    // Submit to FL service
    const globalModelResponse = await FLService.submitFederatedUpdate(updateRequest);

    // Store the model update in database
    await prisma.modelUpdate.create({
      data: {
        clientId,
        roundId,
        numSamples: samples.length,
        loss,
        accuracy,
        status: 'submitted',
        modelVersionId,
        userId,
      },
    });

    // Create new model version if round changed
    if (globalModelResponse.roundId > roundId) {
      await prisma.modelVersion.create({
        data: {
          version: globalModelResponse.version,
          type: 'CNN-LSTM',
          weightsPath: globalModelResponse.weightsPath,
          accuracy: globalModelResponse.accuracy,
          loss: globalModelResponse.loss,
          roundId: globalModelResponse.roundId,
          isGlobal: true,
        },
      });
    }

    this.updateProgress(clientId, roundId, 100, 'Training completed successfully!');

    // Mark as completed after a short delay
    await this.delay(1000);
    const completedStatus: TrainingStatus = {
      clientId,
      roundId,
      progress: 100,
      status: 'completed',
      message: `Training completed. Loss: ${loss.toFixed(4)}, Accuracy: ${accuracy.toFixed(4)}`,
    };
    this.trainingStatus.set(clientId, completedStatus);
  }

  /**
   * Update training progress
   */
  private static updateProgress(
    clientId: string,
    roundId: number,
    progress: number,
    message: string
  ) {
    const status: TrainingStatus = {
      clientId,
      roundId,
      progress: Math.round(progress),
      status: 'running',
      message,
    };
    this.trainingStatus.set(clientId, status);
  }

  /**
   * Helper to simulate async delay
   */
  private static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get current model status
   */
  static async getCurrentModelStatus() {
    const currentModel = await prisma.modelVersion.findFirst({
      where: { isGlobal: true },
      orderBy: { version: 'desc' },
    });

    if (!currentModel) {
      return null;
    }

    // Get recent updates for this round
    const recentUpdates = await prisma.modelUpdate.findMany({
      where: { roundId: currentModel.roundId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      model: currentModel,
      totalUpdates: recentUpdates.length,
      lastUpdate: recentUpdates[0]?.createdAt || currentModel.createdAt,
    };
  }
}
