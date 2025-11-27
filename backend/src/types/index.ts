// TypeScript types for NILM Federated Learning Backend

export interface TimeSeriesSample {
  id?: string;
  timestamp: Date;
  main: number;
  dishWasher: number;
  electricSpaceHeater: number;
  electricStove: number;
  fridge: number;
  microwave: number;
  washerDryer: number;
  userId?: string;
}

export interface ApplianceEstimate {
  id?: string;
  timestamp: Date;
  dishWasherPower: number;
  spaceHeaterPower: number;
  stovePower: number;
  fridgePower: number;
  microwavePower: number;
  washerDryerPower: number;
  totalEstimated: number;
  actualMain: number;
  modelVersionId: string;
  userId?: string;
}

export interface ModelVersion {
  id?: string;
  version: number;
  type: string;
  weightsPath?: string;
  accuracy?: number;
  loss?: number;
  roundId: number;
  isGlobal: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ModelUpdate {
  id?: string;
  clientId: string;
  roundId: number;
  numSamples: number;
  deltaWeightsPath?: string;
  loss?: number;
  accuracy?: number;
  status: 'pending' | 'submitted' | 'aggregated';
  modelVersionId: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TrainingStatus {
  clientId: string;
  roundId: number;
  progress: number;
  status: 'idle' | 'running' | 'completed' | 'failed';
  message?: string;
}

// FL Service API types
export interface InferenceRequest {
  window: number[];
  windowSize: number;
}

export interface InferenceResponse {
  dishWasher: number;
  electricSpaceHeater: number;
  electricStove: number;
  fridge: number;
  microwave: number;
  washerDryer: number;
  timestamp: string;
}

export interface FederatedUpdateRequest {
  clientId: string;
  roundId: number;
  numSamples: number;
  weights?: number[]; // Simplified - in real scenario would be more complex
  loss: number;
  accuracy: number;
}

export interface GlobalModelResponse {
  version: number;
  roundId: number;
  weightsPath: string;
  accuracy: number;
  loss: number;
  createdAt: string;
}
