import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import type { ModelComparisonItem } from '../types';

interface ModelComparisonChartProps {
  data: ModelComparisonItem[];
}

export default function ModelComparisonChart({ data }: ModelComparisonChartProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Errors Chart (MAE & RMSE) */}
      <div className="rounded-2xl border border-white/10 bg-navy-800/80 p-6 backdrop-blur-md shadow-2xl space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center justify-between">
            <span>Prediction Errors (MAE & RMSE)</span>
            <span className="text-[11px] text-emerald-400 font-normal">Lower is Better ↓</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Mean Absolute Error and Root Mean Squared Error across 13 held-out test locations (kWh/m²/day).
          </p>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#243044" opacity={0.6} />
              <XAxis
                dataKey="model"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#111d32',
                  borderColor: '#2e3d56',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [`${Number(val).toFixed(4)} kWh/m²/day`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="MAE" name="MAE (kWh/m²/day)" fill="#38bdf8" radius={[4, 4, 0, 0]} maxBarSize={30} />
              <Bar dataKey="RMSE" name="RMSE (kWh/m²/day)" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Goodness of Fit Chart (R²) */}
      <div className="rounded-2xl border border-white/10 bg-navy-800/80 p-6 backdrop-blur-md shadow-2xl space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center justify-between">
            <span>Coefficient of Determination (R²)</span>
            <span className="text-[11px] text-solar-gold font-normal">Closer to 1.0 is Better ↑</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Proportion of variance in observed GHI explained by the model on unseen locations.
          </p>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#243044" opacity={0.6} />
              <XAxis
                dataKey="model"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 1]} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#111d32',
                  borderColor: '#2e3d56',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [`${Number(val).toFixed(4)}`, 'R² Score']}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar
                dataKey="R2"
                name="R² Score (Unitless)"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
                maxBarSize={45}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
