import {
  BookOpen,
  Target,
  Database,
  Layers,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-12 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-solar-gold/30 bg-solar-gold/10 px-3 py-1 text-xs font-semibold text-solar-gold">
          <BookOpen size={14} />
          Academic Project Documentation
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          About SolarSight AI
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Machine Learning-Based Solar Irradiance Estimation Using Satellite and Meteorological Data.
        </p>
      </div>

      {/* Problem Statement & Motivation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-navy-800/80 p-6 md:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-solar-gold border border-amber-500/20">
              <Target size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Problem Statement</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Precise solar irradiance knowledge is imperative for assessing solar photovoltaic performance, sizing battery energy storage systems, and dispatching renewable generation onto the electric grid.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            However, ground-based radiometers (such as thermopile pyranometers) are expensive to procure, maintain, and calibrate, leaving substantial geographic expanses devoid of continuous surface measurements. Satellite observations and meteorological reanalyses offer ubiquitous coverage but necessitate accurate machine learning mappings to estimate surface Global Horizontal Irradiance (GHI).
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/80 p-6 md:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Lightbulb size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Project Motivation</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            With global decarbonization goals driving exponential growth in solar PV capacity, project planners require accessible, transparent tools for preliminary resource assessment.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            SolarSight AI bridges the gap between complex raw satellite data and actionable energy analytics by packaging a validated scikit-learn Random Forest model into an interactive, scientific web dashboard that respects physical units and transparency.
          </p>
        </div>
      </div>

      {/* Project Objectives */}
      <div className="rounded-2xl border border-white/10 bg-navy-800/80 p-6 md:p-8 space-y-5 shadow-xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="text-solar-gold" size={20} />
          Core Research Objectives
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-white/5 bg-navy-900/60 p-4 space-y-2">
            <span className="text-xs font-mono font-bold text-solar-gold">OBJECTIVE 1</span>
            <h3 className="text-sm font-bold text-white">Dataset Compilation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compile monthly meteorological and solar radiation metrics from the NASA POWER database across 63 regional Indian coordinates spanning 2001 to 2025.
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-navy-900/60 p-4 space-y-2">
            <span className="text-xs font-mono font-bold text-solar-gold">OBJECTIVE 2</span>
            <h3 className="text-sm font-bold text-white">Model Benchmarking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Train and compare multiple algorithms (Linear Regression, Random Forest, XGBoost, and MLP) using a strict 13-location held-out spatial test partition.
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-navy-900/60 p-4 space-y-2">
            <span className="text-xs font-mono font-bold text-solar-gold">OBJECTIVE 3</span>
            <h3 className="text-sm font-bold text-white">Interactive Deployment</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Integrate the trained Random Forest model with a production-ready FastAPI backend and React frontend dashboard for open academic access.
            </p>
          </div>
        </div>
      </div>

      {/* Dataset & Methodology Details */}
      <div className="rounded-2xl border border-white/10 bg-navy-800/80 p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Database size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Dataset & Feature Engineering</h2>
            <p className="text-xs text-slate-400">NASA POWER Regional Monthly Data (2001–2025)</p>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            The training data originates from the <strong>NASA Prediction of Worldwide Energy Resources (POWER)</strong> project, derived from GEOS-5 atmospheric assimilation models and CERES satellite radiometer observations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="rounded-xl bg-navy-900/80 p-4 border border-white/5 space-y-2">
              <strong className="text-slate-200 block text-xs uppercase tracking-wider text-solar-gold">
                Input Features (Exact Order)
              </strong>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 font-mono">
                <li>1. YEAR (Temporal trend)</li>
                <li>2. LAT (Geographic latitude in decimal degrees)</li>
                <li>3. LON (Geographic longitude in decimal degrees)</li>
                <li>4. MONTH_NUM (Calendar month 1–12)</li>
                <li>5. CLEARSKY (Clear-sky GHI in kWh/m²/day)</li>
              </ul>
            </div>

            <div className="rounded-xl bg-navy-900/80 p-4 border border-white/5 space-y-2">
              <strong className="text-slate-200 block text-xs uppercase tracking-wider text-emerald-400">
                Target Variable
              </strong>
              <div className="space-y-1 text-xs text-slate-300">
                <p>
                  <strong className="text-white font-mono">GHI:</strong> Global Horizontal Irradiance
                </p>
                <p>
                  <strong className="text-white">Target Unit:</strong> <code className="text-solar-gold font-mono">kWh/m²/day</code> (monthly mean daily total solar irradiation)
                </p>
                <p className="text-[11px] text-slate-400 pt-1">
                  <em>Note:</em> Direct Normal Irradiance (DNI) and Diffuse Horizontal Irradiance (DIFFUSE) were available in source files but are not input features for this saved model.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Research Limitations & Scientific Transparency */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 md:p-8 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <AlertTriangle className="text-amber-400" size={20} />
          Scientific Limitations & Boundaries
        </h2>
        <ul className="space-y-2 text-xs text-slate-300 leading-relaxed list-disc list-inside">
          <li>
            <strong>Temporal Granularity:</strong> The model estimates <em>monthly mean daily values</em> in <code className="text-amber-300">kWh/m²/day</code>. It does not provide instantaneous or sub-hourly power forecasting in <code className="text-amber-300">W/m²</code>.
          </li>
          <li>
            <strong>Clear-Sky Dependency:</strong> The model requires <code className="text-amber-300">CLEARSKY</code> as an explicit input feature. In this prototype, users must supply this parameter manually.
          </li>
          <li>
            <strong>Geographic Domain:</strong> The 63 training locations are concentrated within the Indian subcontinent (8°N–35°N, 68°E–96°E). Predictions in polar, maritime, or high-altitude regions outside this domain carry higher uncertainty.
          </li>
          <li>
            <strong>Validation Scope:</strong> Evaluated strictly on 13 held-out NASA POWER satellite locations. It has <em>not</em> been independently calibrated against ground-based BSRN thermopile pyranometer stations.
          </li>
        </ul>
      </div>

      {/* Potential Applications & Future Scope */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-navy-800/80 p-6 space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="text-solar-gold" size={18} />
            Potential Real-World Applications
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li>• Preliminary site suitability analysis for ground-mount solar PV farms.</li>
            <li>• Rooftop solar potential assessment for residential and commercial premises.</li>
            <li>• Hybrid renewable energy system sizing (solar + wind + battery storage).</li>
            <li>• Academic pedagogy for environmental data science and energy informatics.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-navy-800/80 p-6 space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="text-blue-400" size={18} />
            Proposed Future Enhancements
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li>• Direct live integration with the NASA POWER REST API for automated clear-sky lookup.</li>
            <li>• Incorporating additional meteorological variables: Aerosol Optical Depth (AOD) and Cloud Fraction.</li>
            <li>• Ground calibration against India Meteorological Department (IMD) / BSRN station data.</li>
            <li>• Extension to sub-daily hourly irradiance and Direct Normal Irradiance (DNI) models.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
