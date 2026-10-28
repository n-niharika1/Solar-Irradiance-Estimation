import apiClient from './client';
import type {
  PredictionRequest,
  PredictionResponse,
  BatchPredictionResponse,
  ModelInfo,
  ModelComparisonResponse,
  HealthResponse,
} from '../types';

export async function predictGHI(data: PredictionRequest): Promise<PredictionResponse> {
  const response = await apiClient.post<PredictionResponse>('/api/predict', data);
  return response.data;
}

export async function batchPredictGHI(
  requests: PredictionRequest[]
): Promise<BatchPredictionResponse> {
  const response = await apiClient.post<BatchPredictionResponse>('/api/predict/batch', {
    requests,
  });
  return response.data;
}

export async function getModelInfo(): Promise<ModelInfo> {
  const response = await apiClient.get<ModelInfo>('/api/model-info');
  return response.data;
}

export async function getModelComparison(): Promise<ModelComparisonResponse> {
  const response = await apiClient.get<ModelComparisonResponse>('/api/model-comparison');
  return response.data;
}

export async function checkHealth(): Promise<HealthResponse> {
  const response = await apiClient.get<HealthResponse>('/api/health');
  return response.data;
}
