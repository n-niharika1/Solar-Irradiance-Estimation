import { useState } from 'react';
import { MapPin, Calendar, Sun, Sparkles, AlertCircle, Sliders, ChevronDown, ChevronUp, CloudSun } from 'lucide-react';
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
  {
    name: 'Vijayawada, AP',
    lat: '16.5062',
    lon: '80.6480',
    year: '2024',
    month: '5',
    clearsky: '6.8',
    dni: '4.5',
    diffuse: '3.1',
    cloud_amt: '55',
  },
  {
    name: 'New Delhi, DL',
    lat: '28.6139',
    lon: '77.2090',
    year: '2024',
    month: '4',
    clearsky: '6.5',
    dni: '5.0',
    diffuse: '2.9',
    cloud_amt: '35',
  },
  {
    name: 'Bengaluru, KA',
    lat: '12.9716',
    lon: '77.5946',
    year: '2024',
    month: '3',
    clearsky: '6.2',
    dni: '5.2',
    diffuse: '2.4',
    cloud_amt: '28',
  },
  {
    name: 'Ahmedabad, GJ',
    lat: '23.0225',
    lon: '72.5714',
    year: '2024',
    month: '5',
    clearsky: '7.1',
    dni: '5.6',
    diffuse: '2.8',
    cloud_amt: '22',
  },
];

export default function PredictionForm({ onSubmit, isLoading }: PredictionFormProps) {
  const [values, setValues] = useState<FormValues>({
    latitude: '16.5',
    longitude: '80.6',
    year: '2024',
    month: '1',
    clearsky: '6.2',
    dni: '',
    diffuse: '',
    cloud_amt: '',
    useAdvanced: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

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
      newErrors.clearsky = 'Clear-sky GHI (CLRSKY_SFC_SW_DWN) is required';
    } else if (cs < 0 || cs > 15) {
      newErrors.clearsky = 'Clear-sky value must be between 0 and 15 kWh/m²/day';
    }

    if (values.dni && (parseFloat(values.dni) < 0 || parseFloat(values.dni) > 15)) {
      newErrors.dni = 'DNI must be between 0 and 15 kWh/m²/day';
    }

    if (values.diffuse && (parseFloat(values.diffuse) < 0 || parseFloat(values.diffuse) > 15)) {
      newErrors.diffuse = 'Diffuse must be between 0 and 15 kWh/m²/day';
    }

    if (values.cloud_amt && (parseFloat(values.cloud_amt) < 0 || parseFloat(values.cloud_amt) > 100)) {
      newErrors.cloud_amt = 'Cloud amount must be between 0% and 100%';
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
      dni: values.dni ? parseFloat(values.dni) : undefined,
      diffuse: values.diffuse ? parseFloat(values.diffuse) : undefined,
      cloud_amt: values.cloud_amt ? parseFloat(values.cloud_amt) : undefined,
    });
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setValues({
      latitude: preset.lat,
      longitude: preset.lon,
      year: preset.year,
      month: preset.month,
      clearsky: preset.clearsky,
      dni: preset.dni,
      diffuse: preset.diffuse,
      cloud_amt: preset.cloud_amt,
      useAdvanced: true,
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
            Specify location, temporal period, and NASA POWER radiation metrics.
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
              className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 hover:border-solar-gold/50 hover:text-white transition-all cursor-pointer"
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

        {/* Clear-sky GHI (CLRSKY_SFC_SW_DWN) */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Clear-Sky Surface Solar Radiation (CLRSKY_SFC_SW_DWN)
            <Tooltip text="Theoretical cloud-free GHI (kWh/m²/day) from NASA POWER / CERES SYN1deg. Typical values range from 4.0 to 8.0 kWh/m²/day." />
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
            Represents the physical clear-sky downward shortwave flux ceiling (kWh/m²/day).
          </p>
        </div>

        {/* Advanced Features Accordion */}
        <div className="rounded-xl border border-white/10 bg-navy-900/60 p-4 space-y-3">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between text-left text-xs font-semibold text-solar-gold hover:text-amber-300 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Sliders size={15} />
              Advanced Solar & Atmospheric Features (DNI, DIFF, Cloud %)
            </span>
            {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showAdvanced && (
            <div className="space-y-4 pt-3 border-t border-white/5 animate-fade-in-up">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Provide custom direct beam and diffuse solar irradiance measurements, or leave blank for automatic atmospheric radiative transfer derivation.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* DNI */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Direct Normal (DNI)
                    <Tooltip text="ALLSKY_SFC_SW_DNI: Direct solar beam irradiance along the normal surface (kWh/m²/day). Essential for concentrating solar power & tracking systems." />
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={values.dni}
                    onChange={(e) => setValues({ ...values, dni: e.target.value })}
                    placeholder="Auto-derived"
                    className="w-full rounded-lg bg-navy-800 border border-white/10 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-solar-gold"
                  />
                  {errors.dni && <p className="mt-1 text-[10px] text-red-400">{errors.dni}</p>}
                </div>

                {/* Diffuse */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Diffuse Radiation (DIFF)
                    <Tooltip text="ALLSKY_SFC_SW_DIFF: Diffuse sky radiation scattered by air molecules, aerosols, and clouds (kWh/m²/day)." />
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={values.diffuse}
                    onChange={(e) => setValues({ ...values, diffuse: e.target.value })}
                    placeholder="Auto-derived"
                    className="w-full rounded-lg bg-navy-800 border border-white/10 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-solar-gold"
                  />
                  {errors.diffuse && <p className="mt-1 text-[10px] text-red-400">{errors.diffuse}</p>}
                </div>

                {/* Cloud Amount */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Cloud Amount (%)
                    <Tooltip text="CLOUD_AMT: Monthly mean cloud coverage percentage (0–100%). Modulates diffuse fraction and direct beam attenuation." />
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={values.cloud_amt}
                    onChange={(e) => setValues({ ...values, cloud_amt: e.target.value })}
                    placeholder="Auto-derived"
                    className="w-full rounded-lg bg-navy-800 border border-white/10 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-solar-gold"
                  />
                  {errors.cloud_amt && <p className="mt-1 text-[10px] text-red-400">{errors.cloud_amt}</p>}
                </div>
              </div>
            </div>
          )}
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
                <span>Computing Solar Irradiance...</span>
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
