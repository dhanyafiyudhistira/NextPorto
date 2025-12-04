import { Parser } from 'json2csv';
import { prisma } from '../utils/prisma';

export class ExportService {
  /**
   * Export time series samples as CSV
   */
  static async exportSamples(userId?: string): Promise<string> {
    const samples = await prisma.timeSeriesSample.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { timestamp: 'desc' },
    });

    const fields = [
      { label: 'Timestamp', value: 'timestamp' },
      { label: 'Main Power (W)', value: 'main' },
      { label: 'Dish Washer (W)', value: 'dishWasher' },
      { label: 'Electric Space Heater (W)', value: 'electricSpaceHeater' },
      { label: 'Electric Stove (W)', value: 'electricStove' },
      { label: 'Fridge (W)', value: 'fridge' },
      { label: 'Microwave (W)', value: 'microwave' },
      { label: 'Washer Dryer (W)', value: 'washerDryer' },
    ];

    const parser = new Parser({ fields });
    return parser.parse(samples);
  }

  /**
   * Export appliance estimates as CSV
   */
  static async exportEstimates(userId?: string): Promise<string> {
    const estimates = await prisma.applianceEstimate.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { timestamp: 'desc' },
      include: { modelVersion: true },
    });

    const fields = [
      { label: 'Timestamp', value: 'timestamp' },
      { label: 'Actual Main (W)', value: 'actualMain' },
      { label: 'Total Estimated (W)', value: 'totalEstimated' },
      { label: 'Dish Washer Est. (W)', value: 'dishWasherPower' },
      { label: 'Space Heater Est. (W)', value: 'spaceHeaterPower' },
      { label: 'Stove Est. (W)', value: 'stovePower' },
      { label: 'Fridge Est. (W)', value: 'fridgePower' },
      { label: 'Microwave Est. (W)', value: 'microwavePower' },
      { label: 'Washer Dryer Est. (W)', value: 'washerDryerPower' },
      { label: 'Model Version', value: 'modelVersion.version' },
      { label: 'Model Type', value: 'modelVersion.type' },
    ];

    const parser = new Parser({ fields });
    return parser.parse(estimates);
  }

  /**
   * Export model updates as CSV
   */
  static async exportModelUpdates(userId?: string): Promise<string> {
    const updates = await prisma.modelUpdate.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { modelVersion: true },
    });

    const fields = [
      { label: 'Client ID', value: 'clientId' },
      { label: 'Round ID', value: 'roundId' },
      { label: 'Number of Samples', value: 'numSamples' },
      { label: 'Loss', value: 'loss' },
      { label: 'Accuracy', value: 'accuracy' },
      { label: 'Status', value: 'status' },
      { label: 'Model Version', value: 'modelVersion.version' },
      { label: 'Created At', value: 'createdAt' },
    ];

    const parser = new Parser({ fields });
    return parser.parse(updates);
  }

  /**
   * Export model versions as CSV
   */
  static async exportModelVersions(): Promise<string> {
    const versions = await prisma.modelVersion.findMany({
      orderBy: { version: 'desc' },
    });

    const fields = [
      { label: 'Version', value: 'version' },
      { label: 'Type', value: 'type' },
      { label: 'Round ID', value: 'roundId' },
      { label: 'Accuracy', value: 'accuracy' },
      { label: 'Loss', value: 'loss' },
      { label: 'Is Global', value: 'isGlobal' },
      { label: 'Weights Path', value: 'weightsPath' },
      { label: 'Created At', value: 'createdAt' },
    ];

    const parser = new Parser({ fields });
    return parser.parse(versions);
  }
}
