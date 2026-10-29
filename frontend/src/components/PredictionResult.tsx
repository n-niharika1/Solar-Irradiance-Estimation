import { Sun, CheckCircle2, AlertTriangle, ShieldCheck, Zap, Layers, Compass, Wind } from 'lucide-react';
import type { PredictionResponse } from '../types';

interface PredictionResultProps {
  data: PredictionResponse;
}

export default function PredictionResult({ data }: PredictionResultProps) {
  const pred = data.prediction;
  const ghi = pred.ghi;
  const dni = pred.dni ?? 0;
  const diffuse = pred.diffuse ?? 0;
  const directHoriz = pred.direct_horizontal ?? Math.max(0, ghi - diffuse);
  const diffFrac = pred.diffuse_fraction ?? (ghi > 0 ? diffuse / ghi : 0);
  const clearness = pred.clearness_index ?? (data.inputs.clearsky > 0 ? ghi / data.inputs.clearsky : 0);

  // Potential categorization
  const getPotential = (val: number) => {
    if (val >= 6.0) {
      return {
        level: 'Excellent Solar Potential',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
        desc: 'Ideal irradiation for utility-scale photovoltaic solar parks and high-yield rooftop installations.',
      };
    } else if (val >= 5.0) {
      return {
        level: 'Good Solar Potential',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        badgeColor: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30',
        desc: 'Strong solar harvest suitable for residential, commercial, and industrial rooftop generation.',
      };
    } else if (val >= 4.0) {
      return {
        level: 'Moderate Solar Potential',
        color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
        badgeColor: 'bg-blue-400/20 text-blue-300 border-blue-400/30',
        desc: 'Viable solar output; typical during monsoon, winter, or overcast regional weather patterns.',
      };
    } else {
      return {
        level: 'Low Solar Potential',
        color: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
        badgeColor: 'bg-slate-400/20 text-slate-300 border-slate-400/30',
        desc: 'Reduced irradiation; characteristic of heavy cloud cover, high latitude winters, or dense atmospheric turbidity.',
      };
    }
  };

  const potential = getPotential(ghi);
  const estimatedKwhPerKwp = Math.round(ghi * 30 * 0.75 * 10) / 10;

  return (
    <div className="rounded-2xl border border-white/10 bg-navy-800/80 p-6 md:p-8 backdrop-blur-md shadow-2xl space-y-6">
      {/* Top Banner / Warnings */}
      {data.warnings && data.warnings.length > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={18} />
            <div className="text-xs text-amber-200">
              {data.warnings.map((w, i) => (
                <p key={i}>{w}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main GHI Metric */}
      <div className="relative overflow-hidden rounded-2xl border border-solar-gold/30 bg-gradient-to-br from-solar-gold/15 via-navy-800 to-navy-900 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-solar-gold/30 bg-solar-gold/10 text-solar-gold">
                <ShieldCheck size={14} />
                Validated ML Estimate ({data.model})
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                  data.engine === 'backend'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : 'border-blue-500/30 bg-blue-500/10 text-blue-300'
                }`}
              >
                {data.engine === 'backend' ? 'FastAPI Backend Online' : 'In-Browser ML Engine (Resilient)'}
              </span>
            </div>

            <p className="text-sm font-medium uppercase tracking-wider text-slate-400">
              Global Horizontal Irradiance (ALLSKY_SFC_SW_DWN)
            </p>
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-5xl md:text-6xl font-black tracking-tight text-white">
                {ghi.toFixed(4)}
              </span>
              <span className="text-lg md:text-xl font-semibold text-solar-gold">
                {pred.unit}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Target Period: <strong className="text-white">{data.inputs.month_name} {data.inputs.year}</strong> at{' '}
              <strong className="text-white">{data.inputs.latitude.toFixed(2)}°N, {data.inputs.longitude.toFixed(2)}°E</strong>
            </p>
          </div>

          {/* Qualitative Badge Card */}
          <div className={`rounded-xl border p-4 max-w-xs ${potential.color}`}>
            <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full border ${potential.badgeColor}`}>
              {potential.level}
            </span>
            <p className="text-xs mt-2 text-slate-300 leading-relaxed">
              {potential.desc}
            </p>
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Zap size={13} className="text-solar-gold" />
                Est. Monthly Yield:
              </span>
              <span className="font-bold text-white">~{estimatedKwhPerKwp} kWh / kWp</span>
            </div>
          </div>
        </div>
      </div>

      {/* Solar Components Breakdown (GHI, DNI, DIFFUSE) */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
          <Layers size={16} className="text-solar-gold" />
          Solar Radiation Radiative Transfer Decomposition
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Direct Normal Irradiance (DNI) */}
          <div className="rounded-xl border border-white/10 bg-navy-900/70 p-4 space-y-1">
            <span className="text-[11px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
              <Compass size={13} className="text-amber-400" />
              Direct Normal (DNI)
            </span>
            <p className="text-2xl font-black text-white">
              {dni.toFixed(2)} <span className="text-xs text-solar-gold font-normal">kWh/m²/day</span>
            </p>
            <p className="text-[11px] text-slate-400">
              Beam component: <strong>{directHoriz.toFixed(2)}</strong> kWh/m²/day on horizontal plane.
            </p>
          </div>

          {/* Diffuse Irradiance (DIFF) */}
          <div className="rounded-xl border border-white/10 bg-navy-900/70 p-4 space-y-1">
            <span className="text-[11px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
              <Wind size={13} className="text-blue-400" />
              Diffuse Sky (DIFF)
            </span>
            <p className="text-2xl font-black text-white">
              {diffuse.toFixed(2)} <span className="text-xs text-blue-400 font-normal">kWh/m²/day</span>
            </p>
            <p className="text-[11px] text-slate-400">
              Diffuse fraction: <strong>{(diffFrac * 100).toFixed(1)}%</strong> of total GHI.
            </p>
          </div>

          {/* Clearness Index */}
          <div className="rounded-xl border border-white/10 bg-navy-900/70 p-4 space-y-1">
            <span className="text-[11px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
              <Sun size={13} className="text-emerald-400" />
              Clearness Index (kₜ)
            </span>
            <p className="text-2xl font-black text-white">
              {(clearness * 100).toFixed(1)}%
            </p>
            <p className="text-[11px] text-slate-400">
              GHI vs Clear-sky ratio ({data.inputs.clearsky.toFixed(2)} kWh/m²/day ceiling).
            </p>
          </div>
        </div>
      </div>

      {/* Feature Input Summary Table */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400" />
          Feature Input Summary (NASA POWER Meteorological Parameters)
        </h3>
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-navy-900/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-700/50 text-slate-400 border-b border-white/10">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Parameter</th>
                <th className="py-2.5 px-4 font-semibold">Dataset Column</th>
                <th className="py-2.5 px-4 font-semibold">Value Used</th>
                <th className="py-2.5 px-4 font-semibold">Scientific Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              <tr>
                <td className="py-2.5 px-4 font-semibold text-white">Year</td>
                <td className="py-2.5 px-4 font-mono text-solar-gold">YEAR</td>
                <td className="py-2.5 px-4 font-bold text-white">{data.inputs.year}</td>
                <td className="py-2.5 px-4 text-slate-400">Temporal year coordinate (2001–2025)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-white">Latitude</td>
                <td className="py-2.5 px-4 font-mono text-solar-gold">LAT</td>
                <td className="py-2.5 px-4 font-bold text-white">{data.inputs.latitude}°</td>
                <td className="py-2.5 px-4 text-slate-400">Geographic latitude in decimal degrees</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-white">Longitude</td>
                <td className="py-2.5 px-4 font-mono text-solar-gold">LON</td>
                <td className="py-2.5 px-4 font-bold text-white">{data.inputs.longitude}°</td>
                <td className="py-2.5 px-4 text-slate-400">Geographic longitude in decimal degrees</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-white">Month</td>
                <td className="py-2.5 px-4 font-mono text-solar-gold">MONTH_NUM</td>
                <td className="py-2.5 px-4 font-bold text-white">{data.inputs.month} ({data.inputs.month_name})</td>
                <td className="py-2.5 px-4 text-slate-400">Annual calendar month (1–12)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-white">Clear-Sky Irradiance</td>
                <td className="py-2.5 px-4 font-mono text-solar-gold">CLRSKY_SFC_SW_DWN</td>
                <td className="py-2.5 px-4 font-bold text-white">{data.inputs.clearsky} kWh/m²/day</td>
                <td className="py-2.5 px-4 text-slate-400">Irradiance under clear/cloudless sky</td>
              </tr>
              {data.inputs.dni && (
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-white">Direct Normal Irradiance</td>
                  <td className="py-2.5 px-4 font-mono text-solar-gold">ALLSKY_SFC_SW_DNI</td>
                  <td className="py-2.5 px-4 font-bold text-white">{data.inputs.dni} kWh/m²/day</td>
                  <td className="py-2.5 px-4 text-slate-400">Direct solar beam irradiance for tracking/CSP</td>
                </tr>
              )}
              {data.inputs.diffuse && (
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-white">Diffuse Sky Radiation</td>
                  <td className="py-2.5 px-4 font-mono text-solar-gold">ALLSKY_SFC_SW_DIFF</td>
                  <td className="py-2.5 px-4 font-bold text-white">{data.inputs.diffuse} kWh/m²/day</td>
                  <td className="py-2.5 px-4 text-slate-400">Atmospheric scattered diffuse irradiance</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scientific Transparency Notice */}
      <div className="rounded-xl border border-white/10 bg-navy-900/40 p-4 text-xs text-slate-400 space-y-1.5">
        <p className="font-semibold text-slate-300 flex items-center gap-1.5">
          <Sun size={14} className="text-solar-gold" />
          Atmospheric Radiative Transfer Law: GHI = DNI · cos(θz) + DIFF
        </p>
        <p>
          • <strong>Closure principle:</strong> Total downward global shortwave flux consists of the attenuated direct solar beam on a horizontal plane plus scattered diffuse sky radiation.
        </p>
        <p>
          • <strong>Physical Units:</strong> Reported in <code className="text-solar-gold">kWh/m²/day</code> (monthly mean daily total solar irradiation).
        </p>
      </div>
    </div>
  );
}
