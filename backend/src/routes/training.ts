import { Router, Request, Response } from 'express';
import { TrainingService } from '../services/trainingService';

const router = Router();

/**
 * POST /api/training/start
 * Start local training for a client
 */
router.post('/start', async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId || 'demo-user';

    const status = await TrainingService.startLocalTraining(userId);

    res.json(status);
  } catch (error) {
    console.error('Error starting training:', error);
    res.status(500).json({
      error: 'Failed to start training',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/training/status
 * Get training status for a client
 */
router.get('/status', (req: Request, res: Response) => {
  try {
    const clientId = (req.query.clientId as string) || 'demo-user';

    const status = TrainingService.getTrainingStatus(clientId);

    if (!status) {
      return res.json({
        clientId,
        roundId: 0,
        progress: 0,
        status: 'idle',
        message: 'No training in progress',
      });
    }

    res.json(status);
  } catch (error) {
    console.error('Error getting training status:', error);
    res.status(500).json({
      error: 'Failed to get training status',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/training/model-status
 * Get current model status
 */
router.get('/model-status', async (req: Request, res: Response) => {
  try {
    const status = await TrainingService.getCurrentModelStatus();

    if (!status) {
      return res.status(404).json({ error: 'No model found' });
    }

    res.json(status);
  } catch (error) {
    console.error('Error getting model status:', error);
    res.status(500).json({
      error: 'Failed to get model status',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
