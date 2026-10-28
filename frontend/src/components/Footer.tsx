import { Sun, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-navy-900/80">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-solar-gold to-amber-600">
              <Sun size={16} className="text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-white">
                Solar<span className="text-solar-gold">Sight</span> AI
              </span>
              <p className="text-[11px] text-slate-500">ML-Based Solar Irradiance Estimation</p>
            </div>
          </div>

          {/* Info */}
          <div className="text-center">
            <p className="text-xs text-slate-500">
              Powered by NASA POWER data &middot; Random Forest Model &middot; Built with React & FastAPI
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://power.larc.nasa.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-500 hover:text-solar-gold transition-colors"
            >
              NASA POWER
            </a>
            <a
              href="#"
              className="text-slate-500 hover:text-solar-gold transition-colors"
              aria-label="GitHub"
            >
              <Github size={16} />
            </a>
          </div>
        </div>

        <div className="mt-6 border-t border-white/5 pt-6 text-center">
          <p className="text-[11px] text-slate-600">
            &copy; {new Date().getFullYear()} SolarSight AI. Academic research project. Not for commercial use.
          </p>
        </div>
      </div>
    </footer>
  );
}
