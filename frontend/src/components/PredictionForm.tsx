import { useState } from 'react';
import { MapPin, Calendar, Sun, Sparkles, AlertCircle } from 'lucide-react';
import Tooltip from './Tooltip';
import type { FormValues, FormErrors, PredictionRequest } from '../types';

interface PredictionFormProps {
  onSubmit: (data: PredictionRequest) => Promise<void>;
  isLoading: boolean;
}

const MONTHS = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const PRESETS = [
  { name: 'Vijayawada, AP (Training Region)', lat: '16.5062', lon: '80.6480', year: '2024', month: '5', clearsky: '6.8' },
  { name: 'New Delhi, DL', lat: '28.6139', lon: '77.2090', year: '2024', month: '4', clearsky: '6.5' },
  { name: 'Bengaluru, KA', lat: '12.9716', lon: '77.5946', year: '2024', month: '3', clearsky: '6.2' },
  { name: 'Ahmedabad, GJ', lat: '23.0225', lon: '72.5714', year: '2024', month: '5', clearsky: '7.1' },
];

export default function PredictionForm({ onSubmit, isLoading }: PredictionFormProps) {
  const [values, setValues] = useState<FormValues>({
    latitude: '16.5',
    longitude: '80.6',
    year: '2024',
    month: '1',
    clearsky: '6.2',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    const lat = parseFloat(values.latitude);
    if (isNaN(lat)) {
      newErrors.latitude = 'Latitude is required';
    } else if (lat < -90 || lat > 90) {
      newErrors.latitude = 'Latitude must be between -90 and 90';
    }

    const lon = parseFloat(values.longitude);
    if (isNaN(lon)) {
      newErrors.longitude = 'Longitude is required';
    } else if (lon < -180 || lon > 180) {
      newErrors.longitude = 'Longitude must be between -180 and 180';
    }

    const yr = parseInt(values.year, 10);
    if (isNaN(yr)) {
      newErrors.year = 'Year is required';
    } else if (yr < 1985 || yr > 2030) {
      newErrors.year = 'Year must be between 1985 and 2030';
    }

    const mo = parseInt(values.month, 10);
    if (isNaN(mo) || mo < 1 || mo > 12) {
      newErrors.month = 'Please select a valid month';
    }

    const cs = parseFloat(values.clearsky);
    if (isNaN(cs)) {
      newErrors.clearsky = 'Clear-sky GHI is required';
    } else if (cs < 0 || cs > 15) {
      newErrors.clearsky = 'Clear-sky value must be between 0 and 15 kWh/m²/day';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      latitude: parseFloat(values.latitude),
      longitude: parseFloat(values.longitude),
      year: parseInt(values.year, 10),
      month: parseInt(values.month, 10),
      clearsky: parseFloat(values.clearsky),
    });
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setValues({
      latitude: preset.lat,
      longitude: preset.lon,
      year: preset.year,
      month: preset.month,
      clearsky: preset.clearsky,
    });
    setErrors({});
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-navy-800/80 p-6 md:p-8 backdrop-blur-md shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sun className="text-solar-gold" size={22} />
            Input Parameters
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Specify location, temporal period, and clear-sky radiation index.
          </p>
        </div>

        {/* Preset selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Sparkles size={13} className="text-solar-gold" />
            Presets:
          </span>
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(p)}
              className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 hover:border-solar-gold/50 hover:text-white transition-all"
            >
              {p.name.split(',')[0]}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Latitude */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Latitude (°N / °S)
              <Tooltip text="Geographic latitude in decimal degrees (-90 to 90). The regional training data focused on 63 Indian locations (8°N - 35°N)." />
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <MapPin size={17} />
              </div>
              <input
                type="number"
                step="any"
                value={values.latitude}
                onChange={(e) => setValues({ ...values, latitude: e.target.value })}
                placeholder="e.g. 16.50"
                className={`w-full rounded-xl bg-navy-900/90 border pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                  errors.latitude
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-white/10 focus:border-solar-gold'
                }`}
              />
            </div>
            {errors.latitude && (
              <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.latitude}
              </p>
            )}
          </div>

          {/* Longitude */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Longitude (°E / °W)
              <Tooltip text="Geographic longitude in decimal degrees (-180 to 180). Regional training data spans 68°E - 96°E." />
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <MapPin size={17} />
              </div>
              <input
                type="number"
                step="any"
                value={values.longitude}
                onChange={(e) => setValues({ ...values, longitude: e.target.value })}
                placeholder="e.g. 80.60"
                className={`w-full rounded-xl bg-navy-900/90 border pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                  errors.longitude
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-white/10 focus:border-solar-gold'
                }`}
              />
            </div>
            {errors.longitude && (
              <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.longitude}
              </p>
            )}
          </div>

          {/* Year */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Year (1985 – 2030)
              <Tooltip text="Target calendar year. Model training range is 2001–2025. Inputs outside 2001–2025 trigger an out-of-domain caution notice." />
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Calendar size={17} />
              </div>
              <input
                type="number"
                step="1"
                value={values.year}
                onChange={(e) => setValues({ ...values, year: e.target.value })}
                placeholder="2024"
                className={`w-full rounded-xl bg-navy-900/90 border pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                  errors.year
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-white/10 focus:border-solar-gold'
                }`}
              />
            </div>
            {errors.year && (
              <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.year}
              </p>
            )}
          </div>

          {/* Month */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Month
              <Tooltip text="Target calendar month (1-12). Seasonality strongly modulates solar declination and zenith angle." />
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Calendar size={17} />
              </div>
              <select
                value={values.month}
                onChange={(e) => setValues({ ...values, month: e.target.value })}
                className={`w-full rounded-xl bg-navy-900/90 border pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-colors appearance-none cursor-pointer ${
                  errors.month
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-white/10 focus:border-solar-gold'
                }`}
              >
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value} className="bg-navy-900 text-white">
                    {m.label} ({m.value})
                  </option>
                ))}
              </select>
            </div>
            {errors.month && (
              <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.month}
              </p>
            )}
          </div>
        </div>

        {/* Clear-sky GHI */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Clear-Sky Solar Radiation (kWh/m²/day)
            <Tooltip text="Theoretical monthly mean daily GHI under completely cloud-free conditions from NASA POWER / satellite models. Typical values range from 4.0 to 8.5 kWh/m²/day." />
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-solar-gold">
              <Sun size={17} />
            </div>
            <input
              type="number"
              step="any"
              value={values.clearsky}
              onChange={(e) => setValues({ ...values, clearsky: e.target.value })}
              placeholder="e.g. 6.20"
              className={`w-full rounded-xl bg-navy-900/90 border pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                errors.clearsky
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-white/10 focus:border-solar-gold'
              }`}
            />
          </div>
          {errors.clearsky && (
            <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.clearsky}
            </p>
          )}
          <p className="mt-1.5 text-[11px] text-slate-400">
            Note: CLEARSKY represents the physical upper ceiling of solar irradiation without cloud attenuation.
          </p>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-solar-gold to-amber-600 hover:from-amber-400 hover:to-amber-500 text-navy-900 font-bold py-3.5 px-6 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-navy-900 border-t-transparent" />
                <span>Running Machine Learning Model...</span>
              </>
            ) : (
              <>
                <Sun size={18} />
                <span>Estimate Monthly Mean GHI</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
