import { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { BarChart3, Play, AlertCircle, Info } from 'lucide-react';
import { batchPredictGHI } from '../api/predictions';
import type { MonthlyDataPoint } from '../types';

interface MonthlyTrendChartProps {
  latitude: number;
  longitude: number;
  year: number;
  baseClearsky: number;
}

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export default function MonthlyTrendChart({
  latitude,
  longitude,
  year,
  baseClearsky,
}: MonthlyTrendChartProps) {
  const [data, setData] = useState<MonthlyDataPoint[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMonthlyTrend = async () => {
    setLoading(true);
    setError(null);
    try {
      const requests = Array.from({ length: 12 }, (_, i) => ({
        year,
        latitude,
        longitude,
        month: i + 1,
        clearsky: baseClearsky,
      }));

      const res = await batchPredictGHI(requests);
      const points: MonthlyDataPoint[] = res.results.map((r, i) => ({
        month: MONTH_NAMES[i],
        monthNum: i + 1,
        ghi: r.prediction.ghi,
        dni: r.prediction.dni ?? 0,
        diffuse: r.prediction.diffuse ?? 0,
        clearsky: baseClearsky,
      }));

      setData(points);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to generate monthly trend';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const peak = data ? [...data].sort((a, b) => b.ghi - a.ghi)[0] : null;
  const lowest = data ? [...data].sort((a, b) => a.ghi - b.ghi)[0] : null;
  const annualMean = data
    ? (data.reduce((acc, curr) => acc + curr.ghi, 0) / data.length).toFixed(2)
    : null;

  return (
    <div className="rounded-2xl border border-white/10 bg-navy-800/80 p-6 md:p-8 backdrop-blur-md shadow-2xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="text-solar-gold" size={20} />
            12-Month Annual Irradiation Profile
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Simulates GHI (ALLSKY_SFC_SW_DWN), Direct Normal (DNI), and Diffuse (DIFF) across all 12 calendar months for ({latitude.toFixed(2)}°N, {longitude.toFixed(2)}°E).
          </p>
        </div>

        <button
          onClick={generateMonthlyTrend}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-navy-700 hover:bg-navy-600 border border-white/15 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-solar-gold border-t-transparent" />
              <span>Simulating 12 Months...</span>
            </>
          ) : (
            <>
              <Play size={14} className="text-solar-gold fill-solar-gold" />
              <span>{data ? 'Recalculate 12-Month Curve' : 'Generate 12-Month Curve'}</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      {data ? (
        <div className="space-y-5">
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-white/5 bg-navy-900/60 p-3">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">Annual Average GHI</span>
              <p className="text-lg font-bold text-white mt-1">
                {annualMean} <span className="text-xs text-solar-gold font-normal">kWh/m²/day</span>
              </p>
            </div>
            <div className="rounded-xl border border-white/5 bg-navy-900/60 p-3">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">Peak Month</span>
              <p className="text-lg font-bold text-emerald-400 mt-1">
                {peak?.month} ({peak?.ghi.toFixed(2)})
              </p>
            </div>
            <div className="rounded-xl border border-white/5 bg-navy-900/60 p-3">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">Lowest Month</span>
              <p className="text-lg font-bold text-blue-400 mt-1">
                {lowest?.month} ({lowest?.ghi.toFixed(2)})
              </p>
            </div>
          </div>

          {/* Recharts chart */}
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#243044" opacity={0.6} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 'auto']} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#111d32',
                    borderColor: '#2e3d56',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(value: any, name: any) => [`${Number(value).toFixed(2)} kWh/m²/day`, name]}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
                <Bar
                  dataKey="ghi"
                  name="GHI (Global Horizontal)"
                  fill="#f59e0b"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={32}
                />
                <Line
                  type="monotone"
                  dataKey="dni"
                  name="DNI (Direct Normal)"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dot={{ fill: '#38bdf8', r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="diffuse"
                  name="DIFF (Diffuse Radiation)"
                  stroke="#a78bfa"
                  strokeWidth={2}
                  dot={{ fill: '#a78bfa', r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-navy-900/50 p-3 text-[11px] text-slate-400 border border-white/5">
            <Info size={14} className="text-solar-gold shrink-0 mt-0.5" />
            <span>
              <strong>Solar Physics Insight:</strong> Notice how Direct Normal Irradiance (DNI) drops sharply during monsoon months (June–August) while Diffuse (DIFF) peaks due to cloud scatter, precisely reflecting the NASA POWER regional dataset.
            </span>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/10 bg-navy-900/30 p-8 text-center text-slate-400">
          <p className="text-xs">
            Click <strong>"Generate 12-Month Curve"</strong> to run the model across January through December for this geographic location.
          </p>
        </div>
      )}
    </div>
  );
}
