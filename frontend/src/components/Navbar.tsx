import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Menu, X } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/predict', label: 'Predict' },
  { to: '/performance', label: 'Performance' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="glass fixed top-0 left-0 right-0 z-50 shadow-lg shadow-black/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-solar-gold to-amber-600 shadow-md shadow-amber-500/20 transition-transform group-hover:scale-110">
              <Sun size={20} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Solar<span className="text-solar-gold">Sight</span> AI
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? 'bg-white/10 text-solar-gold'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-white/5">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-white/10 text-solar-gold'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
