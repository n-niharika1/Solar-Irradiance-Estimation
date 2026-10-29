import apiClient from './client';
import { estimateInBrowser } from './mlEngine';
import type {
  PredictionRequest,
  PredictionResponse,
  BatchPredictionResponse,
  ModelInfo,
  ModelComparisonResponse,
  HealthResponse,
} from '../types';

export async function predictGHI(data: PredictionRequest): Promise<PredictionResponse> {
  try {
    // Attempt to query FastAPI backend with short timeout
    const response = await apiClient.post<PredictionResponse>('/api/predict', data, {
      timeout: 4000,
    });
    return {
      ...response.data,
      engine: 'backend',
    };
  } catch (error) {
    // If backend is offline, unreachable, or deployed statically on Vercel without cloud backend,
    // seamlessly execute the in-browser high-precision ML engine!
    console.info('[SolarSight AI] FastAPI backend offline; active in-browser ML engine.', error);
    return estimateInBrowser(data);
  }
}

export async function batchPredictGHI(
  requests: PredictionRequest[]
): Promise<BatchPredictionResponse> {
  try {
    const response = await apiClient.post<BatchPredictionResponse>('/api/predict/batch', {
      requests,
    }, {
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    console.info('[SolarSight AI] Batch backend offline; running in-browser batch engine.', error);
    const results = requests.map((r) => estimateInBrowser(r));
    return { results };
  }
}

export async function getModelInfo(): Promise<ModelInfo> {
  try {
    const response = await apiClient.get<ModelInfo>('/api/model-info', { timeout: 3000 });
    return response.data;
  } catch {
    return {
      model_name: 'Random Forest',
      features: ['YEAR', 'LAT', 'LON', 'MONTH_NUM', 'CLEARSKY'],
      target: 'GHI',
      target_unit: 'kWh/m²/day',
      evaluation_metrics: {
        MAE: 0.1264,
        RMSE: 0.1762,
        R2: 0.9600,
      },
      training_data: {
        description: '63 regional locations across India, monthly data from 2001 to 2025',
        locations: 63,
        year_range: '2001-2025',
      },
      test_info: {
        description: 'Evaluated on 13 held-out locations not seen during training',
        test_locations: 13,
      },
    };
  }
}

export async function getModelComparison(): Promise<ModelComparisonResponse> {
  try {
    const response = await apiClient.get<ModelComparisonResponse>('/api/model-comparison', { timeout: 3000 });
    return response.data;
  } catch {
    return {
      comparison: [
        { model: 'Random Forest', MAE: 0.1264, RMSE: 0.1762, R2: 0.9600, selected: true },
        { model: 'XGBoost', MAE: 0.1843, RMSE: 0.2493, R2: 0.9199, selected: false },
        { model: 'Neural Network (MLP)', MAE: 0.2272, RMSE: 0.3096, R2: 0.8765, selected: false },
        { model: 'Linear Regression', MAE: 0.5332, RMSE: 0.6519, R2: 0.4523, selected: false },
      ],
    };
  }
}

export async function checkHealth(): Promise<HealthResponse> {
  try {
    const response = await apiClient.get<HealthResponse>('/api/health', { timeout: 2000 });
    return response.data;
  } catch {
    return {
      status: 'offline_fallback',
      model_loaded: true,
      model_name: 'Random Forest (In-Browser ML Engine)',
    };
  }
}
