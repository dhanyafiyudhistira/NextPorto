import axios from 'axios';
import {
  InferenceRequest,
  InferenceResponse,
  FederatedUpdateRequest,
  GlobalModelResponse,
} from '../types';

const FL_SERVICE_URL = process.env.FL_SERVICE_URL || 'http://localhost:8000';

export class FLService {
  /**
   * Run NILM inference on a time-series window
   */
  static async runInference(window: number[]): Promise<InferenceResponse> {
    try {
      const request: InferenceRequest = {
        window,
        windowSize: window.length,
      };

      const response = await axios.post<InferenceResponse>(
        `${FL_SERVICE_URL}/infer`,
        request,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000, // 10 second timeout
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('FL Service inference error:', error.message);
        throw new Error(`FL Service inference failed: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Submit a federated learning update to the FL service
   */
  static async submitFederatedUpdate(
    update: FederatedUpdateRequest
  ): Promise<GlobalModelResponse> {
    try {
      const response = await axios.post<GlobalModelResponse>(
        `${FL_SERVICE_URL}/federated/update`,
        update,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000, // 30 second timeout for training updates
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('FL Service federated update error:', error.message);
        throw new Error(`FL Service federated update failed: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get the current global model from the FL service
   */
  static async getGlobalModel(): Promise<GlobalModelResponse> {
    try {
      const response = await axios.get<GlobalModelResponse>(
        `${FL_SERVICE_URL}/federated/global-model`,
        {
          timeout: 5000, // 5 second timeout
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('FL Service get global model error:', error.message);
        throw new Error(`FL Service get global model failed: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Health check for FL service
   */
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${FL_SERVICE_URL}/health`, {
        timeout: 3000,
      });
      return response.status === 200;
    } catch (error) {
      console.error('FL Service health check failed');
      return false;
    }
  }
}
