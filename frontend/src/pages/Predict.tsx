import { useState } from 'react';
import { Sun, AlertCircle } from 'lucide-react';
import PredictionForm from '../components/PredictionForm';
import PredictionResult from '../components/PredictionResult';
import MonthlyTrendChart from '../components/MonthlyTrendChart';
import FeatureImportanceChart from '../components/FeatureImportanceChart';
import { predictGHI } from '../api/predictions';
import type { PredictionRequest, PredictionResponse } from '../types';

export default function Predict() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);

  // Keep track of latest submitted params for the trend chart
  const [currentParams, setCurrentParams] = useState<PredictionRequest>({
    year: 2024,
    latitude: 16.5,
    longitude: 80.6,
    month: 1,
    clearsky: 6.2,
  });

  const handlePredict = async (data: PredictionRequest) => {
    setLoading(true);
    setError(null);
    setCurrentParams(data);

    try {
      const res = await predictGHI(data);
      setResult(res);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail ||
            'Prediction request failed. Ensure the FastAPI backend server is running on http://localhost:8000.'
          : err instanceof Error
          ? err.message
          : 'Unable to communicate with the model server.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 py-8">
      {/* Header */}
      <div className="space-y-2 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-solar-gold/30 bg-solar-gold/10 px-3 py-1 text-xs font-semibold text-solar-gold">
          <Sun size={14} />
          Inference Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Global Horizontal Irradiance (GHI) Estimation
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Enter geographic coordinates, temporal parameters, and theoretical clear-sky irradiation to query the trained Random Forest model.
        </p>
      </div>

      {/* Error alert */}
      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="block font-semibold">Backend Inference Error</strong>
              <p className="text-xs text-red-300">{error}</p>
              <p className="text-[11px] text-red-400/80 pt-1">
                Tip: Run <code className="bg-black/30 px-1 py-0.5 rounded font-mono">uvicorn main:app --reload</code> in the <code className="bg-black/30 px-1 py-0.5 rounded font-mono">backend</code> folder to launch the local API.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Form & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-5 space-y-6">
          <PredictionForm onSubmit={handlePredict} isLoading={loading} />
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="space-y-8 animate-fade-in-up">
              <PredictionResult data={result} />
              <MonthlyTrendChart
                latitude={currentParams.latitude}
                longitude={currentParams.longitude}
                year={currentParams.year}
                baseClearsky={currentParams.clearsky}
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-navy-800/40 p-12 text-center text-slate-400 space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-solar-gold">
                <Sun size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-white">No Prediction Generated Yet</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Select your desired latitude, longitude, and clear-sky index or choose an example preset on the left, then click <strong>"Estimate Monthly Mean GHI"</strong>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feature Importance Section */}
      <div className="pt-4">
        <FeatureImportanceChart />
      </div>
    </div>
  );
}
