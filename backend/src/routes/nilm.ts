import { Router, Request, Response } from 'express';
import { NILMService } from '../services/nilmService';

const router = Router();

/**
 * GET /api/nilm/sample
 * Get a new dummy sensor sample (simulates realtime telemetry)
 */
router.get('/sample', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string | undefined;

    // Generate and store dummy sample
    const sample = NILMService.generateDummySample(userId);
    const stored = await NILMService.storeSample(sample);

    res.json(stored);
  } catch (error) {
    console.error('Error generating sample:', error);
    res.status(500).json({
      error: 'Failed to generate sample',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/nilm/samples
 * Get recent samples
 */
router.get('/samples', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string | undefined;
    const limit = parseInt(req.query.limit as string) || 100;

    const samples = await NILMService.getRecentSamples(limit, userId);

    res.json(samples);
  } catch (error) {
    console.error('Error fetching samples:', error);
    res.status(500).json({
      error: 'Failed to fetch samples',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/nilm/infer
 * Run NILM inference on recent data
 */
router.post('/infer', async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId as string | undefined;
    const windowSize = parseInt(req.body.windowSize as string) || 50;

    const estimate = await NILMService.runInference(windowSize, userId);

    res.json(estimate);
  } catch (error) {
    console.error('Error running inference:', error);
    res.status(500).json({
      error: 'Failed to run inference',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/nilm/estimate/latest
 * Get the latest appliance estimate
 */
router.get('/estimate/latest', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string | undefined;

    const estimate = await NILMService.getLatestEstimate(userId);

    if (!estimate) {
      return res.status(404).json({ error: 'No estimates found' });
    }

    res.json(estimate);
  } catch (error) {
    console.error('Error fetching latest estimate:', error);
    res.status(500).json({
      error: 'Failed to fetch latest estimate',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/nilm/estimates
 * Get recent estimates
 */
router.get('/estimates', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string | undefined;
    const limit = parseInt(req.query.limit as string) || 100;

    const estimates = await NILMService.getRecentEstimates(limit, userId);

    res.json(estimates);
  } catch (error) {
    console.error('Error fetching estimates:', error);
    res.status(500).json({
      error: 'Failed to fetch estimates',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
