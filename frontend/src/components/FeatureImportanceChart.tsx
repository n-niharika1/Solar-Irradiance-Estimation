import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Cell } from 'recharts';
import { Layers, Info } from 'lucide-react';

const FEATURE_IMPORTANCES = [
  { feature: 'CLEARSKY', importance: 0.85, label: 'Clear-Sky Radiation', desc: 'Theoretical cloudless physical upper ceiling' },
  { feature: 'LAT', importance: 0.06, label: 'Latitude', desc: 'Solar declination & air mass pathlength' },
  { feature: 'MONTH_NUM', importance: 0.05, label: 'Month of Year', desc: 'Annual seasonal monsoon & cloudiness cycles' },
  { feature: 'LON', importance: 0.03, label: 'Longitude', desc: 'East-west regional geographical variation' },
  { feature: 'YEAR', importance: 0.01, label: 'Calendar Year', desc: 'Long-term decadal trends & atmospheric aerosol shifts' },
];

const COLORS = ['#f59e0b', '#38bdf8', '#34d399', '#a78bfa', '#94a3b8'];

export default function FeatureImportanceChart() {
  return (
    <div className="rounded-2xl border border-white/10 bg-navy-800/80 p-6 md:p-8 backdrop-blur-md shadow-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="text-solar-gold" size={20} />
            Model Feature Importance
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Relative contribution of each input attribute to the Random Forest ensemble decision splits.
          </p>
        </div>
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300">
          Illustrative Relative Importance
        </span>
      </div>

      <div className="h-56 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={FEATURE_IMPORTANCES}
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <XAxis type="number" domain={[0, 1]} stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
            <YAxis type="category" dataKey="feature" stroke="#94a3b8" fontSize={12} tickLine={false} width={80} />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: '#111d32',
                borderColor: '#2e3d56',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
              formatter={(value: any, _: any, props: any) => [
                `${(Number(value) * 100).toFixed(1)}% (${props.payload.label})`,
                'Relative Weight',
              ]}
            />
            <Bar dataKey="importance" radius={[0, 6, 6, 0]}>
              {FEATURE_IMPORTANCES.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-400 pt-2 border-t border-white/5">
        {FEATURE_IMPORTANCES.map((f, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i] }} />
            <strong className="text-slate-200 font-mono">{f.feature}:</strong>
            <span className="truncate">{f.desc}</span>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2 rounded-lg bg-navy-900/50 p-2.5 text-[11px] text-slate-400 border border-white/5">
        <Info size={13} className="text-solar-gold shrink-0 mt-0.5" />
        <span>
          <strong>Key insight:</strong> Clear-sky radiation (<code className="text-solar-gold font-mono">CLEARSKY</code>) accounts for ~85% of tree split variance because it encodes the fundamental solar geometry and atmospheric ceiling. Location and temporal features refine regional cloudiness and seasonal attenuation.
        </span>
      </div>
    </div>
  );
}
