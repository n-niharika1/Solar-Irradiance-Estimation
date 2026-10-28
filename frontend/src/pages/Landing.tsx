import { Link } from 'react-router-dom';
import {
  Sun,
  ArrowRight,
  TrendingUp,
  Cpu,
  Database,
  MapPin,
  ShieldCheck,
  CheckCircle,
  BarChart2,
  Compass,
} from 'lucide-react';
import MetricCard from '../components/MetricCard';

export default function Landing() {
  const models = [
    {
      name: 'Random Forest',
      status: 'Deployed Model',
      r2: '0.9600',
      mae: '0.1264 kWh/m²/day',
      rmse: '0.1762 kWh/m²/day',
      desc: 'Ensemble of decorrelated decision trees capturing non-linear relationships between atmospheric transmittance and spatial coordinates.',
      highlight: true,
    },
    {
      name: 'XGBoost',
      status: 'Evaluated Benchmark',
      r2: '0.9199',
      mae: '0.1843 kWh/m²/day',
      rmse: '0.2493 kWh/m²/day',
      desc: 'Gradient boosted decision trees optimizing residuals iteratively with second-order gradient approximations.',
      highlight: false,
    },
    {
      name: 'Neural Network (MLP)',
      status: 'Evaluated Benchmark',
      r2: '0.8765',
      mae: '0.2272 kWh/m²/day',
      rmse: '0.3096 kWh/m²/day',
      desc: 'Multi-layer perceptron with non-linear activations modeling continuous atmospheric radiation interactions.',
      highlight: false,
    },
    {
      name: 'Linear Regression',
      status: 'Baseline Benchmark',
      r2: '0.4523',
      mae: '0.5332 kWh/m²/day',
      rmse: '0.6519 kWh/m²/day',
      desc: 'Ordinary least squares linear baseline reflecting limitations of non-linear atmospheric absorption approximation.',
      highlight: false,
    },
  ];

  return (
    <div className="space-y-24 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 p-8 sm:p-12 md:p-16 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-solar-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-solar-gold/30 bg-solar-gold/10 px-3.5 py-1 text-xs font-semibold text-solar-gold">
            <Sun size={14} className="animate-spin-slow" />
            Academic Machine Learning Research Prototype
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Solar<span className="text-solar-gold">Sight</span> AI
          </h1>
          <p className="text-xl sm:text-2xl font-light text-slate-300">
            Machine Learning-Based Solar Irradiance Estimation Using Satellite and Meteorological Data
          </p>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
            A scientifically rigorous framework that predicts monthly mean daily Global Horizontal Irradiance (GHI) in <code className="text-solar-gold font-mono">kWh/m²/day</code>. Powered by trained ensemble learning on NASA POWER regional satellite observations across 2001–2025.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              to="/predict"
              className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-solar-gold to-amber-600 hover:from-amber-400 hover:to-amber-500 text-navy-900 font-bold px-6 py-3.5 text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Estimate Solar Radiation</span>
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/performance"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold px-6 py-3.5 text-sm transition-all"
            >
              <BarChart2 size={17} className="text-solar-gold" />
              <span>Model Evaluation Metrics</span>
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10">
          <MetricCard title="Validation R²" value="0.9600" subtitle="Initial Test Split" color="gold" icon={<ShieldCheck size={28} />} />
          <MetricCard title="Test MAE" value="0.1264" subtitle="kWh/m²/day Error" color="green" icon={<CheckCircle size={28} />} />
          <MetricCard title="Regional Locations" value="63" subtitle="NASA POWER India" color="blue" icon={<MapPin size={28} />} />
          <MetricCard title="Temporal Scope" value="2001–2025" subtitle="Monthly Aggregates" color="gold" icon={<Database size={28} />} />
        </div>
      </section>

      {/* Why GHI Estimation Matters */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Why Accurate GHI Estimation Matters
          </h2>
          <p className="text-sm text-slate-400">
            Global Horizontal Irradiance is the foundational metric determining photovoltaic yield, techno-economic feasibility, and renewable grid stability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-2xl border border-white/10 bg-navy-800/60 p-6 space-y-3 hover:border-solar-gold/40 transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-solar-gold border border-amber-500/20">
              <Compass size={20} />
            </div>
            <h3 className="text-base font-bold text-white">Solar Farm Siting</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enables utility developers to assess micro-climatic irradiation variations before committing capital expenditures for land procurement.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/60 p-6 space-y-3 hover:border-solar-gold/40 transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-base font-bold text-white">Rooftop PV Sizing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Provides building owners with seasonal yield projections to size inverter capacities and optimize storage batteries.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/60 p-6 space-y-3 hover:border-solar-gold/40 transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Database size={20} />
            </div>
            <h3 className="text-base font-bold text-white">Ground Sensor Sparsity</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ground pyranometers are capital-intensive and geographically sparse. Machine learning bridges coverage gaps via satellite reanalysis.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-navy-800/60 p-6 space-y-3 hover:border-solar-gold/40 transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Cpu size={20} />
            </div>
            <h3 className="text-base font-bold text-white">Renewable Grid Dispatch</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Aids system operators in balancing generation schedules against expected seasonal solar variability.
            </p>
          </div>
        </div>
      </section>

      {/* Machine Learning Pipeline Overview */}
      <section className="rounded-3xl border border-white/10 bg-navy-800/60 p-8 sm:p-10 space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-solar-gold">End-to-End Methodology</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Machine Learning Workflow</h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            How raw satellite and clear-sky irradiation metrics are processed and transformed into an operational inference endpoint.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="rounded-xl border border-white/10 bg-navy-900/80 p-5 space-y-2">
            <span className="text-xs font-mono font-bold text-solar-gold">STEP 01</span>
            <h3 className="text-sm font-bold text-white">NASA POWER Extraction</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Monthly meteorological solar data gathered across 63 regional coordinates spanning 2001–2025.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-navy-900/80 p-5 space-y-2">
            <span className="text-xs font-mono font-bold text-solar-gold">STEP 02</span>
            <h3 className="text-sm font-bold text-white">Spatial-Temporal Preparation</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Feature alignment: YEAR, LAT, LON, MONTH_NUM, and CLEARSKY index; outliers filtered.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-navy-900/80 p-5 space-y-2">
            <span className="text-xs font-mono font-bold text-solar-gold">STEP 03</span>
            <h3 className="text-sm font-bold text-white">Held-Out Location Split</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              50 locations for model training, with 13 completely unseen geographic locations reserved strictly for testing.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-navy-900/80 p-5 space-y-2">
            <span className="text-xs font-mono font-bold text-solar-gold">STEP 04</span>
            <h3 className="text-sm font-bold text-white">Model Benchmarking</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Evaluating Linear Regression, Random Forest, XGBoost, and MLP on identical test splits.
            </p>
          </div>

          <div className="rounded-xl border border-solar-gold/40 bg-navy-900/80 p-5 space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400">STEP 05</span>
            <h3 className="text-sm font-bold text-white">Artifact Deployment</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Serialization of the top Random Forest model via Joblib into this FastAPI & React application.
            </p>
          </div>
        </div>
      </section>

      {/* Models Explored Section */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Machine Learning Models Explored
            </h2>
            <p className="text-sm text-slate-400">
              Initial held-out location performance results across all four investigated algorithms.
            </p>
          </div>
          <Link
            to="/performance"
            className="text-xs font-semibold text-solar-gold hover:underline flex items-center gap-1"
          >
            Detailed Metrics Analysis &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {models.map((m, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border p-6 flex flex-col justify-between space-y-4 transition-all duration-300 ${
                m.highlight
                  ? 'border-solar-gold bg-gradient-to-b from-navy-800 to-navy-900 shadow-xl shadow-amber-500/10'
                  : 'border-white/10 bg-navy-800/60 hover:border-white/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-white">{m.name}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      m.highlight
                        ? 'border-solar-gold/40 bg-solar-gold/20 text-solar-gold'
                        : 'border-white/10 bg-white/5 text-slate-400'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mt-2">{m.desc}</p>
              </div>

              <div className="space-y-2 pt-4 border-t border-white/5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">R² Score:</span>
                  <span className={`font-mono font-bold ${m.highlight ? 'text-solar-gold' : 'text-white'}`}>
                    {m.r2}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">MAE:</span>
                  <span className="font-mono text-slate-200">{m.mae}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">RMSE:</span>
                  <span className="font-mono text-slate-200">{m.rmse}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-solar-gold/30 bg-solar-gold/10 p-4 text-xs text-amber-200 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-solar-gold shrink-0" />
            <span>
              <strong>Deployed System Notice:</strong> The prediction backend runs the genuine scikit-learn <strong>Random Forest</strong> serialized artifact (~273 MB) loaded directly into memory.
            </span>
          </div>
          <Link
            to="/predict"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-solar-gold text-navy-900 font-bold text-xs hover:bg-amber-400 transition-colors"
          >
            Launch Predictor &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
