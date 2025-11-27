import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nilmRoutes from './routes/nilm';
import trainingRoutes from './routes/training';
import logsRoutes from './routes/logs';
import { FLService } from './services/flService';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/nilm', nilmRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/logs', logsRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'NILM Federated Learning Backend',
  });
});

// FL Service health check
app.get('/fl-health', async (req: Request, res: Response) => {
  try {
    const isHealthy = await FLService.healthCheck();
    res.json({
      flService: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      flService: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'NILM Federated Learning Backend API',
    version: '1.0.0',
    endpoints: {
      nilm: {
        'GET /api/nilm/sample': 'Generate and store a new dummy sample',
        'GET /api/nilm/samples': 'Get recent samples',
        'POST /api/nilm/infer': 'Run NILM inference',
        'GET /api/nilm/estimate/latest': 'Get latest appliance estimate',
        'GET /api/nilm/estimates': 'Get recent estimates',
      },
      training: {
        'POST /api/training/start': 'Start local training',
        'GET /api/training/status': 'Get training status',
        'GET /api/training/model-status': 'Get current model status',
      },
      logs: {
        'GET /api/logs/export': 'Export data as CSV (query param: type)',
      },
      health: {
        'GET /health': 'Backend health check',
        'GET /fl-health': 'FL service health check',
      },
    },
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║  NILM Federated Learning Backend API                  ║
║  Server running on http://localhost:${PORT}             ║
╚════════════════════════════════════════════════════════╝
  `);
  console.log('📡 API Endpoints:');
  console.log('   - NILM:     /api/nilm/*');
  console.log('   - Training: /api/training/*');
  console.log('   - Logs:     /api/logs/*');
  console.log('   - Health:   /health');
  console.log('');

  // Check FL service health on startup
  FLService.healthCheck()
    .then((isHealthy) => {
      if (isHealthy) {
        console.log('✅ FL Service is reachable');
      } else {
        console.log('⚠️  FL Service is not reachable');
        console.log('   Make sure to start the FL service at', process.env.FL_SERVICE_URL);
      }
    })
    .catch(() => {
      console.log('⚠️  Could not connect to FL Service');
      console.log('   Make sure to start the FL service at', process.env.FL_SERVICE_URL);
    });
});

export default app;
