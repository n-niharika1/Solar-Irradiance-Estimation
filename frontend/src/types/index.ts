// ── API Types matching FastAPI Backend ──

export interface PredictionRequest {
  year: number;
  latitude: number;
  longitude: number;
  month: number;
  clearsky: number;
}

export interface PredictionDetail {
  ghi: number;
  unit: string;
  description: string;
}

export interface PredictionInputs {
  year: number;
  latitude: number;
  longitude: number;
  month: number;
  month_name: string;
  clearsky: number;
}

export interface PredictionResponse {
  prediction: PredictionDetail;
  model: string;
  inputs: PredictionInputs;
  warnings: string[];
}

export interface BatchPredictionRequest {
  requests: PredictionRequest[];
}

export interface BatchPredictionResponse {
  results: PredictionResponse[];
}

export interface ModelMetrics {
  MAE: number;
  RMSE: number;
  R2: number;
}

export interface ModelInfo {
  model_name: string;
  features: string[];
  target: string;
  target_unit: string;
  evaluation_metrics: ModelMetrics;
  training_data: {
    description: string;
    locations: number;
    year_range: string;
  };
  test_info: {
    description: string;
    test_locations: number;
  };
}

export interface ModelComparisonItem {
  model: string;
  MAE: number;
  RMSE: number;
  R2: number;
  selected: boolean;
}

export interface ModelComparisonResponse {
  comparison: ModelComparisonItem[];
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  model_name: string;
}

// ── UI Form Types ──

export interface FormValues {
  latitude: string;
  longitude: string;
  year: string;
  month: string;
  clearsky: string;
}

export interface FormErrors {
  latitude?: string;
  longitude?: string;
  year?: string;
  month?: string;
  clearsky?: string;
}

export interface MonthlyDataPoint {
  month: string;
  monthNum: number;
  ghi: number;
  clearsky: number;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
  label: string;
  description: string;
}
