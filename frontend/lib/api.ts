import axios from 'axios';
import type {
  TimeSeriesSample,
  ApplianceEstimate,
  TrainingStatus,
  ModelStatus,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const nilmApi = {
  /**
   * Get a new realtime sample
   */
  async getSample(userId?: string): Promise<TimeSeriesSample> {
    const params = userId ? { userId } : {};
    const response = await api.get<TimeSeriesSample>('/api/nilm/sample', { params });
    return response.data;
  },

  /**
   * Get recent samples
   */
  async getSamples(limit: number = 100, userId?: string): Promise<TimeSeriesSample[]> {
    const params: any = { limit };
    if (userId) params.userId = userId;
    const response = await api.get<TimeSeriesSample[]>('/api/nilm/samples', { params });
    return response.data;
  },

  /**
   * Run NILM inference
   */
  async runInference(windowSize: number = 50, userId?: string): Promise<ApplianceEstimate> {
    const response = await api.post<ApplianceEstimate>('/api/nilm/infer', {
      windowSize,
      userId,
    });
    return response.data;
  },

  /**
   * Get latest appliance estimate
   */
  async getLatestEstimate(userId?: string): Promise<ApplianceEstimate> {
    const params = userId ? { userId } : {};
    const response = await api.get<ApplianceEstimate>('/api/nilm/estimate/latest', { params });
    return response.data;
  },

  /**
   * Get recent estimates
   */
  async getEstimates(limit: number = 100, userId?: string): Promise<ApplianceEstimate[]> {
    const params: any = { limit };
    if (userId) params.userId = userId;
    const response = await api.get<ApplianceEstimate[]>('/api/nilm/estimates', { params });
    return response.data;
  },
};

export const trainingApi = {
  /**
   * Start local training
   */
  async startTraining(userId?: string): Promise<TrainingStatus> {
    const response = await api.post<TrainingStatus>('/api/training/start', { userId });
    return response.data;
  },

  /**
   * Get training status
   */
  async getTrainingStatus(clientId?: string): Promise<TrainingStatus> {
    const params = clientId ? { clientId } : {};
    const response = await api.get<TrainingStatus>('/api/training/status', { params });
    return response.data;
  },

  /**
   * Get model status
   */
  async getModelStatus(): Promise<ModelStatus> {
    const response = await api.get<ModelStatus>('/api/training/model-status');
    return response.data;
  },
};

export const logsApi = {
  /**
   * Get CSV export URL
   */
  getExportUrl(type: 'samples' | 'estimates' | 'updates' | 'models', userId?: string): string {
    const params = new URLSearchParams({ type });
    if (userId) params.append('userId', userId);
    return `${API_URL}/api/logs/export?${params.toString()}`;
  },
};

export default api;
