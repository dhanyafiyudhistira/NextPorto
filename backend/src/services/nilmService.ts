import { prisma } from '../utils/prisma';
import { FLService } from './flService';
import { TimeSeriesSample, ApplianceEstimate } from '../types';

export class NILMService {
  /**
   * Generate dummy sensor data similar to REDD dataset
   */
  static generateDummySample(userId?: string): TimeSeriesSample {
    // Simulate realistic power consumption patterns
    const fridge = 50 + Math.random() * 100; // 50-150W baseline
    const dishWasher = Math.random() > 0.9 ? 1200 + Math.random() * 400 : 0;
    const electricSpaceHeater = Math.random() > 0.7 ? 1500 + Math.random() * 500 : 0;
    const electricStove = Math.random() > 0.95 ? 2000 + Math.random() * 1000 : 0;
    const microwave = Math.random() > 0.97 ? 900 + Math.random() * 300 : 0;
    const washerDryer = Math.random() > 0.85 ? 1800 + Math.random() * 700 : 0;

    const main =
      fridge +
      dishWasher +
      electricSpaceHeater +
      electricStove +
      microwave +
      washerDryer +
      (Math.random() * 50 - 25); // Add some noise

    return {
      timestamp: new Date(),
      main: Math.round(main * 100) / 100,
      dishWasher: Math.round(dishWasher * 100) / 100,
      electricSpaceHeater: Math.round(electricSpaceHeater * 100) / 100,
      electricStove: Math.round(electricStove * 100) / 100,
      fridge: Math.round(fridge * 100) / 100,
      microwave: Math.round(microwave * 100) / 100,
      washerDryer: Math.round(washerDryer * 100) / 100,
      userId,
    };
  }

  /**
   * Store a sample in the database
   */
  static async storeSample(sample: TimeSeriesSample) {
    return await prisma.timeSeriesSample.create({
      data: {
        timestamp: sample.timestamp,
        main: sample.main,
        dishWasher: sample.dishWasher,
        electricSpaceHeater: sample.electricSpaceHeater,
        electricStove: sample.electricStove,
        fridge: sample.fridge,
        microwave: sample.microwave,
        washerDryer: sample.washerDryer,
        userId: sample.userId,
      },
    });
  }

  /**
   * Get a sliding window of the last N main power values
   */
  static async getMainPowerWindow(windowSize: number, userId?: string): Promise<number[]> {
    const samples = await prisma.timeSeriesSample.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { timestamp: 'desc' },
      take: windowSize,
      select: { main: true },
    });

    // Reverse to get chronological order
    return samples.reverse().map((s) => s.main);
  }

  /**
   * Run NILM inference on the latest data
   */
  static async runInference(windowSize: number = 50, userId?: string) {
    // Get the window of main power values
    const window = await this.getMainPowerWindow(windowSize, userId);

    if (window.length < windowSize) {
      throw new Error(
        `Insufficient data: need ${windowSize} samples, have ${window.length}`
      );
    }

    // Call FL service for inference
    const inferenceResult = await FLService.runInference(window);

    // Get the current model version
    const currentModel = await prisma.modelVersion.findFirst({
      where: { isGlobal: true },
      orderBy: { version: 'desc' },
    });

    if (!currentModel) {
      throw new Error('No model version found');
    }

    // Get the latest sample to know the actual main power
    const latestSample = await prisma.timeSeriesSample.findFirst({
      where: userId ? { userId } : undefined,
      orderBy: { timestamp: 'desc' },
    });

    if (!latestSample) {
      throw new Error('No samples found');
    }

    // Calculate total estimated
    const totalEstimated =
      inferenceResult.dishWasher +
      inferenceResult.electricSpaceHeater +
      inferenceResult.electricStove +
      inferenceResult.fridge +
      inferenceResult.microwave +
      inferenceResult.washerDryer;

    // Store the estimate
    const estimate = await prisma.applianceEstimate.create({
      data: {
        timestamp: new Date(),
        dishWasherPower: inferenceResult.dishWasher,
        spaceHeaterPower: inferenceResult.electricSpaceHeater,
        stovePower: inferenceResult.electricStove,
        fridgePower: inferenceResult.fridge,
        microwavePower: inferenceResult.microwave,
        washerDryerPower: inferenceResult.washerDryer,
        totalEstimated,
        actualMain: latestSample.main,
        modelVersionId: currentModel.id,
        userId,
      },
    });

    return estimate;
  }

  /**
   * Get the latest appliance estimate
   */
  static async getLatestEstimate(userId?: string) {
    return await prisma.applianceEstimate.findFirst({
      where: userId ? { userId } : undefined,
      orderBy: { timestamp: 'desc' },
      include: { modelVersion: true },
    });
  }

  /**
   * Get recent samples
   */
  static async getRecentSamples(limit: number = 100, userId?: string) {
    return await prisma.timeSeriesSample.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }

  /**
   * Get recent estimates
   */
  static async getRecentEstimates(limit: number = 100, userId?: string) {
    return await prisma.applianceEstimate.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { timestamp: 'desc' },
      take: limit,
      include: { modelVersion: true },
    });
  }
}
