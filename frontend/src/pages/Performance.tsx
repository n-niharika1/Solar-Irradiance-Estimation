import { useEffect, useState } from 'react';
import {
  Award,
  CheckCircle,
  BarChart3,
  BookOpen,
  Info,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import ModelComparisonChart from '../components/ModelComparisonChart';
import MetricCard from '../components/MetricCard';
import { getModelComparison } from '../api/predictions';
import type { ModelComparisonItem } from '../types';

const STATIC_COMPARISON: ModelComparisonItem[] = [
  { model: 'Random Forest', MAE: 0.1264, RMSE: 0.1762, R2: 0.9600, selected: true },
  { model: 'XGBoost', MAE: 0.1843, RMSE: 0.2493, R2: 0.9199, selected: false },
  { model: 'Neural Network (MLP)', MAE: 0.2272, RMSE: 0.3096, R2: 0.8765, selected: false },
  { model: 'Linear Regression', MAE: 0.5332, RMSE: 0.6519, R2: 0.4523, selected: false },
];

export default function Performance() {
  const [data, setData] = useState<ModelComparisonItem[]>(STATIC_COMPARISON);

  useEffect(() => {
    // Attempt to fetch from backend API, fallback to static if server not yet started
    getModelComparison()
      .then((res) => {
        if (res.comparison && res.comparison.length > 0) {
          setData(res.comparison);
        }
      })
      .catch(() => {
        // Use static data silently
      });
  }, []);

  return (
    <div className="space-y-12 py-8">
      {/* Header */}
      <div className="space-y-2 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-solar-gold/30 bg-solar-gold/10 px-3 py-1 text-xs font-semibold text-solar-gold">
          <Award size={14} />
          Empirical Validation Results
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Model Evaluation & Benchmarking
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Comparative assessment of machine learning algorithms evaluated on 13 held-out spatial locations with zero training overlap.
        </p>
      </div>

      {/* Top Best Model Highlight Card */}
      <div className="rounded-2xl border border-solar-gold/40 bg-gradient-to-br from-solar-gold/10 via-navy-800 to-navy-900 p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Top Performing Algorithm
              </span>
              <span className="text-xs text-slate-400 font-mono">Ensemble Regressor</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Random Forest Regressor
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Random Forest demonstrated superior generalization capability across unobserved geographic coordinates, achieving the lowest absolute error and explaining 96.00% of spatial solar variance.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center px-4 py-3 rounded-xl bg-navy-900/80 border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">R² Score</span>
              <span className="text-2xl font-black text-solar-gold">0.9600</span>
            </div>
            <div className="text-center px-4 py-3 rounded-xl bg-navy-900/80 border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">MAE</span>
              <span className="text-2xl font-black text-emerald-400">0.1264</span>
            </div>
            <div className="text-center px-4 py-3 rounded-xl bg-navy-900/80 border border-white/10">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">RMSE</span>
              <span className="text-2xl font-black text-blue-400">0.1762</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="text-solar-gold" size={20} />
            Algorithm Benchmark Comparison
          </h2>
          <span className="text-xs text-slate-400">
            Evaluation Split: 13 Independent Held-Out Locations
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/80 backdrop-blur-md shadow-xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy-700/60 text-slate-300 border-b border-white/10 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Model Architecture</th>
                <th className="py-3.5 px-6 text-right">MAE (kWh/m²/day)</th>
                <th className="py-3.5 px-6 text-right">RMSE (kWh/m²/day)</th>
                <th className="py-3.5 px-6 text-right">R² Score</th>
                <th className="py-3.5 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {data.map((row, i) => (
                <tr
                  key={i}
                  className={`transition-colors ${
                    row.selected
                      ? 'bg-solar-gold/10 font-medium text-white'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <td className="py-4 px-6 flex items-center gap-2">
                    {row.selected && <CheckCircle size={16} className="text-solar-gold shrink-0" />}
                    <span className="font-semibold">{row.model}</span>
                  </td>
                  <td className="py-4 px-6 text-right font-mono">{row.MAE.toFixed(4)}</td>
                  <td className="py-4 px-6 text-right font-mono">{row.RMSE.toFixed(4)}</td>
                  <td className="py-4 px-6 text-right font-mono font-bold text-solar-gold">
                    {row.R2.toFixed(4)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {row.selected ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-solar-gold/20 text-solar-gold border border-solar-gold/30">
                        <Zap size={12} />
                        Deployed in API
                      </span>
                    ) : (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs text-slate-400 bg-white/5 border border-white/10">
                        Evaluated Baseline
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Visualizations */}
      <ModelComparisonChart data={data} />

      {/* Metric Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-white/10 bg-navy-800/80 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Mean Absolute Error</h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              MAE
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Calculates the average magnitude of prediction errors without regard to direction:
          </p>
          <div className="rounded-lg bg-navy-900/80 p-2.5 font-mono text-xs text-center text-solar-gold border border-white/5">
            MAE = (1/n) Σ |yᵢ - ŷᵢ|
          </div>
          <p className="text-[11px] text-slate-400">
            Reported in <strong className="text-slate-200">kWh/m²/day</strong>. A value of 0.1264 means model estimates deviate by only ~0.126 kWh on average from regional observations.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/80 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Root Mean Squared Error</h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
              RMSE
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Quadratic scoring rule that squares deviations, penalizing larger outliers heavily:
          </p>
          <div className="rounded-lg bg-navy-900/80 p-2.5 font-mono text-xs text-center text-solar-gold border border-white/5">
            RMSE = √[(1/n) Σ (yᵢ - ŷᵢ)²]
          </div>
          <p className="text-[11px] text-slate-400">
            Reported in <strong className="text-slate-200">kWh/m²/day</strong>. Random Forest’s low RMSE (0.1762) confirms the absence of extreme catastrophic prediction errors.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/80 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">R² Score</h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-solar-gold border border-amber-500/20">
              R²
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Coefficient of determination quantifying the proportion of variance explained:
          </p>
          <div className="rounded-lg bg-navy-900/80 p-2.5 font-mono text-xs text-center text-solar-gold border border-white/5">
            R² = 1 - [SS_res / SS_tot]
          </div>
          <p className="text-[11px] text-slate-400">
            <strong className="text-slate-200">Unitless</strong> metric bounded at 1.0. A score of 0.9600 indicates that 96% of the variance across unseen test regions is captured.
          </p>
        </div>
      </div>

      {/* Methodology Disclaimers */}
      <div className="rounded-2xl border border-white/10 bg-navy-800/60 p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
          <ShieldCheck size={18} className="text-solar-gold" />
          Evaluation Methodology & Validation Scope
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400 leading-relaxed">
          <div className="rounded-xl bg-navy-900/50 p-4 border border-white/5 space-y-1.5">
            <strong className="text-slate-200 block">Spatial Holdout Partitioning:</strong>
            <p>
              Standard random train/test splits overestimate real-world performance on geographic data due to spatial autocorrelation. To prevent spatial leakage, 13 entire regional stations were completely excluded from model training and used purely for evaluation.
            </p>
          </div>
          <div className="rounded-xl bg-navy-900/50 p-4 border border-white/5 space-y-1.5">
            <strong className="text-slate-200 block">Historical Metric Integrity:</strong>
            <p>
              These evaluation results represent documented offline validation scores from the research experiment. They are not fabricated or dynamically recalculated at runtime, providing transparent academic traceability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
