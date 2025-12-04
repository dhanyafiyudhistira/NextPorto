import { Router, Request, Response } from 'express';
import { ExportService } from '../services/exportService';

const router = Router();

/**
 * GET /api/logs/export
 * Export data as CSV based on type parameter
 * Query params:
 *   - type: 'samples' | 'estimates' | 'updates' | 'models'
 *   - userId: optional user filter
 */
router.get('/export', async (req: Request, res: Response) => {
  try {
    const type = req.query.type as string;
    const userId = req.query.userId as string | undefined;

    let csv: string;
    let filename: string;

    switch (type) {
      case 'samples':
        csv = await ExportService.exportSamples(userId);
        filename = 'time_series_samples.csv';
        break;

      case 'estimates':
        csv = await ExportService.exportEstimates(userId);
        filename = 'appliance_estimates.csv';
        break;

      case 'updates':
        csv = await ExportService.exportModelUpdates(userId);
        filename = 'model_updates.csv';
        break;

      case 'models':
        csv = await ExportService.exportModelVersions();
        filename = 'model_versions.csv';
        break;

      default:
        return res.status(400).json({
          error: 'Invalid export type',
          message: 'Type must be one of: samples, estimates, updates, models',
        });
    }

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    res.send(csv);
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({
      error: 'Failed to export data',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
