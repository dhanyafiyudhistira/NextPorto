// TypeScript interfaces for NILM Federated Learning Frontend

export interface TimeSeriesSample {
  id?: string;
  timestamp: string;
  main: number;
  dishWasher: number;
  electricSpaceHeater: number;
  electricStove: number;
  fridge: number;
  microwave: number;
  washerDryer: number;
  userId?: string;
  createdAt?: string;
}

export interface ApplianceEstimate {
  id?: string;
  timestamp: string;
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
  createdAt?: string;
  modelVersion?: ModelVersion;
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
  createdAt?: string;
  updatedAt?: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface TrainingStatus {
  clientId: string;
  roundId: number;
  progress: number;
  status: 'idle' | 'running' | 'completed' | 'failed';
  message?: string;
}

export interface ModelStatus {
  model: ModelVersion;
  totalUpdates: number;
  lastUpdate: string;
}

export interface GaugeData {
  label: string;
  value: number;
  max: number;
  unit: string;
  color: string;
}
